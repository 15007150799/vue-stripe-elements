import CardCvc from './components/CardCvc/index.js'
import CardExpiry from './components/CardExpiry/index.js'
import CardNumber from './components/CardNumber/index.js'

if (!Stripe) {
  // injects Stripe.js into the browser
  let StripeJS = document.createElement('script');
  StripeJS.setAttribute('src','https://js.stripe.com/v3/');
  document.getElementsByTagName('head')[0].appendChild(StripeJS);
}

// injects paymentfont into the browser
let paymentfont = document.createElement('link');
paymentfont.setAttribute('rel','stylesheet');
paymentfont.setAttribute('type','text/css');
paymentfont.setAttribute('href','https://cdnjs.cloudflare.com/ajax/libs/paymentfont/1.1.2/css/paymentfont.min.css');
document.getElementsByTagName('head')[0].appendChild(paymentfont);

const components = [
  CardCvc,
  CardExpiry,
  CardNumber
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
