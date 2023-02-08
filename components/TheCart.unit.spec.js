import { mount } from '@vue/test-utils'
import TheCart from './TheCart.vue'
import CartItem from './CartItem.vue'

import { makeServer } from '@/miragejs/server'

describe('TheCart - unit', () => {
  let server

  beforeEach(() => {
    server = makeServer({ enviroment: 'test' })
  })

  afterEach(() => {
    server.shutdown()
  })

  it('should mount the component', () => {
    const wrapper = mount(TheCart)
    expect(wrapper.vm).toBeDefined()
  })

  it('should emit a close event when button gets clicked', async () => {
    const wrapper = mount(TheCart)
    const button = wrapper.find('[data-testid="close-button"]')

    await button.trigger('click')

    expect(wrapper.emitted().close).toBeTruthy()
    expect(wrapper.emitted().close).toHaveLength(1)
  })

  it('should hide the cart when no prop isOpen is passed', () => {
    const wrapper = mount(TheCart)
    expect(wrapper.classes()).toContain('hidden')
  })

  it('should display the cart when prop isOpen is passed', () => {
    const wrapper = mount(TheCart, { propsData: { isOpen: true } })
    expect(wrapper.classes()).not.toContain('hidden')
  })

  it('should display "Cart is empty" when there are no products', () => {
    const wrapper = mount(TheCart)
    expect(wrapper.text()).toContain('Cart is empty')
  })

  it('should display 2 instances of CartItem when two products are provide', () => {
    const products = [...server.createList('product', 2)]

    const wrapper = mount(TheCart, {
      propsData: { products },
    })

    const carts = wrapper.findAllComponents(CartItem)

    expect(carts).toHaveLength(2)
    expect(wrapper.text()).not.toContain('Cart is empty')
  })
})
