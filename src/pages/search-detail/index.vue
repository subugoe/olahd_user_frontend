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
        <download-files :pid="this.id" />
      </section>

      <!-- Version -->
      <section class="border rounded mt-4">
        <versions :pid="this.id" />
      </section>
    </template>
  </div>
</template>

<script>
import lzaApi from "@/services/lzaApi";
import DownloadFiles from "../../components/download-files/Download.vue";
import Versions from "../../components/version/Versions.vue";
import { WritableStream } from "web-streams-polyfill/ponyfill";
import streamSaver from "streamsaver";

export default {
  components: {
    DownloadFiles,
    Versions,
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
    id() {
      return this.$route.query.id;
    },
    buttonClass() {
      return "rounded border mr-4 px-3 py-1 border-sky-500 bg-sky-500 text-white dark:hover:bg-gray-700";
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
          label: "Publish Year",
          value: source.yearOfPublish || "N/A",
        },
        {
          label: "Sub-title",
          value: source.subtitle || "N/A",
        },
        {
          label: "Creator",
          value: source.creator || "N/A",
        },
        {
          label: "Place Infos",
          value: source.placeOfPublish || "N/A",
        },
        {
          label: "Year of Digitization",
          value: source.reindexedat || "N/A",
        },
      ].slice(0, this.isExpanded ? undefined : MAX_DATA);
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
  },
  methods: {
    toggleExpand() {
      this.isExpanded = !this.isExpanded;
    },
    async loadData() {
      try {
        this.loading = true;
        const response = await lzaApi.getSearchDetailsById(this.id);

        this.response = response.data;
      } catch (error) {
        this.error = true;
      } finally {
        this.loading = false;
      }
    },

    exportArchive() {
      lzaApi
        .exportArchive(this.id)
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
  },
  async created() {
    await this.loadData();
  },
  watch: {
    "$route.params.id": "loadData",
  },
};
</script>
