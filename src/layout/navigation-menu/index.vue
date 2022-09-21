<template>
  <!-- Navigation -->
  <header>
    <nav class="left-0 right-0 z-10" style="position: fixed">
      <!-- Navigation menu -->
      <div class="bg-white sticky top-0">
        <div
          class="
            flex
            justify-between
            items-center
            py-2
            md:justify-start md:space-x-10
          "
        >
          <div class="flex justify-start lg:w-0 lg:flex-1">
            <router-link
              as="nav"
              class="px-2"
              active-class="active"
              to="/"
              exact
            >
              <a class="nav-link text-sky-500 hover:text-slate-700">Home</a>
            </router-link>
          </div>
          <div
            class="
              flex
              justify-center
              text-sky-500
              lg:flex-1
            "
          >
            <span>OLA-HD Service</span>
          </div>
          <div class="hidden md:flex items-center justify-end md:flex-1">
            <Search v-if="isSearchBarVisible" />
            <router-link as="nav" active-class="active" to="/about">
              <a class="nav-link text-sky-500 hover:text-slate-700">About</a>
            </router-link>
            <router-link as="nav" active-class="active" to="/contact">
              <a class="nav-link text-sky-500 hover:text-slate-700">Kontakt</a>
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
