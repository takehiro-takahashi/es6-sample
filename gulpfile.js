//---------------------------------------------------------------------------------------------
// 厳格構文チェック
//---------------------------------------------------------------------------------------------
'use strict';

//---------------------------------------------------------------------------------------------
//
// 必要パッケージを変数に代入
//
//---------------------------------------------------------------------------------------------
const gulp            = require('gulp');
const del             = require('del');
const plumber         = require('gulp-plumber');
const runSequence     = require('run-sequence');
const browserSync     = require('browser-sync');
const uglify          = require('gulp-uglify'); // jsファイル圧縮
const util            = require('gulp-util');
const babel           = require('gulp-babel');
const pug             = require('gulp-pug');
// const concat          = require('gulp-concat'); // cssファイルを一つにまとめる
const cleanCss        = require('gulp-clean-css'); // css圧縮
const sass            = require('gulp-sass');
const autoprefixer    = require('gulp-autoprefixer');
const imagemin        = require('gulp-imagemin');
const removeComments  = require('gulp-remove-html-comments'); // htmlコメント削除
const htmlMinify      = require('gulp-minify-html'); // html圧縮
const notify          = require('gulp-notify');

//---------------------------------------------------------------------------------------------
//
// 開発ディレクトリの指定
//
//---------------------------------------------------------------------------------------------
const src = {
    'html'  : ['src/**/*.pug', '!' + 'src/template-parts/**/*.pug']
    ,'css'  : ['src/**/*.scss', '!' + 'src/assets/css/**/_*.scss']
    ,'js'   : ['src/assets/js/**/*.js', '!' + 'src/assets/js/**/_*.js']
    ,'image': 'src/assets/images/**/*.{png,jpeg,jpg,gif,svg}'
    ,'font' : 'src/assets/fonts/*'
};

//---------------------------------------------------------------------------------------------
//
// 出力ディレクトリの指定
//
//---------------------------------------------------------------------------------------------
const dist = {
    'root'  : 'dist/'
    ,'html' : 'dist/'
    ,'css'  : 'dist/assets/css/'
    ,'js'   : 'dist/assets/js/'
    ,'image': 'dist/assets/images/'
    ,'font' : 'dist/assets/fonts/'
};

//---------------------------------------------------------------------------------------------
//
// 監視ファイルの指定
//
//---------------------------------------------------------------------------------------------
const watch = {
    'html'  : 'src/**/*.pug'
    ,'css'  : 'src/assets/css/**/*.scss'
    ,'js'   : 'src/assets/js/**/*.js'
    ,'image': 'src/assets/images/*.{png,jpeg,jpg,gif,svg}'
    ,'font' : 'src/assets/fonts/*'
};

//---------------------------------------------------------------------------------------------
//
// Browser Sync
//
//---------------------------------------------------------------------------------------------
const PORT = 3004;
const PROXY_URL = 'http://localhost:8004';

gulp.task('default', ['html', 'css', 'js', 'image', 'fonts', 'browser-sync', 'watch'], function () {
    // default task
});

gulp.task('html', function () {
    gulp.src(src.html)
        .pipe(plumber({errorHandler: notify.onError("Error: <% error.message %>")}))
        .pipe(pug({
            // pugファイルのルートディレクトリを指定する
            basedir: 'src'
            // pugファイルの整形
            ,pretty: true
        }))
        .pipe(gulp.dest(dist.html))
});

gulp.task('css', function () {
    gulp.src(src.css)
        .pipe(plumber())
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(gulp.dest(dist.css))
});

gulp.task('js', function () {
    gulp.src(src.js)
        .pipe(plumber())
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest(dist.js));
});

//---------------------------------------------------------------------------------------------
//
// image
//
//---------------------------------------------------------------------------------------------
gulp.task('image', function () {
    gulp.src(src.image)
        .pipe(imagemin())
        .pipe(gulp.dest(dist.image))
});

//---------------------------------------------------------------------------------------------
//
// fonts
//
//---------------------------------------------------------------------------------------------
gulp.task('fonts', function () {
    gulp.src(src.font)
        .pipe(gulp.dest(dist.font))
});

//---------------------------------------------------------------------------------------------
//
// watch
//
//---------------------------------------------------------------------------------------------
gulp.task('watch', function () {
    gulp.watch(watch.css,   ['css', 'bs-reload']);
    gulp.watch(watch.js,    ['js', 'bs-reload']);
    gulp.watch(watch.image, ['image', 'bs-reload']);
    gulp.watch(watch.html,  ['html', 'bs-reload']);
});

//---------------------------------------------------------------------------------------------
//
// browserSync
//
//---------------------------------------------------------------------------------------------
gulp.task('browser-sync', function () {
    browserSync.init({
        proxy: PROXY_URL
        , port: PORT
    });
    browserSync({
        server: {
            baseDir: dist.root
            , index: 'index.html'
        }
    });
});
gulp.task('bs-reload', function () {
    browserSync.reload();
});



//---------------------------------------------------------------------------------------------
//
// release
//
//---------------------------------------------------------------------------------------------
gulp.task('release', function (cb) {
    return runSequence(
        'clean',
        ['html:release', 'css:release', 'js:release', 'image', 'fonts'],
        'browser-sync',
        'watch:release',
        cb
    );
});

//---------------------------------------------------------------------------------------------
//
// assetsディレクトリ内を削除
//
//---------------------------------------------------------------------------------------------
gulp.task('clean', function (cb) {
    return del([
        dist.root
    ],cb)
});

//---------------------------------------------------------------------------------------------
//
// html:release
//
//---------------------------------------------------------------------------------------------
gulp.task('html:release', function () {
    return gulp.src(src.html)
        .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
        .pipe(pug({
            // Pugファイルのルートディレクトリを指定する。
            basedir: 'src'
            // Pugファイルの整形
            ,pretty: true
        }))
        .pipe(removeComments())
        .pipe(htmlMinify())
        .pipe(gulp.dest(dist.html))
});

//---------------------------------------------------------------------------------------------
//
// css:release
//
//---------------------------------------------------------------------------------------------
gulp.task('css:release', function () {
    gulp.src(src.css)
        .pipe(plumber())
        .pipe(sass())
        .pipe(autoprefixer())
        .pipe(cleanCss())
        .pipe(gulp.dest(dist.root))
});

//---------------------------------------------------------------------------------------------
//
// js:release
//
//---------------------------------------------------------------------------------------------
gulp.task('js:release', function () {
    gulp.src(src.js)
        .pipe(plumber())
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(uglify())
        .pipe(gulp.dest(dist.js))
});

//---------------------------------------------------------------------------------------------
//
// watch:release
//
//---------------------------------------------------------------------------------------------
gulp.task('watch:release', function () {
    gulp.watch(watch.css,   ['css:release', 'bs-reload']);
    gulp.watch(watch.js,    ['js:release', 'bs-reload']);
    gulp.watch(watch.image, ['image', 'bs-reload']);
    gulp.watch(watch.html,  ['html:release', 'bs-reload']);
});