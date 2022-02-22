const fs = require('fs')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ESLintPlugin = require('eslint-webpack-plugin')

const allFiles = fs.readdirSync('pages')
const pages = allFiles.filter(name => {
  return /\.html$/.test(name)
})
const entry = { main: './src/main.js' }

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
plugins.push(new ESLintPlugin())

module.exports = {
  entry,
  mode: 'development',
  output: {
    pathinfo: false,
  },
  devServer: {
    static: [path.join(__dirname, 'pages')],
    host: 'localhost',
    port: '8080',
  },
  devtool: 'cheap-module-source-map',
  module: {
    rules: [
      {
        test: /\.html$/i,
        loader: 'html-loader',
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader',
        ],
      },
    ],
  },
  plugins,
}
