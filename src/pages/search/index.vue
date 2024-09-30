<template>
  <div class="container mt-2">
    <!-- Error message -->
    <div class="row my-3" v-if="error">
      <div class="col">
        <div class="alert alert-danger alert-dismissible fade show" role="alert">
          <strong>Error!</strong> An error has occurred. Please try again.
          <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
      </div>
    </div>

    <div class="row" v-if="loading">
      <div class="col text-center">
        <img src="@/assets/spin-1s-100px.gif" alt="Searching" />
      </div>
    </div>
    <div class="row mt-3" v-if="!hasResult && !loading">
      <div class="col">
        <div class="card">
          <div class="card-body">
            <h3 class="text-center">No Result Found!</h3>
          </div>
        </div>
      </div>
    </div>
    <button @click="showExtraFilters = !showExtraFilters"
      class="text-sm olahd-link-color hover:text-sky90"
    >
      Advanced Search
    </button>
    <extra-filters
      v-show="showExtraFilters"
      :extraFilters="extraFilters"
      :onFilterChange="handleExtraFilterChange"
    />
    <div class="flex justify-end">
      <button
        v-show="showExtraFilters"
        class="normal-blue-button"
        @click="search"
      >
        Search
      </button>
    </div>
    <template v-if="hasResult">
      <!-- Search result -->

      <div class="mb-3 grid grid-cols-5 gap-4">
        <div class="col-span-4 flex items-center justify-between my-6">
          <p>
            Showing {{ (this.page - 1) * this.maxResultsSize + 1 }} -
            {{ maxRecord }} of {{ total }} hits
          </p>

          <div>
            Items per Page:
            <select :value="maxResultsSize" @change="handlePageSizeChange($event)">
              <option v-for="size in pageSizes" :key="size" :value="size">
                {{ size }}
              </option>
            </select>
          </div>
        </div>
        <div class="space-y-4 col-span-4">
          <div v-for="(result, index) in data" :key="index">
            <div class="col">
              <SearchResult :item="result"></SearchResult>
            </div>
          </div>
          <Pagination :current="page" :total="total" />
        </div>

        <div class="border rounded-md bg-gray-50 flex flex-col">
          <search-group
            :facet="facets"
            :onFacetChange="handleFacetChange"
            :selectedFacets="$route.query"
            :isGT="isGT"
            :onFilterChange="onFilterChange"
            :fulltextsearch="fulltextsearch"
            :metadatasearch="metadatasearch"
          />
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import lzaApi from "@/services/lzaApi";
import Pagination from "@/components/pagination/Pagination.vue";
import SearchGroup from "@/components/search/SearchGroup.vue";
import ExtraFilters from "@/components/search/ExtraFilters.vue";
import SearchResult from "@/components/search/SearchResult.vue";
import { mystore } from '@/store';
import { mapWritableState } from 'pinia';

