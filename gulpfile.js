'use strict';

var gulp = require('gulp'),
    gutil = require('gulp-util'),
    sass = require('gulp-sass'),
    connect = require('gulp-connect'),
    plumber = require('gulp-plumber'),
    jade = require('gulp-jade'),
    sourcemaps = require('gulp-sourcemaps'),
    browserify = require('gulp-browserify'),

    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),

    concat = require('gulp-concat'),
    nodemon = require('gulp-nodemon'),
    watchify = require('watchify');

var jsFilePath = function(file) {
    return './app/scripts/' + file + '.js';
}

gulp.task('javascript', () => {
    return gulp.src([
            jsFilePath('app'),
            jsFilePath('run'),
            jsFilePath('routes'),
            jsFilePath('**/*')
        ])
        .pipe(sourcemaps.init())
        .pipe(concat('all.js'))
        .pipe(sourcemaps.write('../maps'))
        .pipe(connect.reload())
        .pipe(gulp.dest('./app/public/scripts'));
});

var libs = [
    './app/dependencies/jquery/dist/jquery.js',
    './app/dependencies/d3/d3.js',
    './app/dependencies/angular/angular.js',
    './app/dependencies/angular-ui-router/release/angular-ui-router.js',
    './app/dependencies/angular-messages/angular-messages.js',
    './app/dependencies/sweetalert/dist/sweetalert-dev.js',
    './app/dependencies/angular-md5/angular-md5.js'
];


gulp.task('libs', () => {
    return gulp.src(libs)
        .pipe(sourcemaps.init())
        .pipe(concat('libs.js'))
        .pipe(sourcemaps.write('../maps'))
        .pipe(gulp.dest('./app/public/scripts'));
});


gulp.task('browserify', ['precompile:js'], () => {

    var b = watchify(browserify({
        entries: './app/public/scripts/all.js',
        debug: true
    }));

    b.bundle()
        .pipe(source('main.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({
            loadMaps: true
        }))
        // Add transformation tasks to the pipeline here.
        .on('error', gutil.log)
        .pipe(sourcemaps.write('../maps'))
        .pipe(gulp.dest('./app/public/scripts/'));


});

gulp.task('sass', () => {
    return gulp.src('./app/sass/main.sass')
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle: 'compressed'
        }).on('error', sass.logError))
        .pipe(gulp.dest('./app/public/css/'))
        .pipe(connect.reload());

});

gulp.task('connect', () => {
    connect.server({
        root: 'app',
        livereload: true
    });
});

gulp.task('html', () => {
    gulp.src('./app/index.html')
        .pipe(connect.reload());
});

gulp.task('css', () => {
    gulp.src('./app/public/css/main.css')
        .pipe(connect.reload());
});

gulp.task('jade', () => {
    return gulp.src('./app/templates/jade/**/*.jade')
        .pipe(jade())
        .pipe(gulp.dest('./app/templates/html/'))
        .pipe(connect.reload());
});

gulp.task('watch', () => {
    gulp.watch('./app/sass/*.sass', ['sass']);
    gulp.watch('./app/index.html', ['html']);
    gulp.watch('./app/css/main.css', ['css']);
    gulp.watch('./app/templates/jade/**/*.jade', ['jade']);
    gulp.watch('./app/scripts/**/*.js', ['javascript']);
});

gulp.task('tasks', ['connect', 'watch', 'jade', 'css', 'html', 'sass', 'javascript', 'libs']);



gulp.task('default', ['tasks'], () => {
    var stream = nodemon({
        script: 'backend/server.js',
        stdout: true, // important: this tells nodemon not to output to console
        ext: 'js', // extensions plikow na ktorych ma robic restart jesli sie zmienia
        ignore: ["/node_modules/*", "./app/public/*"],
        watch:    ['/backend/'],
        env: {
            'NODE_ENV': 'development'
        }
    });
    stream
        .on('restart', () => {
            gutil.log("Server has been restarted!");
        })
        .on('crash', () => {
            console.error('Application has crashed!\n')
            stream.emit('restart', 3) // restart the server in 3 seconds
        })
});