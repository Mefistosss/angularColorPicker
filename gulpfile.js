var gulp = require('gulp'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    notify = require('gulp-notify'),
    minifyCss = require('gulp-minify-css'),
    autoprefixer = require('gulp-autoprefixer'),
    uglifyJS = require('gulp-uglify');

gulp.task('angular', function() {
    gulp.src(['node_modules/angular/angular.min.js'])
        .pipe(gulp.dest('build/'));
});

gulp.task('js', function() {
    gulp.src([
        'js/0.entry.js',
        'js/1.module.js',
        'js/2.service.js',
        'js/3.color_picker.js',
        'js/4.0.acp_window.js',
        'js/4.1.acp_control_panel.js',
        'js/4.2.acp_main_panel.js',
        'js/4.3.acp_line.js',
        'js/4.4.acp_block.js',
        'js/4.5.acp_out.js',
        'js/9.exit.js'
    ])
        .pipe(concat('angularColorPicker.js'))
        .pipe(gulp.dest('build/'))
        .pipe(notify('build js done!'));
});

gulp.task('minifyJs', function() {
    gulp.src(['build/angularColorPicker.js'])
        .pipe(uglifyJS())
        .pipe(rename('angularColorPicker.min.js'))
        .pipe(gulp.dest('build/'))
        .pipe(notify('minify js done!'));
});

gulp.task('css', function() {
    gulp.src(['css/angularColorPicker.css'])
        .pipe(concat('angularColorPicker.css'))
        .pipe(autoprefixer('last 2 versions', '> 1%', 'ie 9'))
        .pipe(gulp.dest('build/'))
        .pipe(notify('build css done!'));
});

gulp.task('minifyCss', function() {
    gulp.src(['build/angularColorPicker.css'])
        .pipe(minifyCss(''))
        .pipe(rename('angularColorPicker.min.css'))
        .pipe(gulp.dest('build/'))
        .pipe(notify('minify css done!'));
});

gulp.task('minify', ['minifyJs', 'minifyCss', 'angular']);

gulp.task('default', ['js', 'css']);