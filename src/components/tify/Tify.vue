<template>
  <h1 class="hidden">Tify Viewer</h1>
  <div class="row my-2 mx-4">
    <button type="button" class="btn btn-link olahd-link-color" @click="$router.go(-1)">
      &laquo; Back
    </button>
  </div>
  <div id="tify" class="flex-grow h-[calc(100vh-250px)]"></div>
</template>
<script>
import 'tify'
import 'tify/dist/tify.css'
import lzaApi from "@/services/lzaApi";

export default {
  data() {
    return {
      tify: null,
    }
  },
  computed: {
    id() {
      return this.$route.query.id;
    },
  },
  mounted() {
    this.tify = new Tify({
      container: '#tify',
      manifestUrl: `${lzaApi.getBaseUrl()}iiif/manifest?id=${this.id}`,
    })
  },
  beforeUnmount() {
    this.tify.destroy()
  },
};
</script>
<style scoped></style>
