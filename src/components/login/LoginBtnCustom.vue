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
        @click="logout"
      >
        Log out
      </button>
    </div>
  </div>
</template>
<script>
import LoginModal from '../../components/login/Login.vue'
export default {
  components: { LoginModal },
  data() {
    return {
      isOpen: false,
      isUserLoggedIn: false,
    };
  },
  computed: {
    showDashboardLink() {
      return this.isUserLoggedIn && !this.$router.currentRoute.value.path.includes("dashview")
    }
  },
  methods: {
    onClose() {
      this.isOpen = false;
    },
    openLoginModal() {
      this.isOpen = true;
    },
    logout() {
      this.authService.logoutCustom()
      this.isUserLoggedIn = false
      this.$router.push("/")
    }
  },
  props: [
    "authService"
  ],
  created() {
    this.authService.addLoggedInListener((newVal) => {
      this.isUserLoggedIn = newVal
    })
    this.isUserLoggedIn = this.authService.isUserLoggedIn();
  }
}
</script>
