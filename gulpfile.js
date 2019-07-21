var gulp = require('gulp');
var concat = require('gulp-concat');
 
gulp.task('default', function() {
  return gulp.src(['./app/sprites/*.js', './app/js/*.js'])
    .pipe(concat('client.js'))
    .pipe(gulp.dest('./assets/'));
});