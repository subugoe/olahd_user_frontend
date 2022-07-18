<template>
  <footer>
    <div class="bg-gray-700">
      <div
        class="
          flex
          justify-between
          items-center
          py-2
          md:justify-start md:space-x-10
        "
      >
        <div class="flex lg:flex-1 justify-content-center">
          <router-link as="nav" active-class="active" to="/about">
            <a class="nav-link text-white hover:text-sky-700">About</a>
          </router-link>
          <router-link as="nav" active-class="active" to="/contact">
            <a class="nav-link text-white hover:text-sky-700">Kontakt</a>
          </router-link>
        </div>

        <div class="grid-cols-3 gap-4 flex items-center">
          <a
            v-for="(item, index) in urls"
            :key="index"
            :href="item.to"
            :title="item.title"
            target="_blank"
          >
            <img
              height="80px"
              width="160px"
              :src="require(`/public/assets/${item.image}`)"
            />
          </a>
        </div>

        <div class="flex lg:flex-1 justify-content-center">
          <div class="text-white">Version {{ packageVersion }}</div>
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
};
</script>
