const COMMON_CONFIG = require('./webpack.common')
const path = require('path')

const templateSrc = process.env.SITE === 'dev' ?
  './dev/debug.html' :
  './dev/index.html'
const ruleOption = [{
  test: /\.css$/,
  use: [
    'style-loader',
    'css-loader',
    'postcss-loader',
  ],
}]
module.exports = {
  ...COMMON_CONFIG({ ruleOption, templateSrc }),
  mode: 'development',
  output: {
    pathinfo: false,
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    hot: true,
  },
  devtool: 'cheap-module-eval-source-map',
  entry: {
    index: process.env.SITE === 'dev' ? './dev/debug.js' : './dev/index.js',
  },
}
