<script>
import _stripeElement from '../mixins/_stripeElement.js'
export default {
  name: 'stripe-postal-code',

  mixins: [_stripeElement],

  data () {
    return {
      type: 'postalCode'
    }
  }
}
</script>
