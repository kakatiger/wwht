'use strict'
var gulp = require('gulp');
var less = require('gulp-less');
var path = require('path');
var concat = require('gulp-concat');
var livereload = require('gulp-livereload');
var notify = require('gulp-notify');
var plumber = require('gulp-plumber');
var connect = require('gulp-connect'); //启动一个服务器 
var open = require('gulp-open');
var autoprefixer = require('gulp-autoprefixer');

var libraryJs = [
  './libs/angularjs/angular.min.js',
  './libs/angularjs/angular-sanitize.min.js',
  './libs/angularjs/angular-resource.min.js',
  './libs/angularjs/angular-ui-router.min.js',
  './libs/angularjs/angular-spinner.min.js',
  './libs/ui-bootstrap-tpls-2.2.0.min.js',
  './libs/jquery-3.0.js',
  './libs/chosen.jquery.min.js',
  './libs/video/video.js',
  // './libs/echarts.common.min.js',
  './libs/echarts.min.js',
  './libs/toastr.js',
  './libs/webuploader.min.js',
  './libs/china.js'
  // './libs/qiniu/qiniu.min.js',
  // './libs/qiniu/plupload.full.min-2.1.1.js',
]
var appJs = [
  './mainApp.js',
  './frontend/service/**.js',
  './frontend/directive/**.js',
  './frontend/**/**/**/**.js'
]
var loginJs = [
  './login/**/*.js',
]

gulp.task('html', function() {
  livereload.listen();
  gulp.src('index.html')
    .pipe(connect.reload());
});
gulp.task('connect', function() {
  connect.server({
    root: __dirname,
    port: 9300,
    livereload: true
  });
});
gulp.task('open', function() {
  var options = {
    uri: 'http://localhost:9300/login/#!/',
  };
  gulp.src('index.html')
    .pipe(open(options));
});

gulp.task('less-main', function() {
  return gulp.src('./style/index.less')
    .pipe(plumber({
      errorHandler: notify.onError('Error: <%= error.message %>')
    }))
    .pipe(less({
      paths: [path.join(__dirname, 'less', 'includes')]
    }))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: true,
      remove: true
    }))
    .pipe(gulp.dest('./dist-src/css'));
});

gulp.task('less-login', function() {
  return gulp.src('./style/login/login.less')
    .pipe(plumber({
      errorHandler: notify.onError('Error: <%= error.message %>')
    }))
    .pipe(less({
      paths: [path.join(__dirname, 'less', 'includes')]
    }))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: true,
      remove: true
    }))
    .pipe(gulp.dest('./dist-src/css/login'));
});

gulp.task('watch', function() {
  livereload.listen();
  var watcherLess = gulp.watch('style/**/*.less', ['less-main', 'less-login']);
  watcherLess.on('change', function(event) {
    console.log('Less File ' + event.path + ' was ' + event.type + ', running tasks...');
    livereload.changed(event.path)
  });

  var watcherJs = gulp.watch([appJs, loginJs], ['concatAppjs', 'concatLoginjs']);
  watcherJs.on('change', function(event) {
    console.log('Js File ' + event.path + ' was ' + event.type + ', running tasks...');
    livereload.changed(event.path)
  });
});

gulp.task('concatLibarary', function() {
  return gulp.src(libraryJs)
    .pipe(concat('vendor.bundle.js'))
    .pipe(gulp.dest('./dist-src/'));
});

gulp.task('concatAppjs', function() {
  return gulp.src(appJs)
    .pipe(concat('app.bundle.js'))
    .pipe(gulp.dest('./dist-src/'));
});
gulp.task('concatLoginjs', function() {
  return gulp.src(loginJs)
    .pipe(concat('login.bundle.js'))
    .pipe(gulp.dest('./dist-src/'));
});

gulp.task('default', function() {
  gulp.start('less-main');
  gulp.run('concatLibarary', 'concatAppjs', 'concatLoginjs', 'less-main', 'less-login', 'watch', 'connect', 'html', 'open');
});