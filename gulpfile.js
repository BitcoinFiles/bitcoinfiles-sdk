var gulp = require("gulp");
var ts = require("gulp-typescript");
var browserify = require("browserify");
var source = require('vinyl-source-stream');
var tsify = require("tsify");
let uglify = require('gulp-uglify-es').default;
// var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var buffer = require('vinyl-buffer');
var paths = {
    pages: ['lib/examples/*.html']
};

gulp.task("copy-html", function () {
  return gulp.src(paths.pages)
      .pipe(gulp.dest("dist"));
});

gulp.task("build", ['copy-html'], function () {
  return browserify({
      basedir: '.',
      debug: true,
      entries: ['lib/index.ts'],
      cache: {},
      packageCache: {}
  })
  .plugin(tsify)
  .bundle()
  .pipe(source('bundle.min.js'))
  .pipe(buffer())
  .pipe(uglify())
  .pipe(gulp.dest("dist"));
});
