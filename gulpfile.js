const gulp = require('gulp');
const shell = require('gulp-shell');
const browserSync = require('browser-sync').create();
const sourcemaps = require('gulp-sourcemaps');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const postCSSCustomProperties = require('postcss-custom-properties');

let postcss_plugins = [
    postCSSCustomProperties(),
    autoprefixer({browsers: ['last 1 version']}),
    cssnano(),
];


gulp.task('build', shell.task(['bundle exec jekyll build']));

gulp.task('serve', shell.task(['bundle exec jekyll serve']));

//init browser-sync and watch main.css and *.html
gulp.task('browser-sync', function () {

    browserSync.init({
        server: {
                    baseDir: '_site/'
                }
    });

    //init html watcher
    gulp.watch("./_site/*.html").on('change', browserSync.reload);

    //init minify-css
    gulp.watch('./_css/main.css', ['minify-css-dev']);

});

//minify css, include source maps
//+ stream to browser sync 
gulp.task('minify-css-dev',() => {

    return gulp.src('./_css/main.css')
        .pipe(sourcemaps.init())
        .pipe(postcss(postcss_plugins))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./'))
        .pipe(browserSync.stream());
});

//minify for production - no source map or browser sync
gulp.task('minify-css',() => {
  return gulp.src('./_css/main.css')
    .pipe(postcss(postcss_plugins))
    .pipe(gulp.dest('./'));
});

//development: gulp
gulp.task('default', ['serve', 'browser-sync']);

//production: gulp prod
gulp.task('prod', ['build', 'minify-css']);

