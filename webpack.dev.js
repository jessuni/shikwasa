const fs = require('fs')
const path = require('path')
const COMMON_CONFIG = require('./webpack.common')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const allFiles = fs.readdirSync('pages')
const pages = allFiles.filter(name => {
  return /\.html$/.test(name)
})
const entry = {}
const plugins = pages.map(filename => {
  const name = filename.replace(/\.html$/, '')
  const regex = new RegExp(name + '.js')
  const jsfile = allFiles.find(f => regex.test(f))
  if (jsfile) {
    entry[name] = './pages/' + name + '.js'
  }
  return new HtmlWebpackPlugin({
    filename: filename,
    template: 'pages/' + filename,
    chunks: jsfile ? [name] : [],
  })
})

const ruleOption = [{
  test: /\.css$/,
  use: [
    'style-loader',
    'css-loader',
    'postcss-loader',
  ],
}]
module.exports = {
  ...COMMON_CONFIG({ ruleOption }),
  mode: 'development',
  output: {
    pathinfo: false,
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    hot: true,
  },
  devtool: 'cheap-module-eval-source-map',
  plugins,
  entry,
}
