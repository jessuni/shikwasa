const HtmlWebpackPlugin = require('html-webpack-plugin')

const COMMON_CONFIG = ({ pluginOption, ruleOption, templateSrc } = {}) => {
  const rules = [
    {
    test: /\.html$/i,
    loader: 'html-loader',
    },
    {
      test: /\.js$/,
      exclude: /(node_modules|bower_components)/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env'],
        },
      },
    },
    {
      test: /(\.jsx|\.js)$/,
      loader: 'eslint-loader',
      exclude: /node_modules/,
    },
  ]
  if (ruleOption) {
    rules.push(...ruleOption)
  }

  const plugins = templateSrc ?
    [new HtmlWebpackPlugin({ template: templateSrc })] :
    []

  if (pluginOption) {
    plugins.push(...pluginOption)
  }

  return {
    entry: {
      lib: './src/main.js',
    },
    plugins,
    module: { rules },
  }
}

module.exports = COMMON_CONFIG
