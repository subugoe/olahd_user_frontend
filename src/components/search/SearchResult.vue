<template>
  <div class="border rounded-md px-3 py-3 bg-gray-50 search-item">
    <router-link
      :to="{
        name: 'search-detail',
        params: {
          id: item._id,
        },
        query: {
          collection: item._index === 'meta.log' ? 'log' : 'phys',
        },
      }"
      class="search-item-link"
    >
      <h5>{{ title }}</h5>
    </router-link>
    <hr class="mt-3 mb-2" />
    <div class="space-y-2">
      <div class="flex items-center flex-1">
        <h5 class="text-sm text-gray-700 w-36">Creator</h5>
        <p class="flex-1 text-sm">{{ creator }}</p>
      </div>
      <div class="flex items-center flex-1">
        <h5 class="text-sm text-gray-700 w-36">Published year</h5>
        <p class="flex-1 text-sm">{{ yearPublish }}</p>
      </div>
      <div class="flex items-center flex-1">
        <h5 class="text-sm text-gray-700 w-36">Created</h5>
        <p class="flex-1 text-sm">{{ dateCreated | formatDate }}</p>
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
      return (
        this.item._source.bytitle ||
        this.item._source.parent.title.title + " (Parent Info)"
      );
    },
    creator() {
      return this.item._source.bycreator || "N/A";
    },
    yearPublish() {
      return this.item._source.publish_infos.year_publish;
    },
    dateCreated() {
      return this.item._source.date_indexed;
    },
  },
};
</script>

