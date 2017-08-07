<script>
import _stripeElement from '../mixins/_stripeElement.js'
export default {
  name: 'stripe-card-number',

  mixins: [_stripeElement],

  data () {
    return {
      type: 'cardNumber'
    }
  }
}
</script>