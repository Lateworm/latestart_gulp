var gulp 				= require('gulp'),
		browserSync = require('browser-sync').create(), // https://browsersync.io/docs/gulp/

		uglify 			= require('gulp-uglify'), // minify JavaScript, remove whitespace
		rename 			= require('gulp-rename'), 
		eslint			= require('gulp-eslint'), // lint JavaScript

		sass				= require('gulp-sass'), // compile sass files (in SCSS syntax)
    autoprefixer = require('gulp-autoprefixer'), // add vendor prefixes
		cssnano 		= require('gulp-cssnano'), // minify
		prettyError = require('gulp-prettyerror'); 


gulp.task('watch', function() {					// watch for files that need to be built/compiled
	 gulp.watch('js/*.js', ['buildScripts']);
	 gulp.watch('scss/*.scss', ['buildScss']);
});		
	
gulp.task('lintScripts', function() {
	return gulp.src(['./js/*.js','!node_modules/**'])
		.pipe(eslint())
		.pipe(eslint.format())
		.pipe(eslint.failAfterError());
});

gulp.task('buildScripts', ['lintScripts'], function(){
	gulp.src('./js/*.js')
    .pipe(uglify())
    .pipe(rename({ extname: '.min.js' }))
		.pipe(gulp.dest('./build/js'))
});
	
gulp.task('buildScss', function() {
	gulp.src('./scss/style.scss')
		.pipe(prettyError()) // Sass error handler
		.pipe(sass()) // compile SCSS
		.pipe(autoprefixer({
				browsers: ['last 2 versions']
		}))
		.pipe(gulp.dest('./build/css')) // helpful so we can see the compiled code
		.pipe(cssnano())
		.pipe(rename('style.min.css'))
		.pipe(gulp.dest('./build/css')); // final production version
});
		
gulp.task('browser-sync', function() {
	browserSync.init({
		server: {
			baseDir: "./"
			}
		});
	gulp.watch(['index.html', 'build/css/*.css', 'js/*.js'])
	.on('change', browserSync.reload);
});
	
// Modify our default task method by passing an array of task names
gulp.task('default', ['watch', 'browser-sync']);

// Break out of continuing Gulp tasks: ^c