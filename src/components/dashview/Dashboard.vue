<template>
  <div>
    <!-- Page Heading -->
    <h1 class="h3 mb-4 text-gray-800">Dashboard</h1>

    <div class="card shadow mb-4">
      <div class="card-header py-3">
        <h6 class="m-0 font-weight-bold text-primary">Import Status</h6>
      </div>
      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-bordered">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>PID</th>
                <th>Status</th>
                <th>Note</th>
              </tr>
            </thead>
            <tbody>
              <template v-if="this.records.length > 0">
                <tr v-for="(record, index) in records" :key="index">
                  <td>{{ record.trackingInfo.timestamp | formatDate }}</td>
                  <td>
                    <a
                      :href="buildUrl(record)"
                      class="text-sky-500 hover:text-slate-700"
                      target="_blank"
                    >
                      {{ record.trackingInfo.pid }}
                    </a>
                  </td>
                  <td>
                    <span
                      class="badge badge-pill"
                      :class="getCssState(record.trackingInfo.status)"
                    >
                      {{ record.trackingInfo.status }}
                    </span>
                  </td>
                  <td>{{ record.trackingInfo.message }}</td>
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
        <nav aria-label="Import status pagination">
          <ul class="pagination justify-content-end">
            <li class="page-item">
              <button
                class="page-link"
                aria-label="Previous"
                @click="switchPage(-1)"
                v-if="hasPreviousPage"
              >
                <span aria-hidden="true">&laquo; Previous</span>
                <span class="sr-only">Previous</span>
              </button>
            </li>
            <li class="page-item">
              <button
                class="page-link"
                aria-label="Next"
                @click="switchPage(1)"
                v-if="hasNextPage"
              >
                <span aria-hidden="true">Next &raquo;</span>
                <span class="sr-only">Next</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
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
          console.log(error);
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
