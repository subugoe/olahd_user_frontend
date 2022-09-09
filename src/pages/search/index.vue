<template>
  <div class="container">
    <!-- Error message -->
    <div class="row my-3" v-if="error">
      <div class="col">
        <div
          class="alert alert-danger alert-dismissible fade show"
          role="alert"
        >
          <strong>Error!</strong> An error has occurred. Please try again.
          <button
            type="button"
            class="close"
            data-dismiss="alert"
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
      </div>
    </div>

    <div class="row" v-if="loading">
      <div class="col text-center">
        <img src="/assets/images/spin-1s-100px.gif" alt="Searching" />
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
            <select
              :value="maxResultsSize"
              @change="handlePageSizeChange($event)"
            >
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
          <Pagination
            :current="page"
            :total="total"
            @page-changed="current = $event"
          />
        </div>

        <!-- <div class="px-2 border rounded-md py-2 bg-gray-50">
          <search-group :item="data" placeholder="Search for creator..." />
        </div> -->
      </div>
    </template>
  </div>
</template>

<script>
import lzaApi from "@/services/lzaApi";
import SearchResult from "@/components/search/SearchResult";
import Pagination from "@/components/pagination/Pagination";
// import SearchGroup from "../../components/search/Facets.vue";

export default {
  data() {
    return {
      loading: true,
      error: null,
      paginationLowerBound: 1,
      scrolls: [""],
      time: 0,
      results: null,
      pageSizes: [10, 20, 30],
    };
  },
  computed: {
    maxResultsSize() {
      return Number(this.$route.query.perPageRecords || 10);
    },
    data() {
      if (!this.results) {
        return [];
      }
      if (!this.results.hits) {
        return [];
      }
      return this.results.hits;
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
      return this.results.totalHits;
    },
  },
  components: {
    Pagination,
    // SearchGroup,
    SearchResult,
  },
  methods: {
    buttonClass(number) {
      if (number !== this.page) {
        return "px-4 py-2 text-sky-500 border-sky-500 rounded-md border";
      }
      return "px-4 py-2 bg-sky-500 border-sky-500 rounded-md text-white";
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
      // Execute the search
      lzaApi
        .search(
          this.query,
          (this.page - 1) * this.maxResultsSize,
          this.maxResultsSize
        )
        .then((response) => {
          // Render the results
          this.results = response.data;
        })
        .catch((error) => {
          this.error = true;
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
  mounted() {
    this.search();
  },
  watch: {
    $route: "search",
  },
};
</script>

<style scoped>
</style>