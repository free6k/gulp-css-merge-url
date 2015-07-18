'use strict';

var path = require('path');
var through = require('through2');
var binaryString = require('binary-string');
var cssparse = require('css');
var crypto = require('crypto');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;

function clearSource(string) {
    return string.replace(/([\s|"|'])/i, '');
}

function md5(string) {
    return crypto.createHash('md5').update(string).digest('hex');
}

function parseCMU(rule) {
    var cmu = {};
	var source_pattern = /(url\(.*?\))($|\s|;)/i;
	var source_pattern_g = /(url\(.*?\))($|\s|;)/ig;

    var sel = rule.selectors;
    var decl = rule.declarations;

    if (decl && decl.length > 0) {

        decl.forEach(function (declaration, i) {
            var property = declaration.property;
            var value = declaration.value;

            if (property && value
                && property.indexOf('background') > -1
                && value.indexOf('url') > -1) {
                var source = value.match(source_pattern);

                if (source && source.length > 0) {
                    var s = source[0];
                    var key = md5(clearSource(s));

                    if (key in cmu) {
                        cmu[key].selectors = cmu[key].selectors.concat(sel);
                    } else {
                        cmu[key] = {url: s, selectors: sel};
                    }

                    if (property == 'background-image') {
                        rule.declarations.splice(i, 1);
                    } else {
                        declaration.value = declaration.value.replace(source_pattern_g, '').trim();

                        if (declaration.value.split(' ').length == 1 && declaration.value.length == 0) {
                            rule.declarations.splice(i, 1);
                        }
                    }
                }
            }
        });

        return cmu;
    }
}

function mergeCMU(cmu_parse, cmu) {
    var key = getCMUKey(cmu_parse);

    if (cmu === undefined) {
        cmu = {};
    }

    if (key in cmu) {
        cmu[key].selectors = cmu[key].selectors.concat(cmu_parse[key].selectors);
    } else {
        cmu[key] = cmu_parse[key];
    }

    return cmu;
}

function getCMUKey(cmu) {
    var keys = Object.keys(cmu);

    if (keys.length > 0) {
        return keys[0];
    }

    return undefined;
}

function goCMU(rules, resultObj, type) {
    rules.forEach(function (rule) {
        var parseRule = {};

        if (type === undefined) {
            type = 'rule';
        }

        if (rule.type == 'media') {
            goCMU(rule.rules, resultObj, rule.media);
        } else if (rule.type == 'rule' && rule.declarations.length > 0) {
            parseRule = parseCMU(rule);

            if (Object.keys(parseRule).length > 0) {
                resultObj[type] = mergeCMU(parseRule, resultObj[type]);
            }
        }
    });
}

function insertCSSObject(cmu, css) {
    var cmu_rules = {};

    Object.keys(cmu).forEach(function (key) {

        Object.keys(cmu[key]).forEach(function (key2) {

            var item = cmu[key][key2];

            var rule = {
                type: 'rule',
                selectors: item.selectors,
                declarations: [
                    {
                        type: 'declaration',
                        property: 'background-image',
                        value: item.url
                    }
                ]
            };

            if (key == 'rule') {

                if ('rules' in cmu_rules) {
                    cmu_rules['rules'].push(rule);
                } else {
                    cmu_rules['rules'] = [rule];
                }

            } else {

                if (key in cmu_rules) {
                    cmu_rules[key][0].rules.push(rule);
                } else {
                    cmu_rules[key] = [{
                        type: 'media',
                        media: key,
                        rules: [rule]
                    }];
                }

            }

        });

    });

    Object.keys(cmu_rules).forEach(function (key) {
        css.stylesheet.rules.push.apply(css.stylesheet.rules, cmu_rules[key]);
    });

}

function gulpCMU() {

    return through.obj(function (file, enc, cb) {

        if (file.isNull()) {
            cb();
            return;
        }

        if (file.isStream()) {
            this.emit('error', new PluginError('gulp-css-merge-url', 'Streaming not supported'));
            cb();
            return;
        }

        var css = null;
        var CSSObjects = {};

        if (file.isBuffer()) {
            css = binaryString.fromBuffer(file.contents);
            css = cssparse.parse(css);
        }

        if (typeof css !== 'undefined' && css) {
            if (css.type === 'stylesheet' && css.stylesheet.rules.length > 0) {
                goCMU(css.stylesheet.rules, CSSObjects);
            }

            if (file.isBuffer() && Object.keys(CSSObjects).length > 0) {
                insertCSSObject(CSSObjects, css);
                file.contents = new Buffer(cssparse.stringify(css));
            }
        }

        cb(null, file);
    });

}

module.exports = gulpCMU;
