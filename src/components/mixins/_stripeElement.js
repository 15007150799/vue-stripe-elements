export default {
  props: ['options'],

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
    this._element = this.$stripe.elements().create(this.type, this.options)
    this._element.on('blur', event => {
      this.$emit('blur')
    })
    this._element.on('focus', event => {
      this.$emit('focus')
    })
    this._element.on('change', event => {
      this.$emit('change', event)
    })
  },

  mounted () {
    this.mount()
  },

  beforeDestroy () {
    this.unmount()
  }
}
