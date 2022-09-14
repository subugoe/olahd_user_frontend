<template>
  <div class="container">
    <!-- Error message -->
    <div class="row my-3" v-if="error">
      <div class="col">
        <div
          class="alert alert-danger alert-dismissible fade show"
          role="alert"
        >
          <strong>Error!</strong> An error has occurred. Please try again.
          <button
            type="button"
            class="close"
            data-dismiss="alert"
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
      </div>
    </div>

    <div class="row" v-if="loading">
      <div class="col text-center">
        <img src="/assets/images/spin-1s-100px.gif" alt="Searching" />
      </div>
    </div>

    <template v-if="!loading">
      <div class="row">
        <div class="col">
          <button
            type="button"
            class="btn btn-link text-sky-500 hover:text-slate-700"
            @click="$router.go(-1)"
          >
            &laquo; Back
          </button>
        </div>
      </div>

      <!-- Full details -->
      <section class="border rounded">
        <div
          class="
            bg-gray-100
            text-gray-700
            flex
            items-center
            justify-between
            flex-1
            px-4
            py-2
            rounded-t
            border-b
          "
        >
          <h4 class="text-base">{{ title }}</h4>
          <div>
            <button @click="toggleExpand" :class="buttonClass">
              <i
                :class="[
                  isExpanded ? 'fa-angle-double-up' : 'fa-angle-double-down',
                  'fas mr-1',
                ]"
              />
              {{ isExpanded ? "Collapse" : "Expand" }}
            </button>
            <button @click="exportArchive" :class="buttonClass">
              <i class="fas fa-download mr-1" />
              {{ "Export" }}
            </button>
          </div>
        </div>
        <div class="p-4 space-y-2">
          <div class="grid grid-cols-6" v-for="item in info" :key="item.label">
            <div class="col-span-2">
              <h5 class="text-gray-800 font-semibold">{{ item.label }}</h5>
            </div>
            <div class="col-span-4">
              <p class="text-gray-600">{{ item.value }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- File structure -->
      <section class="border rounded mt-4">
        <download-files
          :data="this.response._source.all_file_hrefs"
          :pid="this.response._source.pid"
        />
      </section>

      <!-- Version -->
      <!-- <section class="border rounded mt-4">
        <versions />
      </section> -->
      <div class="row my-4">
        <div class="col">
          <div class="card">
            <div class="card-header">
              <h5>Other versions</h5>
            </div>
            <div class="card-body">
              <span v-if="!hasOtherVersion"
                >This archive does not have any other version.</span
              >
              <ul>
                <template v-if="versionInfo.previousVersion">
                  <li>
                    Previous version:
                    <router-link
                      :to="{
                        name: 'search-detail',
                        params: { id: versionInfo.previousVersion.offlineId },
                      }"
                    >
                      {{ versionInfo.previousVersion.pid }}
                    </router-link>
                  </li>
                </template>
                <template v-if="versionInfo.nextVersions">
                  <li>
                    Next version:
                    <ul>
                      <li v-for="value in versionInfo.nextVersions">
                        <router-link
                          :to="{
                            name: 'search-detail',
                            params: {
                              id: value.onlineId
                                ? value.onlineId
                                : value.offlineId,
                            },
                          }"
                        >
                          {{ value.pid }}
                        </router-link>
                      </li>
                    </ul>
                  </li>
                </template>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import moment from "moment";

import lzaApi from "@/services/lzaApi";
import DownloadFiles from "../../components/download-files/Download.vue";
// import Versions from "../../components/version/Versions.vue";

