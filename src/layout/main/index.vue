<template>
  <div
    id="search-header"
    class="h-96 bg-cover bg-gray-400 bg-center p-12 xl:home-img home-img-bright"
  >
    <h1 class="text-center m-5 text-4xl font-bold text-blue-600">
      OLA-HD
    </h1>
    <h2 class="text-center m-5 text-2xl" >OCR Long-Term Archive</h2>
    <div class="mx-auto">
      <form @submit.prevent="submit" class="float">
        <div class="grid grid-cols-7">
          <label class="relative block col-start-1 col-span-7 sm:col-start-2 sm:col-span-5 md:col-start-3 md:col-span-3">
            <input
              class="
                w-full
                border-3 border-sky-500
                drop-shadow-md
                rounded-full
                py-2
                pl-3
                pr-10
              "
              id="search-box"
              type="text"
              placeholder="Search..."
              v-model="query"
            />
            <span class="absolute inset-y-0 right-0 flex items-center">
              <button class="btn btn-link mr-4" type="submit">
                <i class="fas fa-search fa-lg text-sky-500"></i>
              </button>
            </span>
          </label>
        </div>
        <div class="grid grid-cols-2 divide-x divide-black mt-2">
          <div class="justify-self-end m-1">Search in</div>
          <div class="grid grid-cols-2 m-1" style="grid-template-columns: auto 1fr;">
            <input type="checkbox" v-model="metadatasearch" id="check-meta" class="m-1">
            <label for="check-meta">Metadata</label>
            <input type="checkbox" v-model="fulltextsearch" id="check-fulltext" class="m-1">
            <label for="check-fulltext">Full-Text</label>
            <input type="checkbox" v-model="gtsearch" id="check-gt" class="m-1">
            <label for="check-gt">Ground Truth</label>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import MultiSelect from 'primevue/multiselect';
export default {
  components: {
    MultiSelect: MultiSelect,
  },
  data() {
    return {
      query: this.$route.query["q"],
      filter: "",
      metadatasearch: "true",
      fulltextsearch: "false",
      gtsearch: "false",
    };
  },
  methods: {
    submit() {
      // Trim the query
      this.query = (this.query || "").trim();

      this.$router
        .push({
          name: "search",
          query: {
            q: this.query,
            fulltextsearch: this.fulltextsearch,
            metadatasearch: this.metadatasearch,
            isGT: this.gtsearch,
          },
        })
        .catch(() => {}); // To ignore the Navigation Duplicated error
    },
  },
};
</script>

<style scoped>


:deep(.p-multiselect-label), :deep(.p-icon) {
  margin: -4px;
  color: white;
}
</style>
