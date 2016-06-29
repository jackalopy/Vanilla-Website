/*!
 * gulp
 * $ npm install gulp-ruby-sass gulp-autoprefixer gulp-minify-css gulp-jshint gulp-concat gulp-uglify gulp-imagemin gulp-notify gulp-rename gulp-livereload gulp-cache del --save-dev
 * $ npm install -g gulp
 * $ sudo apt-get install libnotify-bin
 * $ sudo gem install sass
 */

// Load plugins
var gulp = require("gulp"),
    babel = require("gulp-babel"),
    sourcemaps = require("gulp-sourcemaps"),
    browserify = require("browserify"),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    cleancss = require('gulp-clean-css'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    browserify = require('browserify'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    del = require('del'),
    jade = require('gulp-jade'),
    DEBUG = true,
    PHP = false,
    WORDPRESS = false,
    JADE = true,
    DEST_FOLDER = '../wp-content/themes/new-theme/';

// Default task
gulp.task('default', ['clean'], function() {
    gulp.start('styles', 'fonts', 'scripts', 'images');
});

// Templates
if(JADE) gulp.task('templates', function() {
    gulp.src('src/**/*.jade')
    .pipe(jade({
      pretty: false

    }))
    .pipe(gulp.dest(DEST_FOLDER))
    .pipe(notify({ message: 'Template task complete' }));
});

// php version
if(PHP) gulp.task('templates', function() {
  gulp.src('src/**/*.php')
    .pipe(gulp.dest(DEST_FOLDER))
    .pipe(notify({ message: 'templates task complete' }));
});


// Scripts
gulp.task('scripts', function() {
  gulp.src(['src/scripts/**/*.js', '!src/scripts/libraries/**/*.js'])
    .pipe(babel())
    .pipe(gulp.dest(DEST_FOLDER + "assets/js"))
    .on('end', function() {
        gulp.src('src/scripts/libraries/**/*.js')
          .pipe(gulp.dest(DEST_FOLDER + 'assets/js/libraries'));

      if(DEBUG) {
        browserify(DEST_FOLDER + 'assets/js/app.js')
          .bundle()
          .pipe(source('bundle.min.js'))
          .pipe(gulp.dest(DEST_FOLDER + 'assets/js'))
          .pipe(notify({ message: 'Script task complete' }));
      } else {
        browserify(DEST_FOLDER + 'assets/js/app.js')
          .bundle()
          .pipe(source('bundle.min.js'))
          .pipe(buffer())
          .pipe(uglify())
          .pipe(gulp.dest(DEST_FOLDER + 'assets/js'))
          .pipe(notify({ message: 'Script task complete' }));
      }
  });
});

// Styles
gulp.task('styles', function() {
  if(WORDPRESS) {
    return sass('src/styles/main.scss', {style: 'expanded'})
      .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
      .pipe(rename('style.css'))
      .pipe(cleancss())
      .pipe(gulp.dest(DEST_FOLDER))
      .pipe(notify({ message: 'Styles task complete' }));
  } else {
    return sass('src/styles/main.scss', {style: 'expanded'})
      .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
      .pipe(gulp.dest(DEST_FOLDER + 'assets/css'))
      .pipe(rename({ suffix: '.min' }))
      .pipe(cleancss())
      .pipe(gulp.dest(DEST_FOLDER + 'assets/css'))
      .pipe(notify({ message: 'Styles task complete' }));
  }
});

// Fonts
gulp.task('fonts', function() {
  return gulp.src('src/styles/fonts/**/*')
    .pipe(gulp.dest(DEST_FOLDER + 'assets/css/fonts'));
});

// Images
gulp.task('images', function() {
  return gulp.src('src/images/**/*', { buffer: true } )
    .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(gulp.dest(DEST_FOLDER + 'assets/img'))
    .pipe(notify({ message: 'Images task complete' }));
});

// Videos
gulp.task('videos', function() {
  return gulp.src('src/videos/**/*')
  .pipe(gulp.dest(DEST_FOLDER + 'assets/videos'))
  .pipe(notify({ message: 'Videos task complete' }));
});

// Clean
gulp.task('clean', function(cb) {
    del([DEST_FOLDER + 'assets/css', DEST_FOLDER + 'assets/js', DEST_FOLDER + 'assets/images'], cb)
});

// Default task
gulp.task('default', ['clean'], function() {
    gulp.start('templates', 'styles', 'fonts', 'scripts', 'images');
});

// Watch
gulp.task('watch', function() {

  // Template .jade files
  if(JADE) gulp.watch('src/**/*.jade', ['templates']);

  // Template .php files
  if(PHP) gulp.watch('src/**/*.php', ['templates']);

  // Watch .scss files
  gulp.watch('src/styles/**/*.scss', ['styles']);

  // Watch .js files
  gulp.watch('src/scripts/**/*.js', ['scripts']);

  // Watch image files
  gulp.watch('src/images/**/*', ['images']);

  // Watch font files
  gulp.watch('src/styles/fonts/**/*', ['fonts']);

  // Watch video files
  gulp.watch('src/videos/**/*', ['videos']);
});
