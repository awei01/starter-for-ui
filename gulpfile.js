const gulp = require('gulp')
const browserSync = require('browser-sync')
const path = require('path')
const del = require('del')
const sass = require('gulp-sass')

const _paths = {
  dest: path.resolve(__dirname, 'dest'),
  src: {
    html: path.resolve(__dirname, 'html'),
    css: path.resolve(__dirname, 'styles')
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
  console.log('Sending refresh to browser')
  server && server.reload()
  done()
}
function watchServer () {
  gulp.watch(`${_paths.dest}/**`, reloadServer)
}

/**
 * build html
 */
function buildHtml () {
  return gulp.src(`${_paths.src.html}/**`)
    .pipe(gulp.dest(_paths.dest))
}
function watchHtml () {
  gulp.watch(`${_paths.src.html}/**`, buildHtml)
}

/**
 * css
 */
function buildCss () {
  return gulp.src(`${_paths.src.css}/main.scss`)
    .pipe(sass({}))
    .pipe(gulp.dest(`${_paths.dest}/css`))
}
function watchCss () {
  gulp.watch(_paths.src.css, buildCss)
}

gulp.task('build', gulp.series(cleanDest, buildHtml, buildCss))
gulp.task('watch', gulp.parallel(watchHtml, watchCss))
gulp.task('develop', gulp.series(
  'build',
  startServer,
  gulp.parallel(watchServer, 'watch')
))
