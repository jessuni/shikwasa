import postcss from 'rollup-plugin-postcss'
import html from 'rollup-plugin-html'
import minify from 'rollup-plugin-babel-minify'

const output = {
  file: 'dist/shikwasa.js',
  format: process.env.FORMAT,
}

const plugins = [
  postcss({
    extract: true,
    minimize: true,
  }),
  html({
    include: 'src/template/*.html',
    htmlMinifierOptions: {
      collapseBooleanAttributes: true,
      collapseWhitespace: true,
      conservativeCollapse: true,
    }
  }),
]

if (process.env.FORMAT === 'iife') {
  output.file = 'dist/shikwasa.min.js'
  output.name = 'shikwasa'
  plugins.push(minify({
    comments: false,
    banner: false,
    sourceMap: false,
  }))
} else if (process.env.FORMAT === 'cjs') {
  output.file = 'dist/shikwasa.cjs.js'
}

module.exports = {
  input: 'src/main.js',
  output,
  plugins,
}
