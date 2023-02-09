import { mount } from '@vue/test-utils'
import DefaultLayout from '@/layouts/default'
import TheCart from '@/components/TheCart'
import { CartManager } from '@/managers/CartManager'

describe('Default Layout', () => {
  const mountLayout = () => {
    const wrapper = mount(DefaultLayout, {
      mocks: { $cart: new CartManager() },
      stubs: { nuxt: true },
    })
    return { wrapper }
  }

  it('should mount TheCart component', () => {
    const { wrapper } = mountLayout()
    expect(wrapper.findComponent(TheCart).exists()).toBe(true)
  })

  it('should toggle Cart visibillity', async () => {
    const { wrapper } = mountLayout()
    const button = wrapper.find('[data-testid="toggle-button"]')

    await button.trigger('click')
    expect(wrapper.vm.isCartOpen).toBe(true)

    await button.trigger('click')
    expect(wrapper.vm.isCartOpen).toBe(false)
  })
})
