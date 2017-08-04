<script>
import _stripeElement from '../mixins/_stripeElement.js'
export default {
  name: 'stripe-card',

  mixins: [_stripeElement],

  render (h) {
    return h('div')
  },

  data () {
    return {
      type: 'card'
    }
  }
}
</script>
