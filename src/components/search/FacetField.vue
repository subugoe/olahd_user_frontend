<template>
  <hr class="filter-hr" />
  <div class="">
    <label
      class="
        mt-2.5
        mb-1
        inline-block
        w-full
        font-medium
        rounded
      "
      >{{ to_facet_label(facets) }}:
    </label>
    <div class="mt-1 search-results">
      <div
        v-for="(facet, index) in results"
        :key="index"
        class="cursor-pointer hover:bg-gray-200 cursor-pointer"
        @click="toggleFacetSelect(facet, selectedFacetsMapping[facet.value])"
      >
        <div
          class="
            flex
            p-1
            hover:bg-gray-100
            items-start
          "
        >
          <input
            type="checkbox"
            :checked="selectedFacetsMapping[facet.value]"
            class="
              mt-0.5
              w-4
              h-4
              text-sky-600
              bg-gray-100
              rounded
              border-gray-300
              focus:ring-sky-500
              focus:ring-2
            "
          />
          <label
            class="
              ml-2
              w-full
              text-sm
              font-medium
              text-sky-900
              rounded
              justify-between
              flex
            "
          >{{ facet.value }}
            <span class="ml-2">{{ facet.limited ? "> " : "" }} {{ facet.occurences }} </span>
          </label>
        </div>
      </div>
    </div>
    <button
      v-if="facets.values.length > 5"
      class="outline-none border-none ml-1 mt-1.5"
      @click="toggleExpanded"
    >
      <span class="text-sm">
        {{ this.isExpanded ? "Show less" : "Show more" }}
      </span>
    </button>
  </div>
</template>

<script>
export default {
  props: {
    facets: {
      type: Object,
      default: () => ({}),
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
  data() {
    return {
      isExpanded: false,
      value: [],
      labelsMap: {
        "Titles": "Titles",
        "Creators": "Authors",
        "Place": "Place of Publication",
        "Publish Year": "Year of Publication",
      }
    };
  },
  computed: {
    results() {
      const MAX_VALUE = this.isExpanded ? Infinity : 5;
      return this.facets.values.slice(0, MAX_VALUE);
    },
    selectedFacetsMapping() {
      return this.value.reduce((prev, curr) => {
        prev[curr.value] = curr.value;
        return prev;
      }, {});
    },
  },
  methods: {
    toggleExpanded() {
      this.isExpanded = !this.isExpanded;
    },
    toggleFacetSelect(facet, isSelected) {
      if (isSelected) {
        this.value = this.value.filter((el) => el.value !== facet.value);
      } else {
        this.value = [...this.value, facet];
      }
      this.onFacetChange(this.facets.name, this.value);
    },
    to_facet_label(facet) {
      return this.labelsMap[facet.name] || facet.name
    }
  },
  mounted() {
    const currentFacets = (this.selectedFacets[this.facets.name] || "")
      .split("_-_")
      .filter((el) => el);
    const valueMapping = this.value.reduce((prev, curr) => {
      prev[curr.value] = [curr.occurences, curr.limited];
      return prev;
    }, {});

    this.value = currentFacets.map((el) => ({
      value: el,
      occurences: valueMapping[el] ? valueMapping[el][0] : 0,
      limited: valueMapping[el] ? valueMapping[el][1] : false,
    }));
  },
};
</script>

<style lang="postcss">
/*.custom-muliselect .multiselect__tag {
  @apply bg-sky-600;
}
.custom-muliselect .multiselect__option--highlight {
  @apply bg-sky-600;
}*/
</style>
