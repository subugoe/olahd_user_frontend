<template>
  <section
    class="flex flex-wrap justify-between bg-white rounded-lg border border-gray-200 px-6 py-3 text-gray-700 font-montserrat"
  >
    <ul class="flex items-center">
      <li class="pr-3 sm:pr-4" v-if="hasPrev()">
        <a href="#" @click.prevent="changePage(prevPage)">
          <i class="page-item fas fa-angle-left"></i>
        </a>
      </li>
      <li class="pr-3 sm:pr-4" v-if="hasFirst()">
        <a href="#" @click.prevent="changePage(1)">
          <span class="page-item font-light"> 1 </span>
        </a>
      </li>
      <li class="pr-3 sm:pr-4" v-if="hasFirst() && this.rangeStart != 2">...</li>
      <li class="pr-3 sm:pr-4" v-for="page in pages" :key="page">
        <a href="#" @click.prevent="changePage(page)">
          <span class="page-item font-light" :class="{ 'current-item': current == page }">{{
            page
          }}</span>
        </a>
      </li>
      <li class="pr-3 sm:pr-4" v-if="hasLast() && this.rangeEnd != totalPages - 1">...</li>
      <li class="pr-3 sm:pr-4" v-if="hasLast()">
        <a href="#" @click.prevent="changePage(totalPages)">
          <span class="page-item font-light">{{ totalPages }}</span>
        </a>
      </li>
      <li class="pr-3 sm:pr-4" v-if="hasNext()">
        <a href="#" @click.prevent="changePage(nextPage)">
          <i class="page-item fas fa-angle-right"></i>
        </a>
      </li>
    </ul>

    <div class="flex items-center">
      <div class="pr-2 text-gray-400 font-medium">
        <label id="text-before-input" for="go-to-page">
          {{ textBeforeInput }}
        </label>
      </div>
      <input
        id="go-to-page"
        v-model.number="input"
        @keyup.enter="changePage(input)"
        class="p-1 olahd-border-color text-sm text-black w-14 bg-white rounded-md focus:outline-none focus:bg-white focus:text-gray-900 border focus:ring"
        type="text"
      />
      <div
        @click.prevent="changePage(input)"
        class="flex items-center pl-4 font-medium cursor-pointer"
      >
        <span id="text-after-input" class="mr-1 page-item">
          {{ textAfterInput }}
        </span>
        <i class="fas fa-angle-right items-center text-custom-blue"></i>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "Pagination",
  props: {
    current: {
      type: Number,
      default: 1,
    },
    total: {
      type: Number,
      default: 0,
    },
    pageRange: {
      type: Number,
      default: 2,
    },
    textBeforeInput: {
      type: String,
      default: "Go to page",
    },
    textAfterInput: {
      type: String,
      default: "Go",
    },
  },
  data() {
    return {
      input: "",
    };
  },
  methods: {
    changePage: function (page) {
      this.$router.push({
        name: "search",
        query: {
          ...this.$route.query,
          page,
        },
      });
    },
    hasFirst: function () {
      return this.rangeStart !== 1;
    },
    hasLast: function () {
      return this.rangeEnd < this.totalPages;
    },
    hasNext: function () {
      return this.current < this.totalPages;
    },
    hasPrev: function () {
      return this.current > 1;
    },
  },
  computed: {
    maxRecord() {
      const limit = (this.current - 1) * this.perPage + this.perPage;

      if (this.total < limit) {
        return this.total;
      }
      return limit;
    },
    pages: function () {
      var pages = [];
      for (var i = this.rangeStart; i <= this.rangeEnd; i++) {
        pages.push(i);
      }
      return pages;
    },
    perPage() {
      return Number(this.$route.query.perPageRecords || 10);
    },
    rangeStart: function () {
      var start = this.current - this.pageRange;
      return start > 0 ? start : 1;
    },
    rangeEnd: function () {
      var end = this.current + this.pageRange;
      return end < this.totalPages ? end : this.totalPages;
    },
    totalPages: function () {
      return Math.ceil(this.total / this.perPage);
    },
    nextPage: function () {
      return this.current + 1;
    },
    prevPage: function () {
      return this.current - 1;
    },
  },
};
</script>

<style scoped>
.page-item {
  @apply text-custom-blue hover:text-blue-900 hover:underline;
}
.current-item {
  @apply font-bold text-lg;
}
</style>
