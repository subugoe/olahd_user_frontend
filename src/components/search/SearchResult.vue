<template>
  <div class="border rounded-md px-3 py-3 bg-gray-50 search-item">
    <router-link
      :to="{
        name: 'search-detail',
        query: {
          id: itemId,
        },
      }"
    >
      <h5 class="search-item-link olahd-link-color">{{ title }}</h5>
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
      } else if (this.item.noData && ["publisher", "placeOfPublish", "subtitle", "creator"]
        .every((prop) => !this.item[prop])) {
        return [
          {
            label: "no data available",
            value: ""
          }
        ]
      } else {
        return [
          {
            label: "Publisher",
            value: this.item.publisher || "N/A",
          },
          {
            label: "Place of Publication",
            value: this.item.placeOfPublish || "N/A",
          },
          {
            label: "Year of Publication",
            value: this.item.yearOfPublish || "N/A",
          },
          {
            label: "Subtitle",
            value: this.item.subtitle || "N/A",
          },
          {
            label: "Author",
            value: this.item.creator || "N/A",
          },
        ];
      }
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

