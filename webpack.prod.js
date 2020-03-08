const COMMON_CONFIG = require('./webpack.common')
const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const pkg = require('./package.json')

const CONSOLE_MSG = `console.log(\`%c🍊%c Shikwasa Podcast Player v${JSON.stringify(pkg.version)} %c https://jessuni.github.io/shikwasa/\`,'background-color:#00869B40;padding:4px;','background:#00869B80;color:#fff;padding:4px 0','padding: 2px 0;')`

const templateSrc = './dev/index.html'

const output = {
  path: path.resolve(__dirname, 'dist'),
  library: 'Shikwasa',
}

const pluginOption = [
  new MiniCssExtractPlugin({
    filename: 'shikwasa.[name].css',
  }),
]

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

module.exports = () => {
  return [{
    ...COMMON_CONFIG({ pluginOption, ruleOption }),
    mode: 'production',
    output: {
      ...output,
      libraryTarget: 'umd',
      filename: 'shikwasa.[name].cjs.js',
    },
  }, {
      ...COMMON_CONFIG({ pluginOption, ruleOption, templateSrc }),
    mode: 'production',
    output: {
      ...output,
      libraryTarget: 'var',
      filename: 'shikwasa.[name].min.js',
    },
  }]
}
