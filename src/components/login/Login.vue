<template>
  <Modal :onClose="onClose" :open="open">
    <form class="p-4 rounded-md flex flex-col" @submit.prevent="onSubmit">
      <div class="text-center">
        <h1 class="h2 text-gray-900 mb-4">OLA-HD Login</h1>
      </div>
      <input
        class="border px-3 py-2.5 mb-4 rounded-md"
        placeholder="Username"
        v-model="username"
        required
      />
      <input
        placeholder="Password"
        class="border px-3 py-2.5 mb-4 rounded-md"
        v-model="password"
        type="password"
        required
      />
      <div class="mb-3 text-red-500" v-if="isFailed">
        Login failed. Please check your credentials.
      </div>
      <button
        class="
          bg-blue-500
          text-white
          px-2
          py-2.5
          rounded-md
          focus:ring
          font-semibold
          tracking-wider
        "
      >
        Login
      </button>
    </form>

    <hr />
    <div class="text-center my-2 text-sm text-gray-500">
      If you forget your password or want to create a test account, please
      contact
      <a
        href="mailto:triet.doan@gwdg.de"
        class="text-blue-500"
        title="Open mail for forgot password"
        >triet.doan@gwdg.de</a
      >
    </div>
  </Modal>
</template>

<script>
import Modal from "../modal/Modal.vue";
export default {
  components: { Modal },
  props: {
    open: {
      type: Boolean,
      default: false,
    },
    onClose: {
      type: Function,
      default: () => {},
    },
  },
  data() {
    return {
      username: "",
      password: "",
      isFailed: false,
    };
  },
  methods: {
    onSubmit() {
      // Hide the error message
      this.isFailed = false;

      const formData = {
        username: this.username,
        password: this.password,
      };
      this.$store
        .dispatch("login", {
          username: formData.username,
          password: formData.password,
        })
        .then((result) => {
          // Closing modal
          this.onClose();
          this.$router.replace(
            this.redirect ? this.redirect : "/dashview/dashboard"
          );
        })
        .catch(() => {
          this.isFailed = true;
        });
    },
  },
};
</script>
