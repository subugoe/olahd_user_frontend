<template>
  <div class="grid ml-4">
    <h1>Forward to latest OCRD-ZIP of Ocrd-Identifier</h1>
    <span v-if="showErrorMsg">
      Ocrd-Identifier: <strong>{{ id }}</strong> not found
    </span>
    <router-link class="max-w-fit olahd-link-color mt-2" :to="{ name: 'home' }">
      Go back to main page
    </router-link>
  </div>
</template>

<script setup>
  import { ref } from 'vue';
  import { useRouter, useRoute } from 'vue-router'
  import lzaApi from "@/services/lzaApi";

  const showErrorMsg = ref(false)

  const route = useRoute()
  const router = useRouter()
  const id = route.query.id

  lzaApi.getLatestPidForOcrdidentifier(id).then(response => {
    if (response.data) {
      router.push({
        name: "search-detail",
        query: {
          id: response.data
        }
      })
    }
  }).catch(() => {
    showErrorMsg.value=true
  })
</script>
<style scoped>
  h1 {
    @apply mb-4 text-xl font-semibold text-slate-700
  }
</style>
