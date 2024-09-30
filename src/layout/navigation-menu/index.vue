<template>
  <!-- Navigation -->
  <header>
    <nav class="left-0 right-0 z-10 px-2 border-b border-gray-300">
      <!-- Navigation menu -->
      <div class="bg-white sticky flex py-2">
        <!-- dummy to leave left column empty -->
        <div class="basis-1/3 flex-none"></div>
        <div class="basis-1/3 flex-none flex flex-1 items-center">
          <router-link v-if="isSearchBarVisible" as="nav" class="flex-1 px-2 flex justify-center" active-class="active" to="/" exact>
            <span class="olahd-link-color">{{
              "OLA-HD"
            }}</span>
          </router-link>
        </div>
        <div class="basis-1/3 flex flex-wrap flex-row-reverse gap-4 ">
          <div class="items-center justify-center">
            <LoginBtnCustom :authService="authService" v-if="isCustomLogin"/>
            <LoginBtnKeycloak :authService="authService" v-else/>
          </div>
          <div v-if="isSearchBarVisible" class="flex flex-1 items-center flex-row-reverse">
            <Search/>
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
      return this.$router.currentRoute.value.path !== "/";
    },
    isCustomLogin() {
      return !this.authService.isKeycloak()
    }
  },
};
</script>

<style lang="scss" scoped></style>
