export default {
  props: ['context', 'options'],

  render (h) {
    return h('div')
  },

  methods: {
    blur () {
      this._element.blur()
    },
    focus () {
      this._element.focus()
    },
    update (options) {
      this._element.update(options)
    },
    mount () {
      this._element.mount(this.$el)
    },
    unmount () {
      this._element.unmount()
    }
  },

  beforeMount () {
    this._element = this.context.create(this.type, this.options)

    this.context.registerElement(this._element)

    this._element.on('blur', event => {
      this.$emit('blur')
    })
    this._element.on('focus', event => {
      this.$emit('focus')
    })
    this._element.on('change', event => {
      this.$emit('change', event)
    })
    this._element.on('ready', event => {
      this.$emit('ready', event)
    })
  },

  mounted () {
    this.mount()
  },

  beforeDestroy () {
    this.unmount()
  }
}
