import babel from 'rollup-plugin-babel'
import vue from 'rollup-plugin-vue'

export default {
  entry: 'src/index.js',
  plugins: [ vue(), babel() ],
  dest: 'dist/vue-stripe-elements.js'
}