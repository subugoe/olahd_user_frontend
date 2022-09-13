<template>
  <div class="border rounded-md px-3 py-3 bg-gray-50 search-item">
    <router-link
      :to="{
        name: 'search-detail',
        params: {
          id: item._id,
        },
        query: {
          collection:
            item._index === 'meta.olahds_log' ? 'olahds_log' : 'olahds_phys',
        },
      }"
      class="search-item-link"
    >
      <h5>{{ title }}</h5>
    </router-link>
    <hr class="mt-3 mb-2" />
    <div class="space-y-2" v-if="indexType === 'log'">
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
    <div class="space-y-2" v-else>
      <div class="flex items-center flex-1">
        <h5 class="text-sm text-gray-700 w-36">Title</h5>
        <p class="flex-1 text-sm">{{ physTitle }}</p>
      </div>
      <div class="flex items-center flex-1">
        <h5 class="text-sm text-gray-700 w-36">Type</h5>
        <p class="flex-1 text-sm">{{ physType }}</p>
      </div>
      <div class="flex items-center flex-1">
        <h5 class="text-sm text-gray-700 w-36">Parent PID</h5>
        <p class="flex-1 text-sm">{{ pid }}</p>
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
      if (this.indexType === 'log') {
        return (
          this.item._source.bytitle ||
          this.item._source.label ||
          this.item._source.parent.title.title + " (Parent Info)"
        );
      } else {
        return "File: " + this.item._source.filename;
      }
    },
    creator() {
      return this.item._source.bycreator || "N/A";
    },
    yearPublish() {
      return (this.item._source.publish_infos || {}).year_publish || "N/A";
    },
    dateCreated() {
      return this.item._source.reindexedat;
    },
    indexType() {
      if (this.item._index.includes("log")) {
        return "log";
      } else {
        return "phys";
      }
    },
    physTitle() {
      if (this.item._source.title !== undefined) {
        return this.item._source.title.title;
      } else {
        var structrun = this.item._source.structrun[0]
        if (structrun.title !== undefined) {
          return structrun.title.title;
        }
      }
    },
    physType() {
      return this.item._source.type;
    },
    pid() {
      return this.item._source.pid
    }
  },
};
</script>

