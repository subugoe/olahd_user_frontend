<template>
  <div class="grid grid-cols-4 border rounded-md px-3 py-3 bg-gray-50">
    <div>
      <span class="text-sm font-medium text-sky-900 dark:text-sky-300 m-1 px-1">Author:</span>
      <input type="text" class="w-56 px-1 m-1 border rounded-sm" :value="extraFilters['author']"
        @change="handleFilterChange($event.target.value, 'author')" />
    </div>
    <div>
      <span class="text-sm font-medium text-sky-900 dark:text-sky-300 m-1 px-1">Title:</span>
      <input type="text" class="w-56 px-1 m-1 border rounded-sm" :value="extraFilters['title']"
        @change="handleFilterChange($event.target.value, 'title')" />
    </div>
    <div>
      <span class="text-sm font-medium text-sky-900 dark:text-sky-300 m-1 px-1">Place:</span>
      <input type="text" class="w-56 px-1 m-1 border rounded-sm" :value="extraFilters['place']"
        @change="handleFilterChange($event.target.value, 'place')" />
    </div>
    <div>
      <span class="text-sm font-medium text-sky-900 dark:text-sky-300 m-1 px-1">Year:</span>
      <input type="text" class="w-56 px-1 m-1 border rounded-sm" :value="extraFilters['year']"
        @change="handleFilterChange($event.target.value, 'year')" />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      filters: {}
    }
  },
  props: {
    extraFilters: {
      type: Object,
      default: {},
    },
    onFilterChange: {
      type: Function,
      default: () => {},
    }
  },
  methods: {
    handleFilterChange(value, fieldname) {
      this.filters[fieldname] = value
      this.onFilterChange(this.filters);
    },
  }
}
</script>

<style scoped>
</style>
