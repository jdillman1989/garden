var gulp = require('gulp');
var concat = require('gulp-concat');
 
gulp.task('default', function() {
  return gulp.src('./app/**/*.js')
    .pipe(concat('client.js'))
    .pipe(gulp.dest('./assets/'));
});