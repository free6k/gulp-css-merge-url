# gulp-cms [![Build Status](https://travis-ci.org/free6k/gulp-cms.svg?branch=master)](https://travis-ci.org/free6k/gulp-cms)

> My mind-blowing gulp plugin


## Install

```
$ npm install --save-dev gulp-cms
```


## Usage

```js
var gulp = require('gulp');
var cms = require('gulp-cms');

gulp.task('default', function () {
	return gulp.src('src/file.ext')
		.pipe(cms())
		.pipe(gulp.dest('dist'));
});
```


## API

### cms(options)

#### options

##### foo

Type: `boolean`  
Default: `false`

Lorem ipsum.


## License

MIT © [Salikh Fakhrutdinov](http://123)
