<template>
  <span class="ml-4" v-if="showErrorMsg">
    Ocrd-Identifier: <strong>{{ this.$route.query["id"] }}</strong> not found
  </span>
  <router-link class="text-sky-500 hover:text-slate-700 m-4" :to="{ name: 'home' }">
    Go back to main page
  </router-link>
</template>

<script setup>
  import { ref } from 'vue';
  import { useRouter, useRoute } from 'vue-router'
  import lzaApi from "@/services/lzaApi";

  const showErrorMsg = ref(false)

  const route = useRoute()
  const router = useRouter()

  lzaApi.getLatestPidForOcrdidentifier(route.query.id).then(response => {
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
