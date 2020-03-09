const COMMON_CONFIG = require('./webpack.common')
const pkg = require('./package.json')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const CONSOLE_MSG = `console.log(\`%c🍊%c Shikwasa Podcast Player v${JSON.stringify(pkg.version)} %c https://jessuni.github.io/shikwasa/\`,'background-color:#00869B40;padding:4px;','background:#00869B80;color:#fff;padding:4px 0','padding: 2px 0;')`

const output = {
  path: path.resolve(__dirname, 'dist'),
  library: 'Shikwasa',
}

const ruleOption = [
  {
    test: /\.css$/,
    use: [
      MiniCssExtractPlugin.loader,
      'css-loader',
      'postcss-loader',
    ],
  },
  {
    test: /main\.js$/,
    loader: 'string-replace-loader',
    options: {
      search: '/** CONSOLE_MSG */',
      replace: CONSOLE_MSG,
    },
  },
]

const createConfig = (target, generateHTML = false) => {
  const plugins = []
  if (generateHTML) {
    plugins.push(
      new MiniCssExtractPlugin({
        filename: 'shikwasa.[name].css',
      }),
      new HtmlWebpackPlugin({
        template: './pages/index.html',
      })
    )
  }
  return {
    ...COMMON_CONFIG({ ruleOption }),
    mode: 'production',
    output: {
      ...output,
      libraryTarget: target,
      filename: 'shikwasa.[name].' + target + '.js',
    },
    plugins,
  }
}

module.exports = () => {
  return [
    createConfig('umd'),
    createConfig('var', true),
  ]
}
