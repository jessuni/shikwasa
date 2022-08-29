import path from 'path'
import pkg from './package.json'

import { defineConfig, loadEnv } from 'vite'
import legacy from '@vitejs/plugin-legacy'

const CONSOLE_CODE = `console.log(\`%c🍊%c Shikwasa Podcast Player v${pkg.version} %c https://shikwasa.js.org\`,'background-color:#00869B40;padding:4px;','background:#00869B80;color:#fff;padding:4px 0','padding: 2px 0;')`

function replaceHTMLPlugin(replaceStrings) {
  return {
    name: 'inject-html',
    transformIndexHtml: {
      enforce: 'pre',
      transform: (html) => {
        for(const [key, value] of Object.entries(replaceStrings)) {
          const regex = new RegExp(`<%- ${key} %>`, 'gm')
          html = html.replace(regex,value)
        }
        return html
      },
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'APP')
  let config = {
    define: {
      '__BASE_URL__': JSON.stringify(process.cwd()),
      'CONSOLE_MSG': CONSOLE_CODE,
    },
    plugins: [{
      ...legacy({ targets: ['>0.2%', 'not ie <= 8'] }),
      apply: 'build',
    }],
  }
  if (process.env.TARGET === 'lib') {
    config.build = {
      lib: {
        entry: path.resolve(__dirname, 'src/main.js'),
        name: 'Shikwasa',
        formats: ['es', 'cjs', 'umd', 'iife'],
        fileName: (format) => {
          const infix = format === 'umd' ? 'min' : format
          return `shikwasa.${infix}.js`
        },
      },
    }
  } else {
    config.build = { outDir: 'public' }
    const pageDir = 'pages/'
    if (process.env.TARGET === 'ci') {
      config.pages = {
        cypress: {
          fileName: pageDir + 'cypress.html',
          template: pageDir + 'cypress.html',
          chunks: 'cypress',
          entry: pageDir + 'cypress.js',
        }
      }
    }
    if (process.env.TARGET === 'demo') {
      const REPLACED_STRINGS = {
        APP_GA: env.APP_GA,
        prependScript: mode === 'production' ? env.APP_PROD_HEAD : env.APP_DEV_HEAD,
        appendScript: mode === 'production' ? env.APP_PROD_SCRIPT : env.APP_DEV_SCRIPT,
      }
      config.pages = {
        index: {
          fileName: pageDir + 'public/index.html',
          template: pageDir + 'public/index.html',
          chunks: 'index',
          entry: pageDir + 'public/index.js',
        },
      }
      config.plugins.push(replaceHTMLPlugin(REPLACED_STRINGS))
    }
  }
  return config
})
