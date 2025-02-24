<template>
  <!-- Page Heading -->
  <h1 class="text-xl font-bold mx-2 py-4">Operandi Jobs</h1>

  <DataTable class="" :value="records" stripedRows>
    <template #empty>There is no data to show</template>
    <Column header="Status">
      <template #body="col">
        <span :class="getCssState(col.data.status)">
          {{ col.data.status}}
        </span>
    </template>
    </Column>
    <Column header="Start time">
      <template #body="col">
        {{ formatDate(col.data.created) }}
      </template>
    </Column>
    <Column header="Created Workspace">
      <template #body="col">
        <router-link :to="{
            name: 'search-detail',
            query: {
              id: col.data.pidResult,
            }
          }" class="search-item-link olahd-link-color"
        >
          <p>{{ col.data.pidResult }}</p>
        </router-link>
      </template>
    </Column>
    <Column header="Used workflow">
      <template #body="col">
        {{ col.data.workflowId }}
      </template>
    </Column>
    <Column header="Input File Group">
      <template #body="col">
        {{ col.data.inputFileGroup }}
      </template>
    </Column>
  </DataTable>

  <!-- this div is needed to get pager to the bottom on big screens-->
  <div class="flex-1"></div>

  <section class="
      flex
      justify-end
      rounded-lg
      border border-gray-200
      px-6
      m-4
      py-3
      text-gray-700
      font-montserrat
      align-bottom
    ">
    <ul class="flex items-center">
      <div class="flex flex-1 justify-around items-center">
        <li>
          <button class="pr-4 text-gray-700 font-medium" aria-label="Previous"
            @click="switchPage(-1)" v-if="hasPreviousPage">
            <span aria-hidden="true">&laquo; Previous</span>
            <span class="sr-only">Previous</span>
          </button>
        </li>
        <li>
          <button class="pr-4 text-gray-700 font-medium" aria-label="Next" @click="switchPage(1)"
            v-if="hasNextPage">
            <span aria-hidden="true">Next &raquo;</span>
            <span class="sr-only">Next</span>
          </button>
        </li>
      </div>
    </ul>
  </section>
</template>

<script>
import axios from "../../axios-config";
import moment from "moment";
import { authService } from "../../auth/auth";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import ScrollPanel from "primevue/scrollpanel";

export default {
  components: { DataTable, Column },
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
  methods: {
    formatDate(value) {
      if (value) {
        return moment(String(value)).format("DD/MM/YYYY HH:mm");
      }
    },
    async fetchData(page, limit) {
      // Init state
      this.loading = true;
      this.error = false;

      // Fetch data
      let username = await authService.getUsername()
      axios
        .get("/operandi/jobs", {
          params: {
            username: username,
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
            "bg-green-100 text-green-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded";
          break;
        case "PROCESSING":
          cssClass =
            "bg-yellow-100 text-yellow-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded";
          break;
        case "FAILED":
          cssClass =
            "bg-red-100 text-red-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded";
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
        let archiveId = record.archiveResponse.pid;
        url = `/search-detail?id=${esc(archiveId)}`;
      }

      return url;
    },
  },
};
</script>
