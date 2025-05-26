<template>
  <footer class="bg-gray-700">
    <div class="container mx-auto flex flex-wrap justify-center gap-10 m-1 p-1">
        <a class="flex" v-for="(item, index) in urls" :key="index" :href="item.to" :title="item.title" target="_blank">
          <img width="160" :src="createImageUrl(item.image)" :alt="item.title" />
        </a>
    </div>
    <div class="border-t border-gray-500 m-1 pt-1">
      <div class="container mx-auto flex flex-wrap text-sm justify-center">
        <!--
          <router-link class="px-2" as="nav" active-class="active" to="/contact">
            <span class="nav-link text-white hover:text-blue-300">Contact</span>
          </router-link>
          <p class="px-2 text-gray-500">-</p>
        -->
          <a href="https://ocr-d.de/de/impressum" target="_blank"
            class="px-2 nav-link text-white hover:text-blue-300">Imprint</a>
          <p class="px-2 text-gray-500">-</p>
          <router-link class="px-2" as="nav" active-class="active" to="/data_protection">
            <span class="nav-link text-white hover:text-blue-300">Privacy notice</span>
          </router-link>
      </div>
    </div>
  </footer>
</template>

<script>
import urls from "../../utilities/urls";
import packageInfo from "../../../package.json";

export default {
  name: "Footer",
  data: () => ({
    packageVersion: "",
    urls,
  }),
  created() {
    this.packageVersion = packageInfo.version;
  },
  methods: {
    createImageUrl(name) {
      return new URL(`/src/assets/${name}`, import.meta.url).href;
    }
  }
};
</script>
<style scoped>

</style>
