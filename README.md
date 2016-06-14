const gulp = require('gulp');
const gulpPngquant = require('gulp-pngquant');

gulp.task('compress', function() {
    gulp.src('./images/*.png')
        .pipe(gulpPngquant({
            quality: [65, 80]
        }))
        .pipe(gulp.dest('./compressed/'));
});

gulp.task('default', ['compress']);