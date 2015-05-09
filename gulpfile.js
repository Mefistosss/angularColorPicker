var gulp = require('gulp'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    notify = require('gulp-notify');


gulp.task('js', function(){
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
        .pipe(notify('done js'));
});

gulp.task('default', ['js']);