'use strict'

import gulp from 'gulp'
import del from 'del'
import runSequence from 'run-sequence'
import gulpLoadPlugins from 'gulp-load-plugins'
import { spawn } from 'child_process'
import tildeImporter from 'node-sass-tilde-importer'

const $ = gulpLoadPlugins()
const browserSync = require('browser-sync').create()
const isProduction = process.env.NODE_ENV === 'production'

const onError = (err) => {
  console.log(err)
}

// --

gulp.task('server', ['build'], () => {
  browserSync.init({
    server: {
      baseDir: 'public'
    },
    open: false
  })
  $.watch('src/sass/**/*.scss', () => gulp.start('sass'))
  $.watch('src/js/**/*.js', () => gulp.start('js-watch'))
  $.watch('src/images/**/*', () => gulp.start('images'))
  $.watch(['archetypes/**/*', 'data/**/*', 'content/**/*', 'layouts/**/*', 'static/**/*', 'config.toml'], () => gulp.start('hugo'))
})

gulp.task('build', () => {
  runSequence(['sass', 'js', 'fonts', 'images'], 'hugo', 'html')
})

gulp.task('build-preview', () => {
  runSequence(['sass', 'js', 'fonts', 'images'], 'hugo-preview')
})

gulp.task('hugo', (cb) => {
  return spawn('hugo', { stdio: 'inherit' }).on('close', (code) => {
    browserSync.reload()
    cb()
  })
})

gulp.task('hugo-preview', (cb) => {
  return spawn('hugo', ['--buildDrafts', '--buildFuture'], { stdio: 'inherit' }).on('close', (code) => {
    browserSync.reload()
    cb()
  })
})

gulp.task('sasslint', () => {
  return gulp.src([
    'src/sass/**/*.scss'
  ])
    .pipe($.plumber({ errorHandler: onError }))
    .pipe($.print())
    .pipe($.sassLint())
    .pipe($.sassLint.format())
})

gulp.task('sass', () => {
  return gulp.src([
    'src/sass/**/*.scss'
  ])
    .pipe($.plumber({ errorHandler: onError }))
    .pipe($.print())
    .pipe($.sassLint())
    .pipe($.sassLint.format())
    .pipe($.sass({ includePaths: require('node-normalize-scss').includePaths, precision: 5, importer: tildeImporter }))
    .pipe($.autoprefixer(['ie >= 10', 'last 2 versions']))
    .pipe($.if(isProduction, $.cssnano({ discardUnused: false, minifyFontValues: false })))
    .pipe($.size({ gzip: true, showFiles: true }))
    .pipe(gulp.dest('static/assets/css'))
    .pipe(browserSync.stream())
})

gulp.task('js-watch', ['js'], (cb) => {
  browserSync.reload()
  cb()
})

gulp.task('js', () => {
  return gulp.src([
    'src/js/jquery.min.js',
    'src/js/jquery.dropotron.min.js',
    'src/js/jquery.scrolly.min.js',
    'src/js/jquery.scrollgress.min.js',
    'src/js/skel.min.js',
    'src/js/util.js',
    'src/js/main.js'
  ])

    .pipe($.plumber({ errorHandler: onError }))
    .pipe($.print())
    .pipe($.if(['!.min.*'], $.babel()))
    .pipe($.if(['!.min.*'], $.if(isProduction, $.uglify())))
    .pipe($.concat('app.min.js'))
    .pipe($.size({ gzip: true, showFiles: true }))
    .pipe(gulp.dest('static/assets/js'))
})

gulp.task('iejs', () => {
  return gulp.src('src/js/ie/*')
    .pipe(gulp.dest('static/assets/js/ie/'))
})

gulp.task('fonts', () => {
  return gulp.src('src/fonts/**/*.{woff,woff2,eot,svg,ttf,otf}')
    .pipe(gulp.dest('static/assets/fonts'))
})

gulp.task('images', () => {
  return gulp.src('src/images/**/*.{png,jpg,jpeg,gif,svg,webp}')
    .pipe($.newer('static/images'))
    .pipe($.print())
    .pipe($.imagemin())
    .pipe(gulp.dest('static/images'))
})

gulp.task('html', () => {
  return gulp.src('public/**/*.html')
    .pipe($.htmlmin({collapseWhitespace: true, preserveLineBreaks: true}))
    .pipe(gulp.dest('public'))
})

gulp.task('cms-delete', () => {
  return del(['static/admin'], { dot: true })
})
