import { mount } from '@vue/test-utils'
import ProductCard from './ProductCard.vue'
import { makeServer } from '@/miragejs/server'

describe('ProductCard - unit', () => {
  let server

  const mountProductCard = () => {
    return mount(ProductCard, {
      propsData: {
        product: server.create('product', {
          title: 'Relógio bonito',
          price: '22.00',
          image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314',
        }),
      },
    })
  }

  beforeEach(() => {
    server = makeServer({ enviroment: 'test' })
  })

  afterEach(() => {
    server.shutdown()
  })

  it('should mount the component ', () => {
    const wrapper = mountProductCard()
    expect(wrapper.vm).toBeDefined()
    expect(wrapper.text()).toContain('Relógio bonito')
    expect(wrapper.text()).toContain('$22.00')
  })

  it('should match snapshot', () => {
    const wrapper = mountProductCard()
    expect(wrapper.element).toMatchSnapshot()
  })

  it('should emit the event addToCart with product object', () => {

  })
})
