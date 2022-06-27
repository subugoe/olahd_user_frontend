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
          required
          v-model="query"
        />
        <span class="absolute inset-y-0 right-1 flex items-center">
          <button
            type="submit"
            class="p-1 focus:outline-none focus:shadow-outline"
          >
            <svg
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              viewBox="0 0 24 24"
              class="w-5 h-5"
            >
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
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
      this.query = this.query.trim();
      // Only search if the query is not empty
      if (this.query.length > 0) {
        this.$router
          .push({
            name: "search",
            query: {
              q: this.query,
            },
          })
          .catch(() => {}); // To ignore the Navigation Duplicated error
      }
    },
  },
};
</script>