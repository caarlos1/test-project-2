import { mount } from '@vue/test-utils'
import TheCart from './TheCart.vue'
import CartItem from './CartItem.vue'
import { CartManager } from '@/managers/CartManager'

import { makeServer } from '@/miragejs/server'

describe('TheCart - unit', () => {
  let server

  beforeEach(() => {
    server = makeServer({ enviroment: 'test' })
  })

  afterEach(() => {
    server.shutdown()
  })

  const mountCart = (totalProducts = 0) => {
    const products = server.createList('product', totalProducts)
    const cartManager = new CartManager()

    const wrapper = mount(TheCart, {
      propsData: { products },
      mocks: { $cart: cartManager },
    })

    return { wrapper, cartManager, products }
  }

  it('should mount the component', () => {
    const { wrapper } = mountCart()
    expect(wrapper.vm).toBeDefined()
  })

  it('should emit a close event when button gets clicked', async () => {
    const { wrapper } = mountCart()
    const button = wrapper.find('[data-testid="close-button"]')

    await button.trigger('click')

    expect(wrapper.emitted().close).toBeTruthy()
    expect(wrapper.emitted().close).toHaveLength(1)
  })

  it('should hide the cart when no prop isOpen is passed', () => {
    const { wrapper } = mountCart()
    expect(wrapper.classes()).toContain('hidden')
  })

  it('should display the cart when prop isOpen is passed', async () => {
    const { wrapper } = mountCart()
    await wrapper.setProps({ isOpen: true })

    expect(wrapper.classes()).not.toContain('hidden')
  })

  it('should display "Cart is empty" when there are no products', () => {
    const { wrapper } = mountCart()
    expect(wrapper.text()).toContain('Cart is empty')
  })

  it('should display 2 instances of CartItem when two products are provide', () => {
    const { wrapper } = mountCart(2)
    const carts = wrapper.findAllComponents(CartItem)

    expect(carts).toHaveLength(2)
    expect(wrapper.text()).not.toContain('Cart is empty')
  })

  it('should display a button to clear cart', () => {
    const { wrapper } = mountCart(2)
    const button = wrapper.find('[data-testid="clear-cart-button"]')
    expect(button.exists()).toBe(true)
  })

  it('should not display empty cart button when there are no products', () => {
    const { wrapper } = mountCart()
    const button = wrapper.find('[data-testid="clear-cart-button"]')
    expect(button.exists()).toBe(false)
  })

  it('should call cart manager clearProducts() when button gets clicked', async () => {
    const { wrapper, cartManager } = mountCart(2)

    const spy = jest.spyOn(cartManager, 'clearProducts')
    await wrapper.find('[data-testid="clear-cart-button"]').trigger('click')

    expect(spy).toHaveBeenCalledTimes(1)
  })
})
