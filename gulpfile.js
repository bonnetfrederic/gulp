let gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
var cssnano = require('cssnano');
const imagemin = require('gulp-imagemin');
const browserSync = require('browser-sync').create();
const concat = require('gulp-concat');

gulp.task('sass', function () {
  return gulp.src('./src/assets/sass/**/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('./src/assets/css'));
})

gulp.task('sass:watch', function () {
  gulp.watch('./src/assets/sass/**/*.scss', gulp.series('sass'));
});

gulp.task('postcss', () => {
  return gulp.src('./src/assets/css/*.css')
    .pipe(postcss([autoprefixer(), cssnano]))
    .pipe(gulp.dest('./dist/assets/css'));
});

// gulp.task('postcss:min', function () {
//   return gulp.src('./src/assets/css/*.css')
//     .pipe(postcss([cssnano]))
//     .pipe(gulp.dest('./dist/assets/css'));
// });

// // on gère les tâches en série et non en parallèle, pour ne minifier qu'après avoir ajouté les préfixes
// gulp.task('postcss', gulp.series('postcss:prefix', 'postcss:min')); 

gulp.task('copyHtmlToDist', () => {
  return gulp.src('./src/**/*.html')
    .pipe(gulp.dest('./dist'));
});


// compresses all .jpg files
gulp.task('imagemin', () => {
  return gulp.src('./src/assets/img/*')
    .pipe(imagemin([imagemin.mozjpeg({quality: 20, progressive: true})]))
    .pipe(gulp.dest('./dist/assets/img'));
});

// gulp.task('build', gulp.series('postcss', 'copyHtmlToDist'));
gulp.task('build', gulp.parallel('imagemin', 'postcss', 'copyHtmlToDist'));

//// Browser-sync + Sass/CSS injecting
////
// Static Server + watching scss/html files
gulp.task('serve', function() {

  browserSync.init({
      server: "./src/"
  });

  gulp.watch("src/assets/sass/*.scss", gulp.series('sass')).on('change', browserSync.reload);
  gulp.watch("src/*.html").on('change', browserSync.reload);
});

gulp.task('concatJsFiles', () => {
  return gulp.src('./src/assets/js/**/*.js')
    .pipe(concat('all.js'))
    .pipe(gulp.dest('./dist/assets/js/'));
});
