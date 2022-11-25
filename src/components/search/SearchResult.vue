<template>
  <div class="border rounded-md px-3 py-3 bg-gray-50 search-item">
    <router-link
      :to="{
        name: 'search-detail',
        query: {
          id: itemId,
        },
      }"
      class="search-item-link text-sky-600 hover:text-sky-900"
    >
      <h5>{{ title }}</h5>
    </router-link>
    <hr class="mt-3 mb-2" />
    <div class="space-y-2">
      <div
        class="flex items-center flex-1"
        v-for="item in info"
        :key="item.label"
      >
        <div class="col-span-2">
          <h5 class="text-sm text-gray-700 w-36">{{ item.label }}</h5>
        </div>
        <div class="col-span-4">
          <p class="flex-1 text-sm">{{ item.value }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    info() {
      if (!this.item) {
        return [];
      }

      const item = this.item;

      return [
        {
          label: "Publisher",
          value: item.publisher || "N/A",
        },
        {
          label: "Published Place",
          value: item.placeOfPublish || "N/A",
        },
        {
          label: "Year of Publish",
          value: item.yearOfPublish || "N/A",
        },
        {
          label: "Subtitle",
          value: item.subtitle || "N/A",
        },
        {
          label: "Creator",
          value: item.creator || "N/A",
        },
      ];
    },
    itemId() {
      return this.item.PID;
    },
    title() {
      if (this.item.title) {
        return this.item.title;
      } else {
        return this.item.PID;
      }
    },
  },
};
</script>

