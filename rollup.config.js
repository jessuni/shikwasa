import postcss from 'rollup-plugin-postcss'
import autoprefixer from 'autoprefixer'
import replace from '@rollup/plugin-replace'
import babel from '@rollup/plugin-babel'
import cleanup from 'rollup-plugin-cleanup'
import babelMinify from 'rollup-plugin-babel-minify'
import { minify } from 'html-minifier'
import fs from 'fs'
import pkg from './package.json'

const CONSOLE_CODE = `console.log(\`%c🍊%c Shikwasa Podcast Player v${pkg.version} %c https://shikwasa.js.org\`,'background-color:#00869B40;padding:4px;','background:#00869B80;color:#fff;padding:4px 0','padding: 2px 0;')`

const sharedPlugins = [
  postcss({
    extract: true,
    plugins: [autoprefixer()],
  }),
  replace({
    include: './src/main.js',
    delimiters: ['/** ', ' */'],
    'CONSOLE_MSG': CONSOLE_CODE,
    preventAssignment: true,
  }),
  babel(),
  cleanup({
    comments: 'none',
  }),
]

function bundle(target, format) {
  let text = format
  const plugins = [...sharedPlugins]
  if (format === 'umd') {
    text = 'min'
    plugins.push(babelMinify({
      comments: false,
      banner: false,
      sourceMap: false,
    }))
  }
  return {
    input: `src/${target}.js`,
    output: {
      name: target === 'main' ? 'Shikwasa' : target[0].toUpperCase() + target.slice(1),
      file: `dist/shikwasa.${target === 'main' ? '' : target + '.' }${text}.js`,
      format,
      compact: true,
      sourcemap: false,
      exports: 'default',
    },
    plugins,
    treeshake: {
      moduleSideEffects: false,
    },
  }
}

function bundleDemo() {
  const html = fs.readFileSync('./pages/public/index.html').toString()
  const htmlMinified = minify(html, {
    collapseWhitespace: true,
    // collapseInlineTagWhitespace: true,
    removeComments: true,
  })
  if (!fs.existsSync('./public')) {
    fs.mkdirSync('./public')
  }
  var stream = fs.createWriteStream('./public/index.html')
  stream.write(htmlMinified)
  stream.end()
  return {
    input: 'pages/public/index.js',
    output: {
      dir: 'public',
      compact: true,
      sourcemap: false,
      format: 'iife',
    },
    plugins: [
      ...sharedPlugins,
      babelMinify({
        comments: false,
        banner: false,
        sourceMap: false,
      }),
    ],
  }
}

export default () => {
  if (process.env.TARGET) {
    return [
      bundle(process.env.TARGET, 'cjs'),
      bundle(process.env.TARGET, 'umd'),
    ]
  } else {
    return bundleDemo()
  }
}

