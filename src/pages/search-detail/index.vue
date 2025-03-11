<template>
  <div class="container">
    <!-- Error message -->
    <div class="row my-3" v-if="error">
      <div class="col">
        <div
          class="alert alert-danger alert-dismissible fade show"
          role="alert"
        >
          <strong>Error!</strong>
          <span> An error has occurred</span>
          <span v-if="error_msg">: {{ error_msg }} </span>
          <button
            type="button"
            class="close"
            data-dismiss="alert"
            aria-label="Dismiss error message"
            @click="error = null; error_msg = null"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
      </div>
    </div>
    <!-- Message if archived was just moved from tape to disk -->
    <span v-if="moveTriggered">Request accepted. Data is being transferred from tape to hard drive.</span>
    <div class="row" v-if="loading">
      <div class="col text-center">
        <img src="@/assets/spin-1s-100px.gif" alt="Searching" />
      </div>
    </div>

    <template v-if="!loading">
      <div class="row mt-4 mb-4">
        <div class="col">
          <button
            type="button"
            class="btn btn-link olahd-link-color"
            @click="$router.go(-1)"
          >
            &laquo; Back
          </button>
        </div>
      </div>

      <!-- Full details -->
      <section class="border rounded">
        <div class="gray-div-header" >
          <h1 class="text-base">{{ title }}</h1>
          <div>
            <button @click="exportArchive" class="detail-blue-button" :disabled="!isOpen">
              <i class="fas fa-download mr-1" />
              {{ "Export" }}
            </button>
          </div>
        </div>
        <div class="p-4 space-y-2">
          <div class="grid grid-cols-6" v-for="item in info" :key="item.label">
            <div class="col-span-2">
              <h2 class="text-gray-800 font-semibold">{{ item.label }}</h2>
            </div>
            <div class="col-span-4">
              <p class="text-gray-600">{{ item.value }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- File structure -->
      <section class="border rounded mt-4">
        <Download :pid="this.id" :isUserLoggedIn="this.isUserLoggedIn"/>
      </section>

      <!-- Version -->
      <section class="border rounded mt-4 mb-4">
        <versions :pid="this.id" />
      </section>

      <div class="grid grid-cols-1 gap-2 content-start my-5">
        <OperandiButton :pid="this.id" :isUserLoggedIn="this.isUserLoggedIn" :archiveState="this.archiveInfo.state"/>
        <button v-show="showExportRequestButton" class="olahd-link-color w-fit"
          @click="moveArchive" >
            Move archive from tape to disk
          </button>
          <a target="_blank" class="olahd-link-color inline w-fit" :href=linkToDfgviewer v-if="isOpen">
            Open in DFG viewer
        </a>
      </div>
    </template>
  </div>
</template>

<script>
import lzaApi from "@/services/lzaApi";
import Download from "../../components/download-files/Download.vue";
import Versions from "../../components/version/Versions.vue";
import OperandiButton from "../../components/operandi/OperandiButton.vue";
import { WritableStream } from "web-streams-polyfill/ponyfill";
import streamSaver from "streamsaver";
import { authService } from "../../auth/auth";

export default {
  components: {
    Download,
    Versions,
    OperandiButton,
  },
  data() {
    return {
      versionInfo: {},
      archiveInfo: {},
      error: null,
      error_msg: null,
      loading: true,
      response: null,
      isUserLoggedIn: false,
      listenerKey: -1,
      moveTriggered: false,
    };
  },

  computed: {
    id() {
      return this.$route.query.id;
    },
    showExportRequestButton() {
      return this.archiveInfo.state == "archived" && this.isUserLoggedIn && !this.moveTriggered
    },
    info() {
      if (!this.response) {
        return [];
      }
      const source = this.response;
      const MAX_DATA = 4;
      return [
        {
          label: "Publisher",
          value: source.publisher || "N/A",
        },
        {
          label: "Year of Publication",
          value: source.yearOfPublish || "N/A",
        },
        {
          label: "Subtitle",
          value: source.subtitle || "N/A",
        },
        {
          label: "Author",
          value: source.creator || "N/A",
        },
        {
          label: "Place Infos",
          value: source.placeOfPublish || "N/A",
        },
        {
          label: "Year of Digitization",
          value: source.yearDigitization || "N/A",
        },
      ]
    },
    title() {
      if (!this.response) {
        return "";
      }

      return this.response.title;
    },
    hasOtherVersion() {
      let hasVersion = false;
      if (this.versionInfo.previousVersion || this.versionInfo.nextVersions) {
        hasVersion = true;
      }

      return hasVersion;
    },
    linkToDfgviewer() {
      var host = window.location.protocol + "//" + window.location.host;
      return 'https://dfg-viewer.de/show/?set[mets]=' + host + '/api/export/mets-web?id=' + this.id
    },
    isOpen() {
      return this.archiveInfo.state == "open"
        || (this.archiveInfo.state == "locked" && this.isUserLoggedIn);
    },
  },

  methods: {
    async loadData() {
      try {
        this.loading = true;
        const response = await lzaApi.getSearchDetailsById(this.id);
        this.response = response.data;
      } catch (error) {
        if (error && error.message && error.message.includes("404")) {
          this.error_msg = "No search entry found for PID"
        } else {
          this.error_msg = "Unknown error fetching search entry for PID"
        }
        this.error = true;
      } finally {
        this.loading = false;
      }
    },

    async loadArchiveInfo() {
      try {
        let response = await lzaApi.getArchiveInfo(this.id, 0, 0, false);
        this.archiveInfo = response.data;
      } catch (error) {
        this.archiveInfo = {}
      }
    },

    exportArchive() {
      if (this.archiveInfo.state == 'open') {
        lzaApi
          .exportArchive(this.id)
          .then((response) => {
            this.consumeDownloadStream(response);
          })
          .catch((error) => {
            this.error_msg = "Unknown error when exporting archive"
            this.error = true;
          });
      } else if (this.archiveInfo.state == 'locked' && this.isLoggedIn){
        lzaApi
          .exportFullArchive(this.id)
          .then((response) => {
            this.consumeDownloadStream(response);
          })
          .catch((error) => {
            this.error_msg = "Unknown error when exporting full archive"
            this.error = true;
          });
      }
    },

    moveArchive() {
      if (!this.moveTriggered) {
        lzaApi.exportRequest(this.id)
          .then((response) => {
            this.moveTriggered = true
          })
          .catch((error) => {
            this.error_msg = "Moving archive from tape to disk failed"
            this.error = true;
          });
      }
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
  },
  async created() {
    if (!this.id) {
      this.error = true;
      this.error_msg = "PID is missing";
      this.loading = false;
    } else {
      await this.loadData();
      await this.loadArchiveInfo();
    }
  },
  async unmounted() {
    authService.removeLoggedInListener(this.listenerKey);
  },
  async mounted() {
    var self = this
    this.listenerKey = authService.addLoggedInListener((newVal) => {
      self.isUserLoggedIn = newVal
    })
    this.isUserLoggedIn = await authService.isUserLoggedIn();
  },
  watch: {
    "$route.params.id": "loadData",
  },
};
</script>
