<template>
  <div></div>
</template>

<script>
import _stripeElement from '../mixins/_stripeElement.vue'
export default {
  name: 'stripe-card-expiry',

  mixins: [_stripeElement],

  data () {
    return {
      type: 'cardExpiry'
    }
  }
}
</script>

