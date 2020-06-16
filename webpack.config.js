const fs = require('fs')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

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
    chunks: jsfile ? [name] : undefined,
  })
})

module.exports = {
  entry,
  mode: 'development',
  output: {
    pathinfo: false,
  },
  devServer: {
    contentBase: path.join(__dirname, './pages/public'),
    hot: true,
    host: 'localhost',
    port: '8080',
    disableHostCheck: true,
  },
  devtool: 'cheap-module-eval-source-map',
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
        test: /(\.jsx|\.js)$/,
        loader: 'eslint-loader',
        exclude: /node_modules/,
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
