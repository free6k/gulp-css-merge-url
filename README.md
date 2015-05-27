# gulp-css-merge-url [BETA]

> Plugin for merge all css selectors witch elements contains similar url


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
