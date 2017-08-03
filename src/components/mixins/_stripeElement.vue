<script>
export default {
  props: ['options'],

  data () {
    return {

    }
  },

  methods: {
    blur () {
      this._element.blur()
    },
    focus () {
      this._element.focus()
    },
    update () {
      this._element.update()
    },
    mountElement () {
      this._element.mount(this.$el)
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
    this.mountElement()
  },

  beforeDestroy () {
    this._element.unmount()
  }
}
</script>