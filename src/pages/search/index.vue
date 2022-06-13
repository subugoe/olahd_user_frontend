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
      <div class="mb-3 grid grid-cols-5">
        <div class="space-y-4 col-span-4">
          <div v-for="(result, index) in data" :key="index">
            <div class="col">
              <SearchResult :item="result"></SearchResult>
            </div>
          </div>

          <div class="flex items-center justify-between col-span-4">
            <p>
              Showing {{ (this.page - 1) * this.perPageData + 1 }} -
              {{ maxRecord }} of {{ total }} hits
            </p>
            <div class="space-x-3">
              <button
                class="
                  px-4
                  py-2
                  bg-sky-600
                  rounded-md
                  text-white
                  font-semibold
                  hover:bg-sky-400
                "
                @click="handlePrevious"
                :disabled="page === 1"
              >
                Previous
              </button>
              <button
                v-for="number in pagintation"
                :key="number"
                :disabled="number === page"
                :class="buttonClass(number)"
                @click="handlePageChange(number)"
              >
                {{ number }}
              </button>
              <button
                class="
                  px-4
                  py-2
                  bg-sky-600
                  rounded-md
                  text-white
                  font-semibold
                  hover:bg-sky-400
                "
                @click="handleNext"
                :disabled="isLastPage"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import lzaApi from "@/services/lzaApi";
import SearchResult from "@/components/search/SearchResult";

export default {
  data() {
    return {
      loading: true,
      error: null,
      maxResultsSize: 10,
      paginationLowerBound: 1,
      scrolls: [""],
      time: 0,
      results: null,
    };
  },
  computed: {
    data() {
      if (!this.results) {
        return [];
      }
      if (!this.results.hits) {
        return [];
      }
      return this.results.hits.hits;
    },
    maxRecord() {
      const limit = (this.page - 1) * this.perPageData + this.perPageData;
      if (this.total < limit) {
        return this.total;
      }
      return limit;
    },
    pagintation() {
      const count = Math.ceil(this.total / this.perPageData);
      const current = this.page;
      var shownPages = 3;
      var result = [];
      if (current > count - shownPages) {
        result.push(count - 2, count - 1, count);
      } else {
        result.push(current, current + 1, current + 2);
      }
      return result;
    },
    perPageData() {
      return 10;
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
      if (!this.results.hits) {
        return 0;
      }
      return this.results.hits.total;
    },
    isLastPage() {
      return (
        (this.page - 1) * this.perPageData + this.perPageData >= this.total
      );
    },
  },
  components: {
    SearchResult,
  },
  methods: {
    buttonClass(number) {
      if (number !== this.page) {
        return "px-4 py-2 text-sky-500 border-sky-500 rounded-md border";
      }
      return "px-4 py-2 bg-sky-500 border-sky-500 rounded-md text-white";
    },
    handlePageChange(page) {
      this.$router.push({
        name: "search",
        query: {
          q: this.query,
          page,
        },
      });
    },
    handlePrevious() {
      this.$router.push({
        name: "search",
        query: {
          q: this.query,
          page: this.page - 1,
        },
      });
    },
    handleNext() {
      this.$router.push({
        name: "search",
        query: {
          q: this.query,
          page: this.page + 1,
        },
      });
    },
    search() {
      // Reset the state
      this.loading = true;
      this.error = null;
      this.results = {};
      // Start the timer
      let start = performance.now();
      // Execute the search
      lzaApi
        .search(
          this.query,
          (this.page - 1) * this.perPageData,
          this.perPageData
        )
        .then((response) => {
          // Render the results
          this.results = response.data;
        })
        .catch((error) => {
          this.error = true;
          console.log(error);
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