<template>
  <div class="w-full relative">
    <label class="facet-label m-2">Filter: </label>

    <div class="m-2 flex flex-col">
      <div v-for="(facets, index) in data" :key="index">
        <FacetField
          :facets="facets"
          :onFacetChange="onFacetChange"
          :selectedFacets="selectedFacets"
        />
      </div>
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
    onFacetChange: {
      type: Function,
      default: () => {},
    },
    selectedFacets: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    data() {
      return this.facet;
    },
  },
  methods: {
    addTag(newTag) {
      const tag = {
        name: newTag,
        code: newTag.substring(0, 2) + Math.floor(Math.random() * 10000000),
      };
      this.options.push(tag);
      this.value.push(tag);
    },
  },
};
</script>

<style scoped>
</style>
