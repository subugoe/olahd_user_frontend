<template>
  <div class="mt-4">
    <label
      class="
        mt-2
        mb-2
        inline-block
        w-full
        font-medium
        text-sky-900
        rounded
        dark:text-sky-300
      "
      >{{ to_facet_label(facets) }}:
    </label>
    <hr style="border: 1px solid lightgray" />
    <div class="mt-1 search-results">
      <div
        v-for="(facet, index) in results"
        :key="index"
        class="mt-2 cursor-pointer hover:bg-gray-200 cursor-pointer"
        @click="toggleFacetSelect(facet, selectedFacetsMapping[facet.value])"
      >
        <div
          class="
            flex
            items-center
            p-2
            rounded
            overflow-y-scroll overflow-hidden
            hover:bg-gray-100
            dark:hover:bg-gray-600
          "
        >
          <input
            type="checkbox"
            :checked="selectedFacetsMapping[facet.value]"
            class="
              w-4
              h-4
              text-sky-600
              bg-gray-100
              rounded
              border-gray-300
              focus:ring-sky-500
              dark:focus:ring-sky-600 dark:ring-offset-gray-700
              focus:ring-2
              dark:bg-gray-600 dark:border-gray-500
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
              dark:text-sky-300
            "
          >{{ facet.value }}
            <span>{{ facet.limited ? "> " : "" }} {{ facet.occurences }} </span>
          </label>
        </div>
      </div>
    </div>
    <button
      v-if="facets.values.length > 5"
      class="outline-none border-none"
      @click="toggleExpanded"
    >
      <span class="text-sky-900 text-sm">
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
