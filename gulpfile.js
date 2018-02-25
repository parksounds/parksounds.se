let gulp = require('gulp');
let shell = require('gulp-shell');
let browserSync = require('browser-sync').create();
let cleanCSS = require('gulp-clean-css');
let sourcemaps = require('gulp-sourcemaps');

gulp.task('build', shell.task(['bundle exec jekyll build']));

gulp.task('serve', shell.task(['bundle exec jekyll serve --incremental']));

//init browser-sync and watch main.css and *.html
gulp.task('browser-sync', function () {

    browserSync.init({
        server: {
                    baseDir: '_site/'
                }
    });

    //init html watcher
    gulp.watch('./_site/*.html', browserSync.reload());

    //init minify-css
    gulp.watch('./_css/main.css', ['minify-css-dev']);

});

//minify css, include source maps
//+ stream to browser sync 
gulp.task('minify-css-dev',() => {
  return gulp.src('./_css/main.css')
    .pipe(sourcemaps.init())
    .pipe(cleanCSS())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./'))
    .pipe(browserSync.stream());
});

//minify for production - no source map or browser sync
gulp.task('minify-css',() => {
  return gulp.src('./_css/main.css')
    .pipe(cleanCSS())
    .pipe(gulp.dest('./'));
});

//development: gulp
gulp.task('default', ['serve', 'browser-sync']);

//production: gulp prod
gulp.task('prod', ['build', 'minify-css']);

