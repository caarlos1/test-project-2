import { mount } from '@vue/test-utils'
import CartItem from './CartItem'

import { makeServer } from '@/miragejs/server'

describe('CartItem - unit', () => {
  let server

  beforeEach(() => {
    server = makeServer({ enviroment: 'test' })
  })

  afterEach(() => {
    server.shutdown()
    jest.clearAllMocks()
  })

  const mountCartItem = () => {
    const product = server.create('product', {
      title: 'sapato maluco',
      price: '22.33',
    })
    const wrapper = mount(CartItem, { propsData: { product } })
    return { product, wrapper }
  }

  it('should mount the component', () => {
    const { wrapper } = mountCartItem()
    expect(wrapper.vm).toBeDefined()
  })

  it('should display product info', () => {
    const {
      wrapper,
      product: { title, price },
    } = mountCartItem()

    const content = wrapper.text()

    expect(content).toContain(title)
    expect(content).toContain(price)
  })

  it('should display quantity 1 when product is first displayed', () => {
    const { wrapper } = mountCartItem()
    const quantity = wrapper.find('[data-testid="quantity"]')
    expect(quantity.text()).toContain('1')
  })

  it('should increase quantity when + button gets clicked', async () => {
    const { wrapper } = mountCartItem()
    const button = wrapper.find('[data-testid="+"]')
    const quantity = wrapper.find('[data-testid="quantity"]')

    await button.trigger('click')
    expect(quantity.text()).toContain('2')
    await button.trigger('click')
    expect(quantity.text()).toContain('3')
    await button.trigger('click')
    expect(quantity.text()).toContain('4')
  })

  it('should decrease quantity when - button gets clicked', async () => {
    const { wrapper } = mountCartItem()
    const button = wrapper.find('[data-testid="-"]')
    const quantity = wrapper.find('[data-testid="quantity"]')

    await button.trigger('click')
    expect(quantity.text()).toContain('0')
  })

  it('should not go below zero when button - is repeatedly clicked', async () => {
    const { wrapper } = mountCartItem()
    const button = wrapper.find('[data-testid="-"]')
    const quantity = wrapper.find('[data-testid="quantity"]')

    await button.trigger('click')
    await button.trigger('click')
    expect(quantity.text()).toContain('0')
  })
})
