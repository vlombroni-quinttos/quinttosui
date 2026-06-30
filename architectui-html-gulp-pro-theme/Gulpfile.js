const gulp = require('gulp');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const cleanCSS = require('gulp-clean-css');
const rename = require('gulp-rename');
const jshint = require('gulp-jshint');
const pump = require('pump');
const uglify = require('gulp-uglify');
const imagemin = require('gulp-imagemin');
const plumber = require('gulp-plumber');
const connect = require('gulp-connect');
const open = require('gulp-open');
const handlebars = require('gulp-compile-handlebars');
const gulpCopy = require('gulp-copy');

// Compile SCSS files and minify CSS files
gulp.task('sass', function () {
    return gulp.src('src/assets/base.scss')
    .pipe(sass({outputStyle: 'expanded'}))
    .pipe(gulp.dest('dist/assets/css'))
    .pipe(cleanCSS())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('dist/assets/css'))
});

// Compile handlebars templates to HTML
gulp.task('html', function () {
        var templateData = {
        },
        options = {
            batch: [
                './src/partials'
            ],
        }

    return gulp.src('src/DemoPages/**/*.hbs')
    .pipe(handlebars(templateData, options))
    .pipe(rename(function (path) {
        path.extname = ".html";
    }))
    .pipe(gulp.dest('dist/example-html-pages'));
});

// Concat and uglify JavaScript files
gulp.task('concat', function () {
    return gulp.src('src/js/**/*.js')
    .pipe(gulp.dest('dist/assets/js'));
});

// Optimize images
gulp.task('images', function() {
    return gulp.src('src/assets/images/**/*.*')
    .pipe(imagemin({optimizationLevel: 7, progressive: true}))
    .pipe(gulp.dest('dist/assets/images'));
});

// Copy Fonts
gulp.task('fonts', function() {
    return gulp.src('src/assets/fonts/**/*.*')
    .pipe(gulpCopy('dist/', {prefix: 1}))
});

gulp.task('compress', function () {
    gulp.src('dist/assets/js/**/*.js')
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('dist/assets/js'))
});

// Watch task
gulp.task('watch', function () {
    gulp.watch('src/scss/**/*.scss', ['sass']);
    gulp.watch('src/js/*.js', ['sass', 'concat', 'compress', 'images', 'html']);
    gulp.watch('src/**/*.hbs', ['html']);
});

// Default task
gulp.task('default', ['sass', 'concat', 'images', 'fonts', 'compress', 'html'], function () {

});
