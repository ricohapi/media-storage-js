const gulp = require('gulp');
const eslint = require('gulp-eslint');
const mocha = require('gulp-mocha');
const istanbul = require('gulp-istanbul');
const webserver = require('gulp-webserver');
const webpack = require('webpack-stream');
const webpackConfig = require('./webpack.config.js');

gulp.task('server', function () {
    gulp.src('')
        .pipe(webserver({
            host: 'localhost',
            port: 8034,
            open: true,
            fallback: 'samples/index.html'
        }));
});

gulp.task('build', function() {
  return gulp.src('')
    .pipe(webpack(webpackConfig))
    .pipe(gulp.dest(''));
});

gulp.task('lint', function() {
  return gulp.src(['src/**/*.js'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failOnError());
});

gulp.task('test', function(cb) {
  gulp.src(['./src/*.js'])
    .pipe(istanbul())
    .pipe(istanbul.hookRequire())
    .on('finish', function() {
      gulp.src(['./test/*.js'])
        .pipe(mocha())
        .pipe(istanbul.writeReports())
        .pipe(istanbul.enforceThresholds({ thresholds: { global: 80 } }))
        .on('end', cb);
    });
});
