const path = require('path')
const webpack = require('webpack')

module.exports = {
  context: path.join(__dirname, './app'),
  entry: {
    js: './index.js',
    html: './index.html'
  },
  output: {
    path: path.join(__dirname, './build'),
    filename: 'bundle.js'
  },

  module: {
    loaders: [{
      test: /\.js$/,
      loaders: ['babel-loader'],
      exclude: /node_modules/
    }, {
      test: /\.html$/,
      loaders: ['file?name=[name].[ext]']
    }]
  }
}
