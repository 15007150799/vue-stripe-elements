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

const init = (publishableKey, stripeAccount) => {

  const _instance = Stripe(publishableKey, stripeAccount)

  // extend the stripe object instance with new properties and methods
  const _stripe = {
    ..._instance,
    init,
    createElements () {
      const _elements = this.elements()
      // extend stripe elements instance with new properties and methods
      const _context = {
        ..._elements,

        // collecting all elements created on the same instance of elements
        registeredElements: [],
        
        registerElement (target) {
          this.registeredElements.push(target)
        },
        
        unregisterElement (target) {
          this.registeredElements = this.registeredElements.filter(el => {
            return el !== target
          })
        },

        // tokenize data from elements registered on the context
        createToken (cardData = {}) {
          const _card = this.registeredElements.find(el => {
            return el._componentName === 'card' || 'cardNumber'
          })
          return _stripe.createToken(_card, cardData)
        }
      }

      return _context
    }
  }
  return _stripe
}

const install = (Vue, options = {}) => {
  if (!window.Stripe) {
    throw new Error(
      'Please load Stripe.js (https://js.stripe.com/v3/) on this page to use vue-stripe-elements.'
    );
  }
  
  const _stripe = init(options.publishableKey, options.stripeAccount)
  Vue.stripe = Vue.prototype.$stripe = _stripe

  // register components
  components.forEach(component => {
    Vue.component(component.name, component)
  })
}

export default install
