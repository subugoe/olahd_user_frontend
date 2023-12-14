<template>
  <div>
    <div v-if="showDashboardLink">
      <button
        type="button"
        class="bg-sky-600 font-medium px-4 py-2 shadow-sm rounded-md text-white
                hover:bg-sky-700"
        id="dashboard-link-button"
        @click="$router.push('dashview/dashboard')"
      >
      Dashboard
      </button>
    </div>
    <div v-else-if="!isUserLoggedIn">
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
        @click="authService.loginKeycloak();"
      >
        Login
      </button>
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
        @click="authService.logoutKeycloak()"
      >
        Logout
      </button>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      isUserLoggedIn: false,
    };
  },
  props: [
    "authService"
  ],
  computed: {
    showDashboardLink() {
      return this.isUserLoggedIn && !this.$router.currentRoute.value.path.includes("dashview")
    }
  },

  async created() {
    this.authService.addLoggedInListener((newVal) => {
      this.isUserLoggedIn = newVal
    })
    this.isUserLoggedIn = await this.authService.isUserLoggedIn();
  },
}
</script>
