var gulp = require('gulp');
var ts = require('gulp-typescript');
var browserify = require('browserify');
var fs = require('fs');
var source = require('vinyl-source-stream');
var parcelify = require('parcelify');

var webpack = require('gulp-webpack');
var webpackConfig = require('./webpack.config.js');


gulp.task('default', function () {
    return gulp.src('src/**/*.ts')
        .pipe(ts({   
            module: 'amd',
            outFile: 'index.js'
        }))
        .pipe(gulp.dest('src/js'));
});


gulp.task('build-css', function () {
    var b = browserify({
        entries: './src/ts/*.ts'
    })
    parcelify(b, {
        bundles: {
            style: "./www/css/app.css"
        }
    });
});


gulp.task('build-ts', function () {
    var b = browserify({
        entries: './src/ts/index.ts'
    })

    parcelify(b, {
        bundles: {
            style: "./www/css/app.css"
        }
    });


    b.plugin('tsify')
        .bundle()
        .pipe(source('index.js'))
        .pipe(gulp.dest('./www/js'));  
});


gulp.task('webpack', function () {
    return gulp.src(['./src/ts/*.ts'])
        .pipe(webpack(webpackConfig))
        .pipe(gulp.dest('./www/js'));
});