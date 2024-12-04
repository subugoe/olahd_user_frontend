<template>
  <form class="p-4 rounded-md flex flex-col" @submit.prevent="onSubmit">
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
</template>

<script>
import { authService } from "../../auth/auth"
export default {
  data() {
    return {
      username: "",
      password: "",
      isFailed: false,
    };
  },
  props: {
    onSuccess: {
      type: Function,
      default: () => {},
    },
  },
  methods: {
    onSubmit() {
      // Hide the error message
      this.isFailed = false;

      const formData = {
        username: this.username,
        password: this.password,
      };
      authService.loginCustom(formData.username, formData.password)
        .then((result) => {
          this.onSuccess();
          this.$router.replace("/dashview/dashboard");
        })
        .catch(() => {
          this.isFailed = true;
        });
    },
  },
};
</script>
