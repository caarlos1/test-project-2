import { mount } from '@vue/test-utils'
import axios from 'axios'
import { nextTick } from 'vue'

import ProductList from '.'

import { makeServer } from '@/miragejs/server'
import TheSearch from '@/components/TheSearch'
import ProductCard from '@/components/ProductCard'

jest.mock('axios', () => ({
  get: jest.fn(),
}))

describe('ProductList - integration', () => {
  let server

  beforeEach(() => {
    server = makeServer({ enviroment: 'test' })
  })

  afterEach(() => {
    server.shutdown()
  })

  it('should mount the component', () => {
    const wrapper = mount(ProductList)
    expect(wrapper.vm).toBeDefined()
  })

  it('should mount the TheSearch component', () => {
    const wrapper = mount(ProductList)
    expect(wrapper.findComponent(TheSearch)).toBeDefined()
  })

  it('should call axios.get on component mount', () => {
    mount(ProductList, {
      mocks: { $axios: axios },
    })

    expect(axios.get).toHaveBeenCalledTimes(1)
    expect(axios.get).toHaveBeenCalledWith('/api/products')
  })

  it('should mount the ProductCard component 10 times', async () => {
    const products = server.createList('product', 10)

    // mock de requisição
    axios.get.mockReturnValue(await Promise.resolve({ data: { products } }))

    const wrapper = mount(ProductList, {
      mocks: { $axios: axios }, // mokando métodos
    })

    await nextTick() // Segurando o teste para requisição funcionar (Vue.js)

    const cards = wrapper.findAllComponents(ProductCard)
    expect(cards).toHaveLength(10)
  })
})
