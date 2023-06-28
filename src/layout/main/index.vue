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
            <button
              id="dropdownCheckboxButton"
              data-dropdown-toggle="dropdownDefaultCheckbox"
              class="
                text-white
                border-r
                bg-sky-700
                rounded-full rounded-l-lg
                px-6
                py-2
                text-center
              "
              type="button"
            >
              Select
              <i class="fas fa-angle-down ml-3"></i>
            </button>

            <!-- Dropdown menu -->
            <div
              id="dropdownDefaultCheckbox"
              class="
                hidden
                z-10
                w-48
                bg-white
                rounded
                divide-y divide-gray-100
                shadow
              "
            >
              <ul class="p-3" aria-labelledby="dropdownCheckboxButton">
                <li>
                  <div
                    v-for="(item, index) of filters"
                    :key="index"
                    class="flex items-center mb-2"
                  >
                    <input
                      :id="item.label"
                      type="checkbox"
                      class="
                        w-4
                        h-4
                        text-sky-600
                        bg-gray-100
                        rounded
                        border-gray-300
                        focus:ring-2
                      "
                      :name="item.name"
                      :checked="isFilterSelected(item.name)"
                      :value="isFilterSelected(item.name)"
                      @change="handleFilterChange"
                    />
                    <label
                      :for="item.label"
                      class="ml-2 text-sm font-medium text-sky-900"
                      >{{ item.label }}</label
                    >
                  </div>
                </li>
              </ul>
            </div>
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
      filter: "",
      metadatasearch: "true",
      fulltextsearch: "false",
      isGT: "false",
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
            fulltextsearch: this.fulltextsearch,
            metadatasearch: this.metadatasearch,
            isGT: this.isGT,
          },
        })
        .catch(() => {}); // To ignore the Navigation Duplicated error
    },
    handleFilterChange(e) {
      this[e.target.name] = this[e.target.name] === "true" ? "false" : "true";
    },
  },
  computed: {
    filters() {
      return [
        {
          label: "Metadata Search",
          name: "metadatasearch",
        },
        {
          label: "Full Text Search",
          name: "fulltextsearch",
        },
        {
          label: "GT-Search",
          name: "isGT",
        },
      ];
    },
  },
  mounted() {
    // to fix flowbite drop-down checkbox render bug.
    const evt = new Event("DOMContentLoaded", {
      bubbles: true,
      cancelable: false,
    });
    document.dispatchEvent(evt);
  },
};
</script>

<style scoped>
.home-img {
  background-image: url("/public/assets/images/archive.jpg");
}
</style>
