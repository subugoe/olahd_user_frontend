import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useTokenStore = defineStore('token', () => {
  const token = ref(null)
  const username = ref(null)

  const isAuthenticated = computed(() => !!token.value)

  function setToken(newToken) {
    token.value = newToken
  }

  function setUsername(newUsername) {
    username.value = newUsername
  }

  function clearToken() {
    token.value = null
  }

  function clearUsername() {
    username.value = null
  }

  return {
    token,
    isAuthenticated,
    setToken,
    clearToken,
    setUsername,
    clearUsername,
  }
})
