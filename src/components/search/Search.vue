<template>
  <div>
    <form @submit.prevent="submit" id="search-header-small">
      <div class="relative text-gray-600 focus-within:text-gray-400">
        <input
          type="text"
          name="q"
          id="search-input"
          class="
            py-1.5
            text-sm text-black
            bg-white
            pl-2
            pr-8
            rounded-md
            focus:outline-none focus:bg-white focus:text-gray-900
            border
            focus:ring
          "
          placeholder="Search..."
          autocomplete="off"
          v-model="query"
        />
        <span class="absolute inset-y-0 right-1 flex items-center">
          <button
            type="submit"
            class="p-1 focus:outline-none focus:shadow-outline"
          >
            <i class="fas fa-search fa-lg olahd-link-color"></i>
          </button>
        </span>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      query: this.$route.query["q"],
    };
  },
  methods: {
    submit() {
      this.$router
        .push({
          name: "search",
          query: {
            q: this.query || "",
          },
        })
        .catch(() => {}); // To ignore the Navigation Duplicated error
    },
  },
};
</script>