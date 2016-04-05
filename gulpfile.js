var gulp = require('gulp'),
  eslint = require('gulp-eslint'),
  mocha = require('gulp-mocha'),
  istanbul = require('gulp-istanbul'),
  webserver = require('gulp-webserver'),
  webpack = require('webpack-stream'),
  webpackConfig = require('./webpack.config.js');

gulp.task('run', function () {
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
