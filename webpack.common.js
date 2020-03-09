const COMMON_CONFIG = ({ ruleOption } = {}) => {
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


  return {
    entry: {
      lib: './src/main.js',
    },
    module: { rules },
  }
}

module.exports = COMMON_CONFIG
