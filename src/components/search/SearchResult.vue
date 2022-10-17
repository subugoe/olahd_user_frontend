<template>
  <div class="border rounded-md px-3 py-3 bg-gray-50 search-item">
    <router-link
      :to="{
        name: 'search-detail',
        query: {
          id: itemId,
        },
      }"
      class="search-item-link"
    >
      <h5>{{ title }}</h5>
    </router-link>
    <hr class="mt-3 mb-2" />
    <div class="space-y-2">
      <div class="flex items-center flex-1">
        <h5 class="text-sm text-gray-700 w-36">Subtitle</h5>
        <p class="flex-1 text-sm">{{ subtitle }}</p>
      </div>
      <div class="flex items-center flex-1">
        <h5 class="text-sm text-gray-700 w-36">Publisher</h5>
        <p class="flex-1 text-sm">{{ publisher }}</p>
      </div>
      <div class="flex items-center flex-1">
        <h5 class="text-sm text-gray-700 w-36">Creator</h5>
        <p class="flex-1 text-sm">{{ creator }}</p>
      </div>
      <div class="flex items-center flex-1">
        <h5 class="text-sm text-gray-700 w-36">Published Place</h5>
        <p class="flex-1 text-sm">{{ placeOfPublish }}</p>
      </div>
      <div class="flex items-center flex-1">
        <h5 class="text-sm text-gray-700 w-36">Published Year</h5>
        <p class="flex-1 text-sm">{{ yearPublish }}</p>
      </div>
      <div class="flex items-center flex-1">
        <h5 class="text-sm text-gray-700 w-36">PID</h5>
        <p class="flex-1 text-sm">{{ itemId }}</p>
      </div>
      <div class="flex items-center flex-1">
        <h5 class="text-sm text-gray-700 w-36">Ground Truth</h5>
        <p class="flex-1 text-sm">{{ isGT }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";

export default {
  props: {
    item: {
      type: Object,
      default: () => {},
    },
  },
  filters: {
    formatDate(value) {
      if (value) {
        return moment(String(value)).format("DD/MM/YYYY");
      }
    },
  },
  computed: {
    title() {
      return this.item.title;
    },
    itemId() {
      return this.item.PID;
    },
    publisher() {
      return this.item.publisher || "N/A";
    },
    creator() {
      return this.item.creator || "N/A";
    },
    yearPublish() {
      return this.item.yearOfPublish || "N/A";
    },
    placeOfPublish() {
      return this.item.placeOfPublish || "N/A";
    },
    subtitle() {
      return this.item.subtitle || "N/A";
    },
    isGT() {
      return this.item.isGT || "N/A";
    },
    dateCreated() {
      return this.item.reindexedat;
    },
  },
};
</script>

