<template>
  <div class="w-full relative">
    <label class="facet-label m-2 font-medium text-sky-900">Filter: </label>

    <div class="m-2">
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

    <div v-for="(facets, index) in data" :key="index" class="m-2 flex flex-col">
      <FacetField
        :facets="facets"
        :onFacetChange="onFacetChange"
        :selectedFacets="selectedFacets"
      />
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
    IsGt: {
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
          label: "GT-Search",
          name: "IsGt",
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
      this.onFilterChange(e.target.name, String(e.target.checked));
    },
  },
};
</script>

<style scoped>
</style>
