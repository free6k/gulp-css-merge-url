'use strict';
var assert = require('stream-assert');
var should = require('should');
var path = require('path');
var fs = require('fs');
var File = require('gulp-util').File;
var gulp = require('gulp');
var cmu = require('./../index');
require('mocha');

var fixture = path.join(__dirname, '/fixtures/test.css');
var result = path.join(__dirname, '/results/result.css');

describe('gulp-css-merge-url', function () {

	describe('cmu()', function () {

		it('should emit error on streamed file', function (done) {
			gulp.src(fixture, {buffer: false})
				.pipe(cmu())
				.on('error', function (err) {
					err.message.should.eql('Streaming not supported');
					done();
				});
		});

		it('should merge css selectors that contain the same URL', function (done) {
			gulp.src(fixture)
				.pipe(cmu())
				.pipe(assert.length(1))
				.pipe(assert.first(function (d) {
					d.contents.toString().should.eql(fs.readFileSync(result, 'utf8').toString());
				}))
				.pipe(assert.end(done));
		});

	});

});
