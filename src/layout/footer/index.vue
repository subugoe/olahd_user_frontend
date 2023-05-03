<template>
  <footer>
    <div class="bg-gray-700">
      <div class="grid grid-cols-3 gap-4 py-2">
        <div class="flex flex-1 items-center ml-10">
          <router-link
            class="flex flex-1"
            as="nav"
            active-class="active"
            to="/about"
          >
            <span class="nav-link text-white hover:text-sky-700">About</span>
          </router-link>
          <router-link
            class="flex flex-1"
            as="nav"
            active-class="active"
            to="/contact"
          >
            <span class="nav-link text-white hover:text-sky-700">Kontakt</span>
          </router-link>
          <router-link
            class="flex flex-1"
            as="nav"
            active-class="active"
            to="/imprint"
          >
            <span class="nav-link text-white hover:text-sky-700">Impressum</span>
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
              height="80px"
              width="160px"
              :src="require(`/public/assets/${item.image}`)"
            />
          </a>
        </div>

        <div class="flex flex-1 items-center justify-around">
          <div class="text-white">Version - RC</div>
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