export default {
  props: {
    id: String,
  },
  components: {
    DownloadFiles,
    // Versions,
  },
  data() {
    return {
      versionInfo: {},
      error: null,
      loading: true,
      response: null,
      isExpanded: false,
    };
  },
  computed: {
    buttonClass() {
      return "rounded border mr-4 px-3 py-1 border-sky-500 bg-sky-500 text-white dark:hover:bg-gray-700";
    },
    info() {
      if (this.indexType === 'log') {
        return this.info_log
      } else {
        return this.info_phys
      }
    },
    info_log() {
      if (!this.response) {
        return [];
      }
      const source = this.response._source;
      const MAX_DATA = 4;
      return [
        {
          label: "Creator",
          value: source.bycreator || "N/A",
        },
        {
          label: "Publish Year",
          value: (source.publish_infos || {}).year_publish || "N/A",
        },
        {
          label: "Parent Url",
          value:
            ((source.parent || {}).purl || "").replace(/\|LOG.*/g, "") || "N/A",
        },
        {
          label: "Parent Title",
          value: ((source.parent || {}).title || {}).title || "N/A",
        },
        {
          label: "Label",
          value: source.label || "N/A",
        },
        {
          label: "Owner",
          value: (source.rights_info || {}).rights_owner || "N/A",
        },
        {
          label: "Year of Digitization",
          value:
            (source.digitization_infos || {}).year_digitization_string || "N/A",
        },
        {
          label: "Identifier",
          value: source.record_identifier || "N/A",
        },
        {
          label: "Place Infos",
          value:
            ((source.publish_infos || {}).place_publish || []).join(", ") ||
            "N/A",
        },
      ].slice(0, this.isExpanded ? undefined : MAX_DATA);
    },
    info_phys() {
      if (!this.response) {
        return [];
      }
      const source = this.response._source;
      const MAX_DATA = 4;

      if (source.title !== undefined) {
        var title = source.title.title;
      } else {
        var title = source.structrun[0].title !== undefined ?
          source.structrun[0].title.title : "N/A";
      }
      return [
        {
          label: "Filename",
          value: source.filename,
        },
        {
          label: "Type",
          value: source.type || "N/A",
        },
        {
          label: "Title",
          value: title,
        },
        {
          label: "Pid",
          value: source.pid,
        },
        {
          label: "Page",
          value: source.page,
        },
        {
          label: "Label",
          value: source.label || "N/A",
        },
        {
          label: "Mimetype",
          value: source.mimetype || "N/A",
        },
        {
          label: "Link",
          value: source.page_href || "N/A",
        },
      ].slice(0, this.isExpanded ? undefined : MAX_DATA);
    },
    title() {
      if (!this.response) {
        return "";
      }
      console.log(this.response)
      if (this.response._index.includes('log')) {
        return (
          this.response._source.bytitle ||
          this.response._source.label ||
          this.response._source.parent.title.title + " (Parent Info)"
        );
      } else {
        return "File: " + this.response._source.filename;
      }
    },
    hasOtherVersion() {
      let hasVersion = false;
      if (this.versionInfo.previousVersion || this.versionInfo.nextVersions) {
        hasVersion = true;
      }

      return hasVersion;
    },
    indexType() {
      if (this.$route.query.collection.includes("log")) {
        return "log";
      } else {
        return "phys";
      }
    }
  },
  filters: {
    formatDate(value) {
      if (value) {
        return moment(String(value)).format("DD/MM/YYYY HH:mm");
      }
    },
  },
  methods: {
    toggleExpand() {
      this.isExpanded = !this.isExpanded;
    },
    async loadData() {
      try {
        this.loading = true;
        const response = await lzaApi.getMetaLogById(
          this.id,
          this.$route.query.collection
        );

        this.response = response.data;
      } catch (error) {
        this.error = true;
      } finally {
        this.loading = false;
      }
    },

    exportArchive() {
      lzaApi
        .exportArchive(this.response._source.pid)
        .then((response) => {
          this.consumeDownloadStream(response);
        })
        .catch((error) => {
          this.error = true;
        });
    },

    consumeDownloadStream(response) {
      if (response.ok) {
        let contentDisposition = response.headers.get("Content-Disposition");
        let fileName = contentDisposition.substring(
          contentDisposition.lastIndexOf("=") + 1
        );
        return response.blob().then((blob) => {
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = fileName;
          document.body.appendChild(link);
          link.click();
          link.remove();
          window.URL.revokeObjectURL(url);
        })
      } else {
        return response.blob()
      }
    },
  },
  async created() {
    await this.loadData();
  },
  watch: {
    "$route.params.id": "loadData",
  },
};
</script>
