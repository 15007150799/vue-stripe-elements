/*!
 * vue-stripe-elements v0.0.1
 * (c) 2017 Stan Guo
 * Released under the MIT License.
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _stripeElement = {
  props: ['context', 'options'],

  render: function render (h) {
    return h('div')
  },

  methods: {
    blur: function blur () {
      this._element.blur();
    },
    focus: function focus () {
      this._element.focus();
    },
    update: function update (options) {
      this._element.update(options);
    },
    mount: function mount () {
      this._element.mount(this.$el);
    },
    unmount: function unmount () {
      this._element.unmount();
    }
  },

  beforeMount: function beforeMount () {
    var this$1 = this;

    this._element = this.context.create(this.type, this.options);

    this.context.registerElement(this._element);

    this._element.on('blur', function (event) {
      this$1.$emit('blur', event);
    });
    this._element.on('focus', function (event) {
      this$1.$emit('focus', event);
    });
    this._element.on('change', function (event) {
      this$1.$emit('change', event);
    });
    this._element.on('ready', function (event) {
      this$1.$emit('ready', event);
    });
  },

  mounted: function mounted () {
    this.mount();
  },

  beforeDestroy: function beforeDestroy () {
    this.unmount();
  }
};

var Card$1 = {
  name: 'stripe-card',

  mixins: [_stripeElement],

  data: function data () {
    return {
      type: 'card'
    }
  }
};

/* istanbul ignore next */
Card$1.install = function(Vue) {
  Vue.component(Card$1.name, Card$1);
};

var CardCvc$1 = {
  name: 'stripe-card-cvc',

  mixins: [_stripeElement],

  data: function data () {
    return {
      type: 'cardCvc'
    }
  }
};

/* istanbul ignore next */
CardCvc$1.install = function(Vue) {
  Vue.component(CardCvc$1.name, CardCvc$1);
};

var CardExpiry$1 = {
  name: 'stripe-card-expiry',

  mixins: [_stripeElement],

  data: function data () {
    return {
      type: 'cardExpiry'
    }
  }
};

/* istanbul ignore next */
CardExpiry$1.install = function(Vue) {
  Vue.component(CardExpiry$1.name, CardExpiry$1);
};

var CardNumber$1 = {
  name: 'stripe-card-number',

  mixins: [_stripeElement],

  data: function data () {
    return {
      type: 'cardNumber'
    }
  }
};

/* istanbul ignore next */
CardNumber$1.install = function(Vue) {
  Vue.component(CardNumber$1.name, CardNumber$1);
};

var PostalCode$1 = {
  name: 'stripe-postal-code',

  mixins: [_stripeElement],

  data: function data () {
    return {
      type: 'postalCode'
    }
  }
};

/* istanbul ignore next */
PostalCode$1.install = function(Vue) {
  Vue.component(PostalCode$1.name, PostalCode$1);
};

var components = [
  Card$1,
  CardCvc$1,
  CardExpiry$1,
  CardNumber$1,
  PostalCode$1
];

var init = function (publishableKey, stripeAccount) {

  var _instance = window.Stripe(publishableKey, stripeAccount);

  // extend the stripe object instance with new properties and methods
  var _stripe = Object.assign({}, _instance,
    {init: init,
    createElements: function createElements () {
      var _elements = this.elements();
      // extend stripe elements instance with new properties and methods
      var _context = Object.assign({}, _elements,

        // collecting all elements created on the same instance of elements
        {registeredElements: [],
        
        registerElement: function registerElement (target) {
          this.registeredElements.push(target);
        },
        
        unregisterElement: function unregisterElement (target) {
          this.registeredElements = this.registeredElements.filter(function (el) {
            return el !== target
          });
        },

        // tokenize data from elements registered on the context
        createToken: function createToken (cardData) {
          if ( cardData === void 0 ) cardData = {};

          var _card = this.registeredElements.find(function (el) {
            return el._componentName === 'card' || 'cardNumber'
          });
          return _stripe.createToken(_card, cardData)
        }});

      return _context
    }});
  return _stripe
};

var install = function (Vue, options) {
  if ( options === void 0 ) options = {};

  if (!window.Stripe) {
    throw new Error(
      'Please load Stripe.js (https://js.stripe.com/v3/) on this page to use vue-stripe-elements.'
    );
  }
  
  var _stripe = init(options.publishableKey, options.stripeAccount);
  Vue.stripe = Vue.prototype.$stripe = _stripe;
  // register components
  components.forEach(function (component) {
    Vue.component(component.name, component);
  });
};

var main = {
  install: install
};

exports['default'] = main;
