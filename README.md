# gulp-css-merge-url

> Plugin for merging css selectors that contain the same URL


## Install

```
$ npm install --save-dev gulp-css-merge-url
```


## Usage

```js
var gulp = require('gulp');
var cmu = require('gulp-css-merge-url');

gulp.task('cmu', function () {
	return gulp.src('src/file.css')
		.pipe(cmu())
		.pipe(gulp.dest('dist'));
});
```

## License

MIT © [free6k](https://github.com/free6k)
