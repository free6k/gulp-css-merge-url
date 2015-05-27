# gulp-css-merge-url

> Plugin for merge all css selectors with similar url


## Install

```
Not yet in NPM :(
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
