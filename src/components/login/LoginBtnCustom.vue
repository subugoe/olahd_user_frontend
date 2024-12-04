<template>

  <div>
    <div v-if="showDashboardLink">
      <button
        type="button"
        class="normal-blue-button"
        id="dashboard-link-button"
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
        v-on:click.stop
        @click="openLoginModal"
      >
        Sign In
      </button>
      <Dialog
        header="OLA-HD Login"
        :append-to-body="true"
        v-model:visible="isOpen"
        modal
        dismissableMask
        @hide=""
        :pt="{
          title: {
            class: ['text-lg', 'font-medium'],
          },
        }"
        :class="{ 'w-1/2' : !isMobile }"
      >
        <Login :open="isOpen" :onSuccess="closeDialog" />
      </Dialog>
    </div>
    <div v-else>
      <button
        type="button"
        class="normal-blue-button"
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
import Login from '../../components/login/Login.vue'
import Dialog from "primevue/dialog";
import { mystore } from "@/store";
import { mapState } from "pinia";

export default {
  components: { Login, Dialog },
  data() {
    return {
      isOpen: false,
      isUserLoggedIn: false,
    };
  },
  computed: {
    showDashboardLink() {
      return this.isUserLoggedIn && !this.$router.currentRoute.value.path.includes("dashview")
    },
    ...mapState(mystore, ["isMobile"]),
  },
  methods: {
    onClose() {
      this.isOpen = false;
    },
    openLoginModal() {
      this.isOpen = true;
    },
    closeDialog() {
      this.isOpen = false;
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
