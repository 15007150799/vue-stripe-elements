const fs = require('fs')
const zlib = require('zlib')
const rollup = require('rollup').rollup
const uglify = require('uglify-js')
const buble = require('rollup-plugin-buble')
const node = require('rollup-plugin-node-resolve')
const cjs = require('rollup-plugin-commonjs')
const vue = require('rollup-plugin-vue')
const replace = require('rollup-plugin-replace')
const eslint = require('rollup-plugin-eslint');

const {
  logError,
  write,
  banner,
  name,
  moduleName,
  version,
  processStyle
} = require('./utils')

function rollupBundle ({ env }) {
  return rollup({
    entry: 'src/main.js',
    plugins: [
      node({
        extensions: ['.js', '.vue']
      }),
      cjs(),
      vue({
        compileTemplate: true
      }),
      replace(Object.assign({
        __VERSION__: version
      }, env)),
      buble({
        objectAssign: 'Object.assign'
      }),
      eslint()
    ]
  })
}

const bundleOptions = {
  banner,
  exports: 'named',
  format: 'umd',
  moduleName
}

function createBundle ({ name, env, format }) {
  return rollupBundle({
    env
  }).then(function (bundle) {
    const options = Object.assign({}, bundleOptions)
    if (format) options.format = format

    return bundle.generate(options)
      .then(function (result) {
        if (/min$/.test(name)) {
          const minified = uglify.minify(result.code, {
            output: {
              preamble: banner,
              ascii_only: true // eslint-disable-line camelcase
            }
          }).code
          return write(`dist/${name}.js`, minified)
        } else {
          return write(`dist/${name}.js`, result.code)
        }
      })
  }).catch(logError)
}

// Browser bundle (can be used with script)
createBundle({
  name: `${name}`,
  env: {
    'process.env.NODE_ENV': '"development"'
  }
})

// Commonjs bundle (preserves process.env.NODE_ENV) so
// the user can replace it in dev and prod mode
createBundle({
  name: `${name}.common`,
  env: {},
  format: 'cjs'
})

// uses export and import syntax. Should be used with modern bundlers
// like rollup and webpack 2
createBundle({
  name: `${name}.esm`,
  env: {},
  format: 'es'
})

// Minified version for browser
createBundle({
  name: `${name}.min`,
  env: {
    'process.env.NODE_ENV': '"production"'
  }
}).then(zip)

function zip () {
  return new Promise(function (resolve, reject) {
    fs.readFile('dist/' + name + '.min.js', function (err, buf) {
      if (err) return reject(err)
      zlib.gzip(buf, function (err, buf) {
        if (err) return reject(err)
        write('dist/' + name + '.min.js.gz', buf).then(resolve)
      })
    })
  })
}
