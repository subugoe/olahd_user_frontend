<template>
  <div class="">
    <button @click="hidden = !hidden" class="text-sm search-item-link text-sky-600 hover:text-sky90">
      Advanced Search Fields
    </button>

    <div v-if="!hidden" class="grid grid-cols-4 border rounded-md px-3 py-3 bg-gray-50 search-item">
      <div>
        <span class="text-sm font-medium text-sky-900 dark:text-sky-300 m-1 px-1">Author:</span>
        <input type="text" class="w-56 px-1 m-1 border" v-model="author"
          @input="$emit('extraFilter', 'author', $event.target.value)" />
      </div>
      <div>
        <span class="text-sm font-medium text-sky-900 dark:text-sky-300 m-1 px-1">Title:</span>
        <input type="text" class="w-56 px-1 m-1 border" v-model="title"
          @input="$emit('extraFilter', 'title', $event.target.value)" />
      </div>
      <div>
        <span class="text-sm font-medium text-sky-900 dark:text-sky-300 m-1 px-1">Place:</span>
        <input type="text" class="w-56 px-1 m-1 border" v-model="place"
          @input="$emit('extraFilter', 'place', $event.target.value)" />
      </div>
      <div>
        <span class="text-sm font-medium text-sky-900 dark:text-sky-300 m-1 px-1">Year:</span>
        <input type="text" class="w-56 px-1 m-1 border" v-model="year"
          @input="$emit('extraFilter', 'year', $event.target.value)" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  emits: ["extraFilter"],
  data() {
    return {
      hidden: true,
      author: "",
      title: "",
      place: "",
      year: "",
    }
  },
  methods: {
    test() {
      console.log("test");
      console.log("hidden: " + this.hidden)
    }

  }
}
</script>

<style scoped>
</style>
