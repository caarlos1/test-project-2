import { mount } from '@vue/test-utils'
import TheSearch from '@/components/TheSearch'

describe('TheSearch - unit', () => {
  it('it should mount the component', () => {
    const wrapper = mount(TheSearch)
    expect(wrapper.vm).toBeDefined() // instancia do componente vue
  })

  it('should emit search event when form is submitted', async () => {
    const wrapper = mount(TheSearch)
    const term = 'i like potato'

    await wrapper.find('input[type="search"]').setValue(term)
    await wrapper.find('form').trigger('submit')

    expect(wrapper.emitted().doSearch).toBeTruthy()
    expect(wrapper.emitted().doSearch.length).toBe(1)
    expect(wrapper.emitted().doSearch[0]).toEqual([{ term }])
  })

  it('should emit search event when search input is cleared', async () => {
    const wrapper = mount(TheSearch)
    const input = wrapper.find('input[type="search"]')

    const term = 'i like potato'

    await input.setValue(term)
    await input.setValue('')

    expect(wrapper.emitted().doSearch).toBeTruthy()
    expect(wrapper.emitted().doSearch.length).toBe(1)
    expect(wrapper.emitted().doSearch[0]).toEqual([{ term: '' }])
  })
})
