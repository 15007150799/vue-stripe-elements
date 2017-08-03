<template>
  <div>
    <div class="card-brand-element" ref="brand" v-show="options ? !options.hideIcon : true"><i class="pf" :class="brandIcon"></i></div>
    <div class="card-number-element" ref="number"></div>
  </div>
</template>

<script>
import _stripeElement from '../mixins/_stripeElement.vue'
export default {
  name: 'stripe-card-number',

  mixins: [_stripeElement],

  data () {
    return {
      type: 'cardNumber',
      brand: ''
    }
  },

  computed: {
    brandIcon () {
      if (!this.brand || this.brand === 'unknown') return 'pf-credit-card'
      if (this.brand === 'amex') return 'pf-american-express'
      return 'pf-' + this.brand
    }
  },

  methods: {
    mountElement () {
      this._element.mount(this.$el.querySelector('.card-number-element'))
    }
  },

  beforeMount () {
    this._element.on('change', event => {
      this.brand = event.brand
    })
  }
}
</script>