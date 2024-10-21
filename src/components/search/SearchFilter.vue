<template>
  <div class="w-full relative">
    <div class="m-2">
      <label
        class="mt-2 mb-2 inline-block w-full font-medium text-sky-900 rounded dark:text-sky-300"
        for="searchoptions">
        Search Options:
      </label>
      <hr style="border: 1px solid lightgray" />
    </div>
    <div class="mb-6 m-2" id="searchotpions">
      <div
        v-for="(item, index) in filters"
        :key="index"
        class="m-2 font-medium flex flex-row"
      >
        <input
          :id="item.label"
          type="checkbox"
          :name="item.name"
          :checked="isFilterSelected(item.name)"
          :value="isFilterSelected(item.name)"
          @change="handleFilterChange"
          class="mr-2"
        />
        <label
          :for="item.label"
          class="w-full font-medium text-sky-900 rounded dark:text-sky-300"
        >
          {{ item.label }}
        </label>
      </div>
    </div>
    <div class="m-2">
      <label
        class="mt-2 mb-2 inline-block w-full font-medium text-sky-900 rounded dark:text-sky-300"
        for="textsearch">
        Search in Fields:
      </label>
      <hr style="border: 1px solid lightgray" />
    </div>
    <div class="pr-4" id="textsearch">
      <input type="text" class="w-full px-1 m-2 border rounded" name="author" :value="author"
        @change="handleFilterChange" label="Search for Author" placeholder="Author" />
      <input type="text" class="w-full px-1 m-2 border rounded" name="title" :value="title"
        @change="handleFilterChange" label="Search for Title" placeholder="Title" />
      <input type="text" class="w-full px-1 m-2 border rounded" name="place" :value="place"
        @change="handleFilterChange" label="Search for Place" placeholder="Place" />
      <input type="text" class="w-full px-1 m-2 border rounded" name="year" :value="year"
        @change="handleFilterChange" label="Search for Year" placeholder="Year" />
    </div>

    <div v-for="(facets, index) in data" :key="index" class="m-2 flex flex-col">
      <FacetField :facets="facets" :onFacetChange="onFacetChange"
        :selectedFacets="selectedFacets" />
    </div>
  </div>
</template>

<script>
import FacetField from "./FacetField.vue";
export default {
  name: "Facet",
  components: {
    FacetField,
  },
  data() {
    return {
      show: false,
      inputData: {},
      showOptions: false,
    };
  },
  props: {
    facet: {
      type: Array,
      default: () => [],
    },
    isGT: {
      type: Boolean,
      default: false,
    },
    metadatasearch: {
      type: Boolean,
      default: true,
    },
    fulltextsearch: {
      type: Boolean,
      default: false,
    },
    author: {
      type: String,
      default: ""
    },
    title: {
      type: String,
      default: ""
    },
    place: {
      type: String,
      default: ""
    },
    year: {
      type: String,
      default: ""
    },
    onFacetChange: {
      type: Function,
      default: () => {},
    },
    selectedFacets: {
      type: Object,
      default: () => {},
    },
    onFilterChange: {
      type: Function,
      default: () => {},
    },
  },
  computed: {
    data() {
      return this.facet;
    },
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
          label: "Ground Truth (GT) Search",
          name: "isGT",
        },
      ];
    },
  },
  methods: {
    isFilterSelected(name) {
      return this[name];
    },
    addTag(newTag) {
      const tag = {
        name: newTag,
        code: newTag.substring(0, 2) + Math.floor(Math.random() * 10000000),
      };
      this.options.push(tag);
      this.value.push(tag);
    },
    handleFilterChange(e) {
      if (e.target.type === "checkbox") {
        this.onFilterChange(e.target.name, String(e.target.checked));
      } else {
        this.onFilterChange(e.target.name, String(e.target.value));
      }
    },
  },
};
</script>

<style scoped>
</style>
