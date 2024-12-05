import { createPinia, defineStore } from 'pinia'

export const mystore = defineStore('mystore', {
  state: () => {
    return {
      isMobile: false,
      isSidebarExpanded: true,
    }
  },
  actions: {
    setIsMobile(newval) {
      this.isMobile = newval
    },
    setIsSidebarExpanded(newval) {
      this.isSidebarExpanded = newval
    }
  }
})

const store = createPinia()

export default store
