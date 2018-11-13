const gulp = require('gulp')
const browserSync = require('browser-sync')
const del = require('del')
const sass = require('gulp-sass')
const WebpackConfig = require('./WebpackConfig')
const webpack = require('webpack-stream')

/**
 * path resolution
 */
const path = require('path')
const _dest = path.resolve(__dirname, 'dist')
const _src = path.resolve(__dirname)

const _paths = {
  dest: _dest,
  html: {
    src: `${_src}/html`,
    dest: _dest
  },
  css: {
    src: `${_src}/css`,
    dest: `${_dest}/css`
  },
  js: {
    src: `${_src}/js`,
    dest: `${_dest}/js`
  }
}

/**
 * clean
 */
function cleanDest () {
  return del(_paths.dest)
}

/**
 * web server
 */
let server
function startServer (done) {
  server = browserSync.create()
  server.init({
    open: false,
    server: {
      baseDir: _paths.dest,
      serveStaticOptions: {
        extensions: ['html']
      }
    },
    ghostMode: false
  })
  done()
}
function reloadServer (done) {
  // console.log('Sending refresh to browser')
  server && server.reload()
  done()
}
function watchServer () {
  gulp.watch(_paths.dest, reloadServer)
}

/**
 * build html
 */
function buildHtml () {
  return gulp.src(`${_paths.html.src}/**`)
    .pipe(gulp.dest(_paths.html.dest))
}
function watchHtml () {
  gulp.watch(_paths.html.src, buildHtml)
}

/**
 * css
 */
function buildCss () {
  return gulp.src(`${_paths.css.src}/main.scss`)
    .pipe(sass({}))
    .pipe(gulp.dest(_paths.css.dest))
}
function watchCss () {
  gulp.watch(_paths.css.src, buildCss)
}

/**
 * css
 */
function buildJs () {
  const config = WebpackConfig(_paths)
  return gulp.src(_paths.js.src)
    .pipe(webpack(config))
    .pipe(gulp.dest(_paths.js.dest))
}
function watchJs () {
  gulp.watch(_paths.js.src, buildJs)
}

gulp.task('build', gulp.series(cleanDest, buildHtml, buildCss, buildJs))
gulp.task('watch', gulp.parallel(watchHtml, watchCss, watchJs))
gulp.task('develop', gulp.series(
  'build',
  startServer,
  gulp.parallel(watchServer, 'watch')
))
