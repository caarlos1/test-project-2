import { mount } from '@vue/test-utils'
import ProductCard from './ProductCard.vue'
import { makeServer } from '@/miragejs/server'

describe('ProductCard - unit', () => {
  let server

  const mountProductCard = () => {
    const product = server.create('product', {
      title: 'Relógio bonito',
      price: '22.00',
      image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314',
    })

    return {
      wrapper: mount(ProductCard, {
        propsData: { product },
      }),
      product,
    }
  }

  beforeEach(() => {
    server = makeServer({ enviroment: 'test' })
  })

  afterEach(() => {
    server.shutdown()
  })

  it('should mount the component ', () => {
    const { wrapper } = mountProductCard()
    expect(wrapper.vm).toBeDefined()
    expect(wrapper.text()).toContain('Relógio bonito')
    expect(wrapper.text()).toContain('$22.00')
  })

  it('should match snapshot', () => {
    const { wrapper } = mountProductCard()
    expect(wrapper.element).toMatchSnapshot()
  })

  it('should emit the event addToCart with product object when button gets clicked', async () => {
    const { wrapper, product } = mountProductCard()
    await wrapper.find('button').trigger('click')

    expect(wrapper.emitted().addToCart).toBeTruthy() // foi disparado
    expect(wrapper.emitted().addToCart.length).toBe(1) // quantas vezes foi chamado
    expect(wrapper.emitted().addToCart[0]).toEqual([{ product }]) // payload enviado
  })
})
