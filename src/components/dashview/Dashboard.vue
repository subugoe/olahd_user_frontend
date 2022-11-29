<template>
  <div class="container">
    <!-- Page Heading -->
    <span class="text-xl font-bold px-6 py-4">Dashboard</span>

    <div class="m-4">
      <h6 class="text-lg font-medium px-6 py-4">Import Status</h6>

      <div class="flex flex-col">
        <div class="overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div class="py-2 inline-block min-w-full sm:px-6 lg:px-8">
            <table class="min-w-full">
              <thead class="border-b">
                <tr class="text-sm font-medium text-gray-900 text-left">
                  <th class="px-6 py-4">Timestamp</th>
                  <th class="px-6 py-4">PID</th>
                  <th class="px-6 py-4">Status</th>
                  <th class="px-6 py-4">Note</th>
                </tr>
              </thead>
              <tbody>
                <template v-if="this.records.length > 0">
                  <tr
                    v-for="(record, index) in records"
                    :key="index"
                    class="
                      border-b
                      text-sm text-gray-900
                      font-light
                      whitespace-nowrap
                    "
                  >
                    <td class="px-6 py-4">
                      {{ record.trackingInfo.timestamp | formatDate }}
                    </td>
                    <td class="px-6 py-4">
                      <a
                        :href="buildUrl(record)"
                        class="text-sky-500 hover:text-slate-700"
                        target="_blank"
                      >
                        {{ record.trackingInfo.pid }}
                      </a>
                    </td>
                    <td class="px-6 py-4">
                      <span :class="getCssState(record.trackingInfo.status)">
                        {{ record.trackingInfo.status }}
                      </span>
                    </td>
                    <div class="px-6 py-4 max-w-3xl overflow-scroll">
                      <td>
                        {{ record.trackingInfo.message }}
                      </td>
                    </div>
                  </tr>
                </template>
                <template v-else>
                  <tr>
                    <td colspan="6" class="text-center">
                      <h3>There is no data to show</h3>
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    <section
      class="
        flex
        justify-end
        rounded-lg
        border border-gray-200
        px-6
        m-4
        py-3
        text-gray-700
        font-montserrat
      "
    >
      <ul class="flex items-center">
        <div class="flex flex-1 justify-around items-center">
          <li>
            <button
              class="pr-4 text-gray-700 font-medium"
              aria-label="Previous"
              @click="switchPage(-1)"
              v-if="hasPreviousPage"
            >
              <span aria-hidden="true">&laquo; Previous</span>
              <span class="sr-only">Previous</span>
            </button>
          </li>
          <li>
            <button
              class="pr-4 text-gray-700 font-medium"
              aria-label="Next"
              @click="switchPage(1)"
              v-if="hasNextPage"
            >
              <span aria-hidden="true">Next &raquo;</span>
              <span class="sr-only">Next</span>
            </button>
          </li>
        </div>
      </ul>
    </section>
  </div>
</template>

<script>
import axios from "../../axios-config";
import moment from "moment";

export default {
  data() {
    return {
      records: [],
      loading: true,
      error: false,
      page: 0,
      limit: 10,
    };
  },
  computed: {
    hasPreviousPage() {
      return this.page > 0;
    },
    hasNextPage() {
      return this.records.length === this.limit;
    },
  },
  created() {
    this.switchPage(0);
  },
  filters: {
    formatDate(value) {
      if (value) {
        return moment(String(value)).format("DD/MM/YYYY HH:mm");
      }
    },
  },
  methods: {
    fetchData(page, limit) {
      // Init state
      this.loading = true;
      this.error = false;

      // Fetch data
      axios
        .get("/admin/import-status", {
          params: {
            username: this.$store.getters.username,
            page,
            limit,
          },
        })
        .then((response) => {
          this.records = response.data;
        })
        .catch((error) => {
          this.error = true;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    getCssState(status) {
      let cssClass = "badge-success";

      switch (status) {
        case "SUCCESS":
          cssClass =
            "bg-green-100 text-green-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-green-200 dark:text-green-900";
          break;
        case "PROCESSING":
          cssClass =
            "bg-yellow-100 text-yellow-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-yellow-200 dark:text-yellow-900";
          break;
        case "FAILED":
          cssClass =
            "bg-red-100 text-red-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-red-200 dark:text-red-900";
          break;
      }
      return cssClass;
    },
    switchPage(state) {
      switch (state) {
        case 1:
          this.page++;
          break;
        case -1:
          this.page--;
          break;
        case 0:
          this.page = 0;
          break;
        default:
          this.page = 0;
      }
      this.fetchData(this.page, this.limit);
    },
    buildUrl(record) {
      // Used to escape special characters
      let esc = encodeURIComponent;
      let url = "#";

      // If there is more information (successful import)
      if (record.archiveResponse) {
        let archiveId = record.archiveResponse.onlineId
          ? record.archiveResponse.onlineId
          : record.archiveResponse.offlineId;
        url = `/home/search-detail/${esc(archiveId)}`;
      }

      return url;
    },
  },
};
</script>
