import Card from './components/Card/index.js'
import CardCvc from './components/CardCvc/index.js'
import CardExpiry from './components/CardExpiry/index.js'
import CardNumber from './components/CardNumber/index.js'
import PostalCode from './components/PostalCode/index.js'

const components = [
  Card,
  CardCvc,
  CardExpiry,
  CardNumber,
  PostalCode
]

const install = (Vue, options) => {
  let stripe
  try {
    stripe = Stripe(options.publishableKey);
    components.forEach(component => {
      Vue.component(component.name, component)
    })
    Vue.stripe = Vue.prototype.$stripe = stripe
  } catch (error) {
    console.log(error)
  }
}

export default {
  install
}
