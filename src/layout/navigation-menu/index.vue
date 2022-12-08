<template>
  <!-- Navigation -->
  <header>
    <nav class="left-0 right-0 z-10" style="position: fixed">
      <!-- Navigation menu -->
      <div class="bg-white sticky top-0 grid grid-cols-6 gap-4 py-2">
        <div class="flex flex-1 justify-around items-center">
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
        <div
          v-if="isSearchBarVisible"
          class="flex flex-1 lg:flex-none px-5 pt-2 rounded-md"
        >
          <Search />
        </div>
        <div class="col-end-7 flex">
          <div class="flex flex-1 items-center">
            <router-link
              class="
                btn
                flex flex-1
                items-center
                hover:text-sky-700
                dark:hover:text-sky-600
              "
              as="nav"
              active-class="active"
              to="/about"
            >
              <span class="nav-link text-sky-500 hover:text-slate-700"
                >About</span
              >
            </router-link>
            <router-link
              class="
                btn
                flex flex-1
                items-center
                hover:text-sky-700
                dark:hover:text-sky-600
              "
              as="nav"
              active-class="active"
              to="/contact"
            >
              <span class="nav-link text-sky-500 hover:text-slate-700"
                >Kontakt</span
              >
            </router-link>
            <div class="ml-3 mr-3 relative w-max">
              <div v-if="!username">
                <button
                  type="button"
                  class="
                    bg-sky-600
                    font-medium
                    px-4
                    py-2
                    shadow-sm
                    rounded-md
                    text-white
                    hover:bg-sky-700
                  "
                  id="user-menu-button"
                  aria-expanded="false"
                  aria-haspopup="true"
                  v-on:click.stop
                  @click="openLoginModal"
                >
                  Sign In
                </button>
                <LoginModal :open="isOpen" :onClose="onClose" />
              </div>
              <div v-else>
                <button
                  type="button"
                  class="
                    bg-sky-600
                    font-medium
                    px-4
                    py-2
                    shadow-sm
                    rounded-md
                    text-white
                    hover:bg-sky-700
                  "
                  id="user-menu-button"
                  aria-expanded="false"
                  aria-haspopup="true"
                  @click="handleLogout"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  </header>
</template>

<script>
import LoginModal from "../../components/login/Login.vue";
import Search from "../../components/search/Search.vue";

export default {
  components: { LoginModal, Search },
  data() {
    return {
      isOpen: false,
    };
  },
  methods: {
    onClose() {
      this.isOpen = false;
    },
    openLoginModal() {
      this.isOpen = true;
    },
    handleLogout() {
      this.$store.dispatch("logout");
      this.$router.push("/");
    },
  },
  computed: {
    username() {
      return this.$store.getters["username"];
    },
    isSearchBarVisible() {
      return this.$route.path !== "/";
    },
  },
};
</script>

<style lang="scss" scoped></style>
