import { createPinia, defineStore } from 'pinia'

export const mystore = defineStore('mystore', {
  state: () => {
    return {
      showExtraFilters: false,
      isMobile: false,
    }
  },
  actions: {
    setIsMobile(newval) {
      this.isMobile = newval
    },
  }
})

const store = createPinia()

export default store
