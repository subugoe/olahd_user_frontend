<template>
  <section
    class="
      flex
      justify-between
      bg-white
      rounded-lg
      border border-gray-200
      px-6
      py-3
      text-gray-700
      font-montserrat
    "
  >
    <ul class="flex items-center">
      <li class="pr-4" v-if="hasPrev()">
        <a href="#" @click.prevent="changePage(prevPage)">
          <div
            class="
              flex
              items-center
              justify-center
              hover:bg-gray-200
              rounded-md
              transform
              rotate-45
              h-6
              w-6
            "
          >
            <div class="transform -rotate-45">
              <svg
                class="h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </div>
          </div>
        </a>
      </li>
      <li class="pr-4" v-if="hasFirst()">
        <a href="#" @click.prevent="changePage(1)">
          <div
            class="
              flex
              hover:bg-gray-200
              rounded-md
              transform
              rotate-45
              h-6
              w-6
              items-center
              justify-center
            "
          >
            <span class="transform -rotate-45"> 1 </span>
          </div>
        </a>
      </li>
      <li class="pr-4" v-if="hasFirst()">...</li>
      <li class="pr-4" v-for="page in pages" :key="page">
        <a href="#" @click.prevent="changePage(page)">
          <div
            :class="{
              'bg-gradient-to-r from-sky-200 to-sky-600': current == page,
            }"
            class="
              flex
              hover:bg-gray-200
              rounded-md
              transform
              rotate-45
              h-6
              w-6
              items-center
              justify-center
            "
          >
            <span class="transform -rotate-45">{{ page }}</span>
          </div>
        </a>
      </li>
      <li class="pr-4" v-if="hasLast()">...</li>
      <li class="pr-4" v-if="hasLast()">
        <a href="#" @click.prevent="changePage(totalPages)">
          <div
            class="
              flex
              hover:bg-gray-200
              rounded-md
              transform
              rotate-45
              h-6
              w-6
              items-center
              justify-center
            "
          >
            <span class="transform -rotate-45">
              {{ totalPages }}
            </span>
          </div>
        </a>
      </li>
      <li class="pr-4" v-if="hasNext()">
        <a href="#" @click.prevent="changePage(nextPage)">
          <div
            class="
              flex
              items-center
              justify-center
              hover:bg-gray-200
              rounded-md
              transform
              rotate-45
              h-6
              w-6
            "
          >
            <div class="transform -rotate-45">
              <svg
                class="h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>
        </a>
      </li>
    </ul>

    <div class="flex items-center">
      <div class="pr-2 text-gray-400 font-medium">
        <span id="text-before-input">
          {{ textBeforeInput }}
        </span>
      </div>
      <div class="w-14 rounded-md border border-indigo-400 px-1 py-1">
        <input
          v-model.number="input"
          @keyup.enter="changePage(input)"
          class="w-12 focus:outline-none px-2"
          type="text"
        />
      </div>
      <div
        @click.prevent="changePage(input)"
        class="flex items-center pl-4 font-medium cursor-pointer"
      >
        <span id="text-after-input">
          {{ textAfterInput }}
        </span>
        <svg
          class="h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 5l7 7-7 7"
          />
        </svg>
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
</style>