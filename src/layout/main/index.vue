<template>
  <div
    id="search-header"
    class="h-96 bg-cover bg-gray-400 bg-center p-12 home-img"
  >
    <h4 class="flex justify-center m-5 text-3xl text-gray-600">
      OLA-HD - OCR Langzeitarchiv
    </h4>
    <div class="col-md-6 col-sm-8 mx-auto">
      <form @submit.prevent="submit" class="grid grid-cols-7">
        <label class="relative block col-start-3 col-span-3">
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
            placeholder="Suchen"
            v-model="query"
          />
          <span class="absolute inset-y-0 right-0 flex items-center">
            <button class="btn btn-link mr-4" type="submit">
              <i class="fas fa-search fa-lg text-sky-500"></i>
            </button>
            <MultiSelect
              id="dropdownCheckboxButton"
              v-model="selectedFilters"
              :options="[
                {name: 'Metadata Search', code: 'meta'},
                {name: 'Full Text Search', code: 'ft'},
                {name: 'GT-Search', code: 'gt'},
              ]"
              optionLabel="name"
              :maxSelectedLabels="0"
              :showToggleAll="false"
              :selectionLimit="null"
              :highlightOnSelect="true"
              selectedItemsLabel="Select"
              placeholder="Select"
              class="bg-sky-700 rounded-full w-34 rounded-l-lg px-2 h-10 text-green-200 border-r "
            />
          </span>
        </label>
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
      selectedFilters: [
        {name: 'Metadata Search', code: 'meta'}
      ],
    };
  },
  methods: {
    isFilterSelected(name) {
      return this[name] === "true";
    },
    submit() {
      // Trim the query
      this.query = (this.query || "").trim();

      this.$router
        .push({
          name: "search",
          query: {
            q: this.query,
            fulltextsearch: this.selectedFilters.some(element => element.code === 'ft'),
            metadatasearch: this.selectedFilters.some(element => element.code === 'meta'),
            isGT:this.selectedFilters.some(element => element.code === 'gt'),
          },
        })
        .catch(() => {}); // To ignore the Navigation Duplicated error
    },
  },
};
</script>

<style scoped>
.home-img {
  background-image: url("@/assets/archive.jpg");
}

:deep(.p-multiselect-label), :deep(.p-icon) {
  margin: -4px;
  color: white;
}
</style>
