import Vue from 'vue'

export class CartManager {
  state
  initialState = {
    open: false,
    items: [],
  }

  constructor() {
    this.state = Vue.observable(this.initialState)
  }

  getState() {
    return this.state
  }

  open() {
    this.state.open = true
    return this.getState()
  }

  close() {
    this.state.open = false
    return this.getState()
  }

  productIsInTheCart(product) {
    return !!this.state.items.find(({ id }) => id === product.id)
  }

  addProduct(product) {
    if (!this.productIsInTheCart(product)) {
      this.state.items.push(product)
    }

    return this.getState()
  }

  removeProduct(productId) {
    this.state.items = [
      ...this.state.items.filter((product) => product.id !== productId),
    ]
    return this.getState()
  }

  clearProducts() {
    this.state.items = []
    return this.getState()
  }

  clearCart() {
    this.clearProducts()
    this.close()
    return this.getState()
  }

  hasProducts() {
    return this.getState().items.length > 0
  }
}

// Criando plugin para adicionar no nuxt
export default {
  install: (Vue) => {
    /* istanbul ignore next */
    Vue.prototype.$cart = new CartManager()
  },
}
