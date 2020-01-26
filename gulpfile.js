'use strict'
var gulp = require('gulp'),
	concatCss = require('gulp-concat-css'),
	cleanCss = require('gulp-clean-css'),
	sass = require('gulp-sass'),
	concat = require('gulp-concat'),
	uglyfly = require('gulp-uglyfly'),
	imagemin = require('gulp-imagemin'),
	imageminJpegRecompress = require('imagemin-jpeg-recompress'),
	imageminSvgo = require('imagemin-svgo'),
	autoprefixer = require('gulp-autoprefixer'),
	del = require('del'),
	babel = require('gulp-babel'),
	plumber = require('gulp-plumber'),
	gcmq = require('gulp-group-css-media-queries'),
	browserSync = require('browser-sync'),
	reload = browserSync.reload;

gulp.task('clean', function (done) {
	done();
	return del.sync('build');
});
//CSS
gulp.task('buildSass', function () {
	return gulp.src('src/sass/*.scss')
	    .pipe(sass({errLogToConsole: true}))
	    .pipe(gcmq())
	    .pipe(plumber())	    
	    .pipe(concatCss('main.css'))
	    .pipe(gulp.dest('src/css'));
});
gulp.task('buildCss', gulp.series('buildSass', function () {
	return gulp.src('src/css/*.css')
	 	.pipe(autoprefixer())
    	.pipe(concatCss('css/main.css'))
    	.pipe(cleanCss({
    		compatibility: 'ie8',
    		level: 2
    	}))
    	.pipe(gulp.dest('build'))
    	.pipe(reload({stream: true}));
}));
gulp.task('sass:watch', function () {
  return gulp.watch('src/sass/*.scss', ['sass']);
});
//CSS
//JS
gulp.task('buildJs', function () {
	return gulp.src('src/js/*.js')
		.pipe(concat('js/scripts.js'))
		 .pipe(babel({
            presets: ['@babel/env']
        }))
		// .pipe(uglyfly())
		.pipe(gulp.dest('build'))
		.pipe(reload({stream: true}));
});
//JS
//vendors
gulp.task('vendors', function(){
	return gulp.src('src/vendors/**')
		.pipe(gulp.dest('build/vendors'))
		.pipe(reload({stream: true}));
});
//vendors
//HTML
gulp.task('buildHtml', function(){
	return gulp.src('src/*.html')
		.pipe(gulp.dest('build'))
		.pipe(reload({stream: true}));
});
//HTML
//img
gulp.task('img', function() {
  return gulp.src('src/img/**/*')
  .pipe(gulp.dest('build/img'))
  .pipe(reload({stream: true}));
});
//img
//images optimization
gulp.task('imgmin', function() {
  return gulp.src('src/img/**/*')
  .pipe(imagemin([
            imageminJpegRecompress({
            	method: 'smallfry',
                quality:'high'
              }),
            imagemin.optipng({optimizationLevel: 5}),
            imageminSvgo({
                plugins: [
                    {removeDimensions: true},
                    {removeAttrs: true},
                    {removeElementsByAttr: true},
                    {removeStyleElement: true},
                    {removeViewBox: false}
                ]
            })
        ]))
  .pipe(gulp.dest('build/img'))
  .pipe(reload({stream: true}));
});
//images optimization
//fonts
gulp.task('buildFonts', function(){
	return gulp.src('src/fonts/*')
		.pipe(gulp.dest('build/fonts'))
		.pipe(reload({stream: true}));
});
//fonts
//dev build
gulp.task('devbuild', gulp.series(
	'buildHtml',
	'buildCss',
	'buildJs',
	'img',
	'buildFonts',
	'vendors'
));
//dev build
//production build
gulp.task('build', gulp.series(
	'buildHtml',
	'buildCss',
	'buildJs',
	'buildFonts',
	'imgmin',
	'vendors'
));
//production build
//webserver
gulp.task('webserver', function () {
	browserSync.init({
       server: {
	      baseDir: "./build"
	   },
	   port: 8080,
	   open: true,
	   notify: false
    });
    gulp.watch('src/*.html', gulp.series('buildHtml'));
    gulp.watch('src/sass/*.scss', gulp.series('buildCss'));
    gulp.watch('src/js/*.js', gulp.series('buildJs'));
    gulp.watch('src/fonts/*', gulp.series('buildFonts'));
    gulp.watch('src/img/**/*', gulp.series('img'));
    gulp.watch('src/vendors/**', gulp.series('vendors'));
});

//dev compile
gulp.task('default', gulp.series(
	'devbuild',
	'webserver'
));
//prod compile
gulp.task('prod', gulp.series(
	'clean',
	'build'
));