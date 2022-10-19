<template>
  <div class="w-full relative">
    <label class="facet-label m-2">Filter: </label>

    <div class="m-2">
      <label class="mb-2 font-medium text-sky-900">Ground Truth: </label>
      <div
        v-for="(item, index) in groundTruthOption"
        :key="index"
        class="flex flex-row mb-2"
      >
        <input
          :id="item.label"
          type="radio"
          name="isGt"
          :checked="isGt === item.value"
          :value="item.value"
          @change="handleGroundTruthChange"
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
    isGt: {
      type: String,
      default: "",
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
    groundTruthOption() {
      return [
        {
          label: "Results from Ground Truth",
          value: "true",
        },
        {
          label: "No Results from Ground Truth",
          value: "false",
        },
        {
          label: "All Results",
          value: "all",
        },
      ];
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
    handleGroundTruthChange(e) {
      const value = e.target.value;

      if (value === "all") {
        this.onFacetChange("IsGt", []);
      } else {
        this.onFacetChange("IsGt", [{ value }]);
      }
    },
  },
};
</script>

<style scoped>
</style>
