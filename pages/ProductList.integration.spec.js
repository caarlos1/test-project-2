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
    jest.clearAllMocks() // limpando os mocks que são mantidos por padrão.
  })

  const getProducts = (quantity = 10, overrides = []) => {
    const products = [...server.createList('product', quantity)]

    overrides.forEach((over) => {
      products.push(server.create('product', over))
    })

    return products
  }

  const mountProductList = async (
    quantity = 10,
    overrides = [],
    shouldReject = false
  ) => {
    const products = getProducts(quantity, overrides)

    if (shouldReject) {
      axios.get.mockReturnValue(Promise.reject(new Error('Error')))
    } else {
      axios.get.mockReturnValue(Promise.resolve({ data: { products } }))
    }

    const wrapper = mount(ProductList, { mocks: { $axios: axios } })
    await nextTick()

    return { wrapper, products }
  }

  it('should mount the component', async () => {
    const { wrapper } = await mountProductList()
    expect(wrapper.vm).toBeDefined()
  })

  it('should mount the TheSearch component', async () => {
    const { wrapper } = await mountProductList()
    expect(wrapper.findComponent(TheSearch)).toBeDefined()
  })

  it('should call axios.get on component mount', async () => {
    await mountProductList()

    expect(axios.get).toHaveBeenCalledTimes(1)
    expect(axios.get).toHaveBeenCalledWith('/api/products')
  })

  it('should mount the ProductCard component 10 times', async () => {
    const { wrapper } = await mountProductList()

    const cards = wrapper.findAllComponents(ProductCard)
    expect(cards).toHaveLength(10)
  })

  it('should display the error message when Promise rejects', async () => {
    const { wrapper } = await mountProductList(0, [], true)

    expect(wrapper.text()).toContain('Problemas ao carregar a lista!')
  })

  it('should filter the product list when a search is perfomed', async () => {
    // Arrange
    const { wrapper } = await mountProductList(10, [
      { title: 'relógio TOP' },
      { title: 'relógio TOP v2' },
    ])

    // Act
    const search = wrapper.findComponent(TheSearch)
    await search.find('input[type="search"]').setValue('relógio')
    await search.find('form').trigger('submit')

    // Assert
    const cards = wrapper.findAllComponents(ProductCard)
    expect(wrapper.vm.searchTerm).toEqual('relógio')
    expect(cards).toHaveLength(2)
  })

  it('should filter the product list when a search is perfomed', async () => {
    // Arrange
    const { wrapper } = await mountProductList(10, [{ title: 'relógio TOP' }])

    // Act
    const search = wrapper.findComponent(TheSearch)

    await search.find('input[type="search"]').setValue('relógio')
    await search.find('form').trigger('submit')

    await search.find('input[type="search"]').setValue('')
    await search.find('form').trigger('submit')

    // Assert
    const cards = wrapper.findAllComponents(ProductCard)
    expect(wrapper.vm.searchTerm).toEqual('')
    expect(cards).toHaveLength(11)
  })

  it('should display the total quantity of products', async () => {
    const { wrapper } = await mountProductList(27)
    const label = wrapper.find('[data-testid="total-quantity-label"]')

    expect(label.text()).toEqual('27 Products')
  })

  it('should display product (singular) when there is only 1 product', async () => {
    const { wrapper } = await mountProductList(1)
    const label = wrapper.find('[data-testid="total-quantity-label"]')

    expect(label.text()).toEqual('1 Product')
  })
})
