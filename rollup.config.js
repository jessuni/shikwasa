import postcss from 'rollup-plugin-postcss'
import autoprefixer from 'autoprefixer'
import html from 'rollup-plugin-html'
import babel from 'rollup-plugin-babel'
import minify from 'rollup-plugin-babel-minify'
import transformParameters from '@babel/plugin-transform-parameters'
import replace from 'rollup-plugin-replace'
import cleanup from 'rollup-plugin-cleanup'
import pkg from './package.json'

const CONSOLE_CODE = `console.log(\`%c🍊%c Shikwasa Podcast Player v${pkg.version} %c https://jessuni.github.io/shikwasa/\`,'background-color:#00869B40;padding:4px;','background:#00869B80;color:#fff;padding:4px 0','padding: 2px 0;')`

const output = {
  file: 'dist/shikwasa.js',
  format: process.env.FORMAT,
  compact: true,
  externalLiveBindings: true,
}

const plugins = [
  replace({
    include: './src/main.js',
    delimiters: ['/** ', ' */'],
    'CONSOLE_MSG': CONSOLE_CODE,
  }),
  postcss({
    extract: true,
    minimize: true,
    plugins: [
      autoprefixer(),
    ],
  }),
  html({
    include: 'src/template/*.html',
    htmlMinifierOptions: {
      collapseBooleanAttributes: true,
      collapseWhitespace: true,
      conservativeCollapse: true,
    },
  }),
  cleanup({
    comments: 'none',
  }),
  babel(),
]

if (process.env.FORMAT === 'iife') {
  output.file = 'dist/shikwasa.min.js'
  output.name = 'Shikwasa'
  plugins.push(minify({
    comments: false,
    banner: false,
    sourceMap: false,
    plugins: [transformParameters],
  }))
} else if (process.env.FORMAT === 'cjs') {
  output.file = 'dist/shikwasa.cjs.js'
}

module.exports = {
  input: 'src/main.js',
  output,
  plugins,
}
