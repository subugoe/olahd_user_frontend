<template>
  <div class="h-96 bg-cover bg-gray-400 bg-center p-12 home-img">
    <h4 class="flex justify-center m-5 text-3xl text-gray-600">
      OLA-HD - OCR Langzeitarchiv
    </h4>
    <div class="col-md-6 col-sm-8 mx-auto">
      <form @submit.prevent="submit">
        <label class="relative block">
          <input
            class="
              w-full
              border-3 border-sky-500
              drop-shadow-md
              rounded-pill
              py-2
              pl-3
              pr-10
            "
            type="text"
            placeholder="Suchen"
            v-model="query"
          />
          <span class="absolute inset-y-0 right-0 flex items-center pr-3">
            <button class="btn btn-link" type="submit">
              <i class="fas fa-search fa-lg text-sky-500"></i>
            </button>
          </span>
        </label>
      </form>
    </div>
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
      // Trim the query
      if (this.query) {
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
      }
    },
  },
};
</script>

<style scoped>
.home-img {
  background-image: url("/assets/images/archive.jpg");
}
</style>
