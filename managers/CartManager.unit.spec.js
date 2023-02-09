import { CartManager } from './CartManager'
import { makeServer } from '@/miragejs/server'

describe('CartManager', () => {
  let server
  let manager

  beforeEach(() => {
    server = makeServer({ enviroment: 'test' })
    manager = new CartManager()
  })

  afterEach(() => {
    server.shutdown()
  })

  it('should return the state', () => {
    const product = server.create('product')

    manager.addProduct(product)
    manager.open()

    const state = manager.getState()

    expect(state).toEqual({
      open: true,
      items: [product],
    })
  })

  it('should set cart to open', () => {
    const state = manager.open()
    expect(state.open).toBe(true)
  })

  it('should set cart to close', () => {
    const state = manager.close()
    expect(state.open).toBe(false)
  })

  it('should add product to the cart only once', () => {
    const product = server.create('product')
    manager.addProduct(product)
    const state = manager.addProduct(product)

    expect(state.items).toHaveLength(1)
  })

  it('should remove product from the cart', () => {
    const product = server.create('product')
    manager.addProduct(product)

    const state = manager.removeProduct(product.id)

    expect(state.items).toHaveLength(0)
  })

  it('should clear products', () => {
    const product1 = server.create('product')
    const product2 = server.create('product')

    manager.addProduct(product1)
    manager.addProduct(product2)

    const state = manager.clearProducts()

    expect(state.items).toHaveLength(0)
  })

  it('should clear cart', () => {
    const product1 = server.create('product')
    const product2 = server.create('product')

    manager.addProduct(product1)
    manager.addProduct(product2)
    manager.open()

    const state = manager.clearCart()

    expect(state.items).toHaveLength(0)
    expect(state.open).toBe(false)
  })

  it('should return true if cart is not empty', () => {
    const product = server.create('product')
    manager.addProduct(product)

    expect(manager.hasProducts()).toBe(true)
  })

  it('should return true if product is already in the cart', () => {
    const product = server.create('product')
    manager.addProduct(product)
    manager.productIsInTheCart(product)

    expect(manager.productIsInTheCart(product)).toBe(true)
  })
})
