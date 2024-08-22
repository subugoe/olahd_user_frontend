<template>
  <footer>
    <div class="bg-gray-700">
      <div class="grid grid-cols-2 gap-4 py-2">
        <div class="flex flex-1 items-center ml-10 space-x-2 text-sm">
          <router-link class="flex flex-1" as="nav" active-class="active" to="/contact">
            <span class="nav-link text-white hover:text-sky-700">Kontakt</span>
          </router-link>
          <div class="flex flex-1">
            <a href="https://ocr-d.de/de/impressum" target="_blank" class="nav-link text-white hover:text-sky-700">Impressum</a>
          </div>
          <router-link class="flex flex-1" as="nav" active-class="active" to="/data_protection">
            <span class="nav-link text-white hover:text-sky-700">Datenschutzhinweis</span>
          </router-link>
        </div>

        <div class="flex flex-1 justify-between items-center">
          <a
            v-for="(item, index) in urls"
            :key="index"
            :href="item.to"
            :title="item.title"
            target="_blank"
          >
            <img
              height="80"
              width="160"
              :src="createImageUrl(item.image)"
              :alt="item.title"
            />
          </a>
        </div>
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