export default {
  components: {
    Pagination,
    SearchResult,
    SearchGroup,
    ExtraFilters,
  },
  data() {
    return {
      currentFacets: {},
      error: null,
      initialFacets: [],
      loading: true,
      pageSizes: [10, 20, 30],
      paginationLowerBound: 1,
      results: null,
      scrolls: [""],
      time: 0,
    };
  },
  computed: {
    ...mapWritableState(mystore, ['showExtraFilters']),
    maxResultsSize() {
      return Number(this.$route.query.perPageRecords || 10);
    },
    data() {
      if (!this.results) {
        return [];
      }
      if (!this.results.hitlist) {
        return [];
      }
      return this.results.hitlist;
    },
    facets() {
      if (!this.results) {
        return this.initialFacets;
      }
      if (!this.results.hitlist) {
        return this.initialFacets;
      }
      return this.initialFacets.map((el) => ({
        ...el,
        values: el.values.map((val) => ({
          ...val,
          occurences: this.currentFacets[el.name][val.value] ? this.currentFacets[el.name][val.value][0] : 0,
          limited: this.currentFacets[el.name][val.value] ? this.currentFacets[el.name][val.value][1] : false,
        })),
      }));
    },
    maxRecord() {
      const limit = (this.page - 1) * this.maxResultsSize + this.maxResultsSize;

      if (this.total < limit) {
        return this.total;
      }
      return limit;
    },
    hasResult() {
      return this.results;
    },
    isGT() {
      return this.$route.query.isGT === "true";
    },
    fulltextsearch() {
      return this.$route.query.fulltextsearch === "true";
    },
    metadatasearch() {
      return this.$route.query.metadatasearch
        ? this.$route.query.metadatasearch === "true"
        : true;
    },
    query() {
      return this.$route.query.q;
    },
    page() {
      return Number(this.$route.query.page || 1);
    },
    total() {
      if (!this.results) {
        return 0;
      }
      return this.results.hits;
    },
    extraFilters() {
      return {
        "author": this.$route.query.author || "",
        "title": this.$route.query.title || "",
        "place": this.$route.query.place || "",
        "year": this.$route.query.year || "",
      }
    },
  },
  methods: {
    onFilterChange(name, value) {
      const query = {
        ...this.$route.query,
        [name]: value,
      };
      if (JSON.stringify(query) === JSON.stringify(this.$route.query)) {
        return;
      }
      this.$router.push({
        name: "search",
        query: {
          ...query,
          page: 1,
        }
      });
    },
    handleExtraFilterChange(extraFilters) {
      for (const [key, value] of Object.entries(extraFilters)) {
        this.$route.query[key] = value
        this.extraFilters[key] = value
      }
    },
    handleFacetChange(name, selectedFacets) {
      const query = { ...this.$route.query };
      if (!selectedFacets.length) {
        delete query[name];
      } else {
        query[name] = selectedFacets.map((el) => el.value).join("_-_");
      }

      if (JSON.stringify(query) === JSON.stringify(this.$route.query)) {
        return;
      }
      this.$router.push({
        name: "search",
        query: {
          ...JSON.parse(JSON.stringify(query)),
          page: 1
        }
      });
    },
    handlePageSizeChange(event) {
      this.$router.push({
        name: "search",
        query: {
          ...this.$route.query,
          perPageRecords: event.target.value,
        },
      });
    },
    search() {
      // Reset the state
      this.loading = true;
      this.error = null;
      this.results = {};
      const { q, page, perPageRecords = "10", ...rest } = this.$route.query;

      let facetQuery = [];
      const nonFacetFields = [
        "isGT", "fulltextsearch", "metadatasearch", "author", "title", "place", "year"
      ];

      Object.entries(rest).forEach(([field, values]) => {
        if (!nonFacetFields.includes(field)) {
          values.split("_-_").forEach((value) => {
            const valEncoded = encodeURIComponent(value);
            facetQuery.push(`field=${field}&value=${valEncoded}`);
          });
        }
      });
      // Execute the search
      lzaApi
        .search(
          {
            fulltextsearch: this.fulltextsearch,
            metadatasearch: this.metadatasearch,
            isGT: this.isGT,
            searchterm: this.query,
            limit: this.maxResultsSize,
            offset: (this.page - 1) * this.maxResultsSize,
            author: this.extraFilters['author'] || "",
            title: this.extraFilters['title'] || "",
            place: this.extraFilters['place'] || "",
            year: this.extraFilters['year'] || "",
          },
          facetQuery.join("&")
        )
        .then((response) => {
          // Render the results
          this.results = response.data;
          this.currentFacets = response.data.facets.reduce((prev, curr) => {
            if (!prev[curr.name]) {
              prev[curr.name] = {};
            }
            curr.values.forEach((el) => {
              prev[curr.name][el.value] = [el.occurences, el.limited];
            });
            return prev;
          }, {});
          this.fetchFacets();
        })
        .catch((error) => {
          this.error = true;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    async fetchFacets() {
      const { q } = this.$route.query;

      try {
        const response = await lzaApi.search(
          {
            fulltextsearch: this.fulltextsearch,
            metadatasearch: this.metadatasearch,
            isGT: this.isGT,
            searchterm: q,
            author: this.extraFilters['author'] || "",
            title: this.extraFilters['title'] || "",
            place: this.extraFilters['place'] || "",
            year: this.extraFilters['year'] || "",
            limit: this.maxResultsSize,
            offset: 0,
          },
          ""
        );
        this.initialFacets = response.data.facets;
      } catch (err) {
        this.error = true;
      }
    },
  },
  mounted() {
    this.search();
  },
  /*watch: {
    $route: "search",
  },*/
};
</script>

<style scoped>
</style>
