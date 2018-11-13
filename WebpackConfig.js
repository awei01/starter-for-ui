
module.exports = function (paths) {
  return {
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
}
