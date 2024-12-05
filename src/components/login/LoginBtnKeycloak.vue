<template>
  <div>
    <div v-if="showDashboardLink">
      <button
        type="button"
        class="normal-blue-button"
        id="dashboard-link-button"
        aria-label="Go to dashboard"
        @click="$router.push('dashview/dashboard')"
      >
      Dashboard
      </button>
    </div>
    <div v-else-if="!isUserLoggedIn">
      <button
        type="button"
        class="normal-blue-button"
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
        class="normal-blue-button"
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
