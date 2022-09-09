<template>
  <section>
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
      <h4 class="text-base">{{ "File structure" }}</h4>
      <button
        @click="download"
        class="
          rounded
          border
          px-3
          py-1
          mr-4
          border-sky-500
          bg-sky-500
          text-white
          dark:hover:bg-gray-700
        "
      >
        <i class="fas fa-download mr-1" />
        {{ "Download" }}
      </button>
    </div>
    <div class="p-4">
      <tree-select
        v-model="value"
        :multiple="true"
        :show-count="true"
        :options="options"
        placeholder="Click to view file structure. Type to search or select to download."
      >
        <label
          slot="option-label"
          slot-scope="{ node, labelClassName }"
          :class="labelClassName"
        >
          {{ node.label }}
        </label>
      </tree-select>
    </div>
  </section>
</template>

<script>
import Treeselect from "@riophae/vue-treeselect";
import treeService from "@/services/treeService";
import streamSaver from "streamsaver";
import lzaApi from "@/services/lzaApi";

import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  components: {
    TreeSelect: Treeselect,
  },
  props: {
    data: {
      type: Array,
      default: [],
    },
    pid: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      loading: true,
      value: [],
    };
  },
  computed: {
    options() {
      return (this.data || []).map((el) => ({
        id: el,
        label: this.getFileName(el),
      }));
    },
  },
  methods: {
    getFileName(url = "") {
      const parts = url.split("/");
      return parts[parts.length - 1];
    },
    download() {
      if (this.value.length < 1) {
        return;
      }

      let downloadItems = [];

      // Evaluate each chosen option
      // for (let path of this.value) {
      //   // Select the node corresponding to the path
      //   let node = treeService.getNode(this.options, path);

      //   // If it's not a leaf node
      //   if (node["children"]) {
      //     // Get all files under it
      //     let leafNodes = treeService.getLeafNodes(node);
      //     leafNodes.forEach((item) => downloadItems.push(item.id));
      //   } else {
      //     // This is a leaf node, simply add it to the set
      //     downloadItems.push(node.id);
      //   }
      // }

      // Send the download set to server

      lzaApi
        .downloadFiles(
          this.pid,
          (this.value || []).map((el) => this.getFileName(el))
        )
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

      if (!window.WritableStream) {
        streamSaver.WritableStream = WritableStream;
        window.WritableStream = WritableStream;
      }

      const fileStream = streamSaver.createWriteStream(fileName);

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
};
</script>