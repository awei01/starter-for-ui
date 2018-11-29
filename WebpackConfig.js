const merge = require('webpack-merge')

module.exports = function (paths, options) {
  const defaults = {
    context: paths.js.src,
    entry: {
      main: './main.js'
    },
    output: {
      filename: '[name].js'
    },
    resolve: {
      extensions: ['.js']
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          enforce: 'pre',
          loader: 'eslint-loader',
          options: { emitWarning: true },
          include: [paths.js.src]
        },
        {
          test: /\.(js)$/,
          exclude: /node_modules/,
          loader: 'babel-loader'
        },
      ]
    }
  }
  return merge(defaults, options || {})
}
