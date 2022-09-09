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
      <section
        v-if="this.response._source.all_file_hrefs"
        class="border rounded mt-4"
      >
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
import { WritableStream } from "web-streams-polyfill/ponyfill";
import streamSaver from "streamsaver";

import lzaApi from "@/services/lzaApi";
import treeService from "@/services/treeService";
import emojiService from "@/services/emojiService";
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
      archiveInfo: {},
      versionInfo: {},
      error: null,
      loading: true,
      value: [],
      options: [],
      response: null,
      isExpanded: false,
    };
  },
  computed: {
    buttonClass() {
      return "rounded border mr-4 px-3 py-1 border-sky-500 bg-sky-500 text-white dark:hover:bg-gray-700";
    },
    info() {
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
    title() {
      if (!this.response) {
        return "";
      }
      return (
        this.response._source.bytitle ||
        this.response._source.label ||
        this.response._source.parent.title.title + " (Parent Info)"
      );
    },
    isOpen() {
      // Check if the archive is on disk
      return this.archiveInfo.state !== "archived";
    },
    isDisabled() {
      // Check if the download button should be disabled or not
      return !this.isOpen || this.value.length < 1;
    },
    hasOtherVersion() {
      let hasVersion = false;
      if (this.versionInfo.previousVersion || this.versionInfo.nextVersions) {
        hasVersion = true;
      }

      return hasVersion;
    },
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

      // Get version information
      // lzaApi
      //   .getVersionInfo(this.id)
      //   .then((response) => {
      //     this.versionInfo = response.data;
      //   })
      //   .catch((error) => {
      //     this.error = true;
      //     console.log(error);
      //   });

      // this.options = this.buildTree();
    },

    buildTree() {
      let tree = [];

      for (let i = 0; i < this.archiveInfo.files.length; i++) {
        let fullPath = this.archiveInfo.files[i].name;

        // Split the full path into many parts
        let parts = fullPath.split("/");

        // Start looking at the root
        let currentLevel = tree;

        for (let j = 0; j < parts.length; j++) {
          let part = parts[j];

          // Build the ID of each part. ID is the full path starting from root to that part
          let index = fullPath.indexOf(part);
          let partId = fullPath.substring(0, index + part.length);

          // Check if this part is already exist in the tree
          let existingPath = findWhere(currentLevel, "id", partId);

          // If yes, looking deeper
          if (existingPath) {
            currentLevel = existingPath.children;
          } else {
            let newPart = {
              // Full path to this node
              id: partId,

              // How it is displayed on the UI
              label: part,

              // The name of this folder/file only
              name: part,
            };

            // Disable selection if the archive is not in open state
            if (!this.isOpen) {
              newPart.isDisabled = true;
            }

            // For non-leaf nodes
            if (j < parts.length - 1) {
              // Add children
              newPart.children = [];

              // Add folder emoji
              newPart.label = "📁 " + newPart.label;
            }

            // Add emoji to leaf-node
            if (j === parts.length - 1) {
              newPart.label =
                emojiService.getEmoji(this.archiveInfo.files[i].type) +
                " " +
                newPart.label;
            }

            currentLevel.push(newPart);

            // Only go deeper if this is not the leaf node
            if (j < parts.length - 1) {
              currentLevel = newPart.children;
            }
          }
        }
      }

      function findWhere(array, key, value) {
        let t = 0;
        while (t < array.length && array[t][key] !== value) {
          t++;
        }
        if (t < array.length) {
          return array[t];
        } else {
          return false;
        }
      }

      return tree;
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
      let contentDisposition = response.headers.get("Content-Disposition");
      let fileName = contentDisposition.substring(
        contentDisposition.lastIndexOf("=") + 1
      );

      // These code section is adapted from an example of the StreamSaver.js
      // https://jimmywarting.github.io/StreamSaver.js/examples/fetch.html

      // If the WritableStream is not available (Firefox, Safari), take it from the ponyfill
      if (!window.WritableStream) {
        streamSaver.WritableStream = WritableStream;
        window.WritableStream = WritableStream;
      }

      const fileStream = streamSaver.createWriteStream(fileName);
      // const readableStream = response.body;

      // More optimized (but doesn't work on Safari!)
      // if (readableStream.pipeTo) {
      //     return readableStream.pipeTo(fileStream);
      // }

      window.writer = fileStream.getWriter();

      const reader = response.body.getReader();
      const pump = () =>
        reader
          .read()
          .then((res) =>
            res.done ? writer.close() : writer.write(res.value).then(pump)
          );

      pump();
    },

    buildUrl(id, path) {
      // Used to escape special characters
      let esc = encodeURIComponent;

      // Base URL for to view file
      let base = "/api/download-file";

      return `${base}/${id}?path=${esc(path)}`;
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
