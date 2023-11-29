<template>
  <!-- Navigation -->
  <header>
    <nav class="left-0 right-0 z-10" style="position: fixed">
      <!-- Navigation menu -->
      <div class="bg-white sticky top-0 grid grid-cols-6 gap-4 py-2">
        <div class="flex flex-1 justify-between items-center">
          <router-link as="nav" class="px-2" active-class="active" to="/" exact>
            <span class="pl-2 text-sky-500 hover:text-slate-700">{{
              "Home"
            }}</span>
          </router-link>
        </div>
        <div
          class="
            flex flex-1
            items-center
            justify-center
            col-start-3 col-span-2
            text-sky-500
            lg:flex-1
          "
        >
          <span>OLA-HD Service</span>
        </div>

        <div class="flex col-start-5 col-span-2 justify-end">
          <div
            v-if="isSearchBarVisible"
            class="flex"
          >
            <Search />
          </div>
          <div class="flex ">
            <div class="ml-3 mr-3 relative w-max">
              <LoginBtnCustom :authService="authService" v-if="isCustomLogin" />
              <LoginBtnKeycloak :authService="authService" v-else />
            </div>
          </div>
        </div>
      </div>
    </nav>
  </header>
</template>

<script>
import Search from "../../components/search/Search.vue";
import LoginBtnCustom from "../../components/login/LoginBtnCustom.vue";
import LoginBtnKeycloak from "../../components/login/LoginBtnKeycloak.vue";
import { authService } from "../../auth/auth";

export default {
  components: { Search, LoginBtnCustom, LoginBtnKeycloak },
  data() {
    return {
      authService: authService
    };
  },
  computed: {
    isSearchBarVisible() {
      return this.$router.currentRoute.path !== "/";
    },
    isCustomLogin() {
      return !this.authService.isKeycloak()
    }
  },
};
</script>

<style lang="scss" scoped></style>
