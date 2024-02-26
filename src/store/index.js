import { createPinia, defineStore } from 'pinia'

export const mystore = defineStore('mystore', {
  state: () => {
    return {
      showExtraFilters: false
    }
  },
})

const store = createPinia()

export default store
