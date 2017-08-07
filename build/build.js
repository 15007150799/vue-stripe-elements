var fs = require('fs')
var zlib = require('zlib')
var rollup = require('rollup')
var uglify = require('uglify-js')
var babel = require('rollup-plugin-babel')
var vue = require('rollup-plugin-vue')
var replace = require('rollup-plugin-replace')
var eslint = require('rollup-plugin-eslint')
var pack = require('../package.json')
var version = process.env.VERSION || pack.version
var external = Object.keys(pack.dependencies || {})
var banner =
  '/*!\n' +
  ' * ' + pack.name + ' v' + version + '\n' +
  ' * (c) ' + new Date().getFullYear() + ' ' + pack.author.name + '\n' +
  ' * Released under the ' + pack.license + ' License.\n' +
  ' */'

// update main file
var main = fs
  .readFileSync('src/main.js', 'utf-8')
  .replace(/plugin\.version = '[\d\.]+'/, "plugin.version = '" + pack.version + "'")
fs.writeFileSync('src/main.js', main)

// CommonJS build.
// this is used as the "main" field in package.json
// and used by bundlers like Webpack and Browserify.
rollup.rollup({
  entry: 'src/main.js',
  plugins: [
    vue(),
    babel(),
    eslint()
  ]
})
.then(function (bundle) {
  return bundle.generate({
    format: 'cjs',
    banner: banner
  })
  .then(function (result) {
    return write('dist/' + pack.name + '.common.js', result.code)
  })
})
// Standalone Dev Build
.then(function () {
  return rollup.rollup({
    entry: 'src/main.js',
    plugins: [
      vue(),
      replace({
        'process.env.NODE_ENV': "'development'"
      }),
      babel(),
      eslint()
    ]
  })
  .then(function (bundle) {
    return bundle.generate({
      format: 'umd',
      banner: banner,
      moduleName: classify(pack.name)
    })
    .then(function (result) {
      return write('dist/' + pack.name + '.js', result.code)
    })
  })
})
// Standalone Production Build
.then(function () {
  return rollup.rollup({
    entry: 'src/main.js',
    plugins: [
      vue(),
      replace({
        'process.env.NODE_ENV': "'production'"
      }),
      babel(),
      eslint()
    ]
  })
  .then(function (bundle) {
    return bundle.generate({
      format: 'umd',
      moduleName: classify(pack.name)
    })
    .then(function (result) {
      var minified = banner + '\n' + uglify.minify(result.code).code
      return write('dist/' + pack.name + '.min.js', minified)
    })
  })
  .then(zip)
})
.catch(logError)

function toUpper (_, c) {
  return c ? c.toUpperCase() : ''
}

const classifyRE = /(?:^|[-_\/])(\w)/g
function classify (str) {
  return str.replace(classifyRE, toUpper)
}

function write (dest, code) {
  return new Promise(function (resolve, reject) {
    fs.writeFile(dest, code, function (err) {
      if (err) return reject(err)
      console.log(blue(dest) + ' ' + getSize(code))
      resolve()
    })
  })
}

function zip () {
  return new Promise(function (resolve, reject) {
    fs.readFile('dist/' + pack.name + '.min.js', function (err, buf) {
      if (err) return reject(err)
      zlib.gzip(buf, function (err, buf) {
        if (err) return reject(err)
        write('dist/' + pack.name + '.min.js.gz', buf).then(resolve)
      })
    })
  })
}

function getSize (code) {
  return (code.length / 1024).toFixed(2) + 'kb'
}

function logError (e) {
  console.log(e)
}

function blue (str) {
  return '\x1b[1m\x1b[34m' + str + '\x1b[39m\x1b[22m'
}