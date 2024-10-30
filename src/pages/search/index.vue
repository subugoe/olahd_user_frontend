<template>
  <div class="container mt-2 lg:px-10">
    <Dialog
      header="Filter"
      :append-to-body="true"
      v-model:visible="showFilterDialog"
      modal
      dismissableMask
      :pt="{
        title: {
          class: ['text-lg', 'font-medium'],
        },
      }"
      @hide="onSearchdialogClose"
    >
      <SearchFilter
        :facet="facets"
        :onFacetChange="handleFilterDialogFacetChange"
        :selectedFacets="$route.query"
        :isGT="isGT"
        :onFilterChange="onFilterDialogChange"
        :fulltextsearch="fulltextsearch"
        :metadatasearch="metadatasearch"
        :author="author"
        :title="title"
        :year="year"
        :place="place"
        class="max-w-[90vw]"
      />
    </Dialog>
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
    <SearchInput class="m-1 my-4 sm:w-4/5 sm:pr-5" />
    <button v-if="true" class="filter-button m-1" @click="showFilterDialog = true">Filter</button>
    <template v-if="hasResult">
      <!-- Search result -->

      <div class="flex mb-5">
        <div :class="!isMobile ? 'basis-4/5' : ''">
          <div class="flex items-center justify-between my-6">
            <p class="mx-2">
              Showing {{ (this.page - 1) * this.maxResultsSize + 1 }} - {{ maxRecord }} of
              {{ total }} hits
            </p>

            <div class="mx-6">
              Items per Page:
              <select :value="maxResultsSize" @change="handlePageSizeChange($event)">
                <option v-for="size in pageSizes" :key="size" :value="size">
                  {{ size }}
                </option>
              </select>
            </div>
          </div>
          <div class="sm:mr-2">
            <div v-for="(result, index) in data" :key="index">
              <div class="m-1 sm:m-2">
                <SearchResult :item="result"></SearchResult>
              </div>
            </div>
            <Pagination :current="page" :total="total" class="mx-2" />
          </div>
        </div>
        <div
          :class="!isMobile ? 'basis-1/5' : ''"
          class="border rounded-md bg-gray-50 pt-2"
          style="margin-top: 71px"
          v-if="!isMobile"
        >
          <SearchFilter
            :facet="facets"
            :onFacetChange="handleFacetChange"
            :selectedFacets="$route.query"
            :isGT="isGT"
            :onFilterChange="onFilterChange"
            :fulltextsearch="fulltextsearch"
            :metadatasearch="metadatasearch"
            :author="author"
            :title="title"
            :year="year"
            :place="place"
          />
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import lzaApi from "@/services/lzaApi";
import Pagination from "@/components/pagination/Pagination.vue";
import SearchFilter from "@/components/search/SearchFilter.vue";
import SearchResult from "@/components/search/SearchResult.vue";
import SearchInput from "../../components/search/SearchInput.vue";

import Dialog from "primevue/dialog";

import { mystore } from "@/store";
import { mapState } from "pinia";

export default {
  components: {
    Pagination,
    SearchResult,
    SearchFilter,
    Dialog,
    SearchInput,
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
      showFilterDialog: false,
      // When users select something in the filter-dialog, this is temporarily stored here
      filterDialogValues: {
        facets: {},
      },
    };
  },
  computed: {
    ...mapState(mystore, ["isMobile"]),
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
          occurences: this.currentFacets[el.name][val.value]
            ? this.currentFacets[el.name][val.value][0]
            : 0,
          limited: this.currentFacets[el.name][val.value]
            ? this.currentFacets[el.name][val.value][1]
            : false,
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
      return this.$route.query.metadatasearch ? this.$route.query.metadatasearch === "true" : true;
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
    author() {
      return this.$route.query.author;
    },
    title() {
      return this.$route.query.title;
    },
    place() {
      return this.$route.query.place;
    },
    year() {
      return this.$route.query.year;
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
        },
      });
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
          page: 1,
        },
      });
    },

    /**
     * Handle a change in the filter-dialog (onMobile)
     *
     * When a checkbox or textfield of a filter value is changed in the dialog it is stored in the
     * temporary storage filterDialogValue. This is used when executing the search on dialog close
     */
    onFilterDialogChange(name, value) {
      this.filterDialogValues[name] = value;
    },

    /**
     * Handle a facet change in the filter-dialog (onMobile)
     */
    handleFilterDialogFacetChange(name, selectedFacets) {
      this.filterDialogValues["facets"][name] = selectedFacets;
    },

    /**
     * Search on filter-dialog close
     *
     * The dialog was implemented after the search was implemented. Therefore what was done
     * directly on facet/filter select is done on dialog close. The code was simply transfered from
     * the facet and filter change handler (the one without the dialog) and put together
     */
    onSearchdialogClose() {
      const query = {
        ...this.$route.query,
      };

      for (const [key, value] of Object.entries(this.filterDialogValues)) {
        if (key == "facets") {
          for (const [fkey, fvalue] of Object.entries(value)) {
            console.log(`fvalue: ${fvalue}`);
            if (!fvalue.length) {
              delete query[fkey];
            } else {
              query[fkey] = fvalue.map((el) => el.value).join("_-_");
            }
          }
        } else {
          query[key] = value;
        }
      }

      if (JSON.stringify(query) === JSON.stringify(this.$route.query)) {
        return;
      }
      this.$router.push({
        name: "search",
        query: {
          ...query,
          page: 1,
        },
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
        "isGT",
        "fulltextsearch",
        "metadatasearch",
        "author",
        "title",
        "place",
        "year",
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
            author: this.author,
            title: this.title,
            place: this.place,
            year: this.year,
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
            author: this.author,
            title: this.title,
            place: this.place,
            year: this.year,
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
<style scoped></style>
