var gulp = require('gulp');
var $ = require('gulp-load-plugins')({ lazy: false });
var path = require('path');
var stylish = require('jshint-stylish');

var pkg = require('./package.json');

gulp.task('lint', function() {
  return gulp.src(['./lib/**/*.js', './bin/**/*.js', './*.js' ])
    .pipe($.jshint())
    .pipe($.jshint.reporter(stylish))
    .pipe($.jshint.reporter('fail'));
});

gulp.task('test', function() {
  return gulp.src('test/**/*.test.js', { read: false })
    .pipe($.mocha({
      reporter: 'mocha-better-spec-reporter'
    }));
});

gulp.task('default', ['lint', 'test']);

