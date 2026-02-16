import { createPinia, defineStore } from 'pinia'
import { ref } from 'vue'

export const useSettingsStore = defineStore('settings', () => {
  const isMobile = ref(false)
  const isSidebarExpanded = ref(true)

  function setIsMobile(newIsMobile) {
    isMobile.value = newIsMobile
  }

  function setIsSidebarExpanded(newValue) {
    isSidebarExpanded.value = newValue
  }

  return {
    isMobile,
    setIsMobile,
    isSidebarExpanded,
    setIsSidebarExpanded,
  }
})
