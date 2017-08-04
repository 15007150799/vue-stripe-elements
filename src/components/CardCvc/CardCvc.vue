<template>
  <div/>
</template>

<script>
import _stripeElement from '../mixins/_stripeElement.js'
export default {
  name: 'stripe-card-cvc',

  mixins: [_stripeElement],

  data () {
    return {
      type: 'cardCvc'
    }
  }
}
</script>
