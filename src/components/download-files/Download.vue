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
          slot-scope="{ node, shouldShowCount, count, labelClassName, countClassName }"
          :class="labelClassName"
        >
          {{ node.label }}
          <template v-if="!node.isBranch && isOpen">
            <span> - </span>
            <a :href="buildUrl(pid, node.id)" target="_blank" class="text-sky-500 hover:text-slate-700">View</a>
          </template>
          <span v-if="shouldShowCount" :class="countClassName">({{ count }})</span>
        </label>
      </tree-select>
    </div>
  </section>
</template>

<script>
import Treeselect from "@riophae/vue-treeselect";
import treeService from "@/services/treeService";
import lzaApi from "@/services/lzaApi";
import emojiService from "@/services/emojiService";
import { WritableStream } from "web-streams-polyfill/ponyfill";
import streamSaver from "streamsaver";

import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  components: {
    TreeSelect: Treeselect,
  },
  props: {
    pid: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      loading: true,
      value: [],
      options: [],
      archiveInfo: {},
    };
  },
  computed: {
    isOpen() {
      return this.archiveInfo.state !== "archived";
    },
    isDisabled() {
      return !this.isOpen || this.value.length < 1;
    }
  },
  methods: {
    download() {
      if (this.value.length < 1) {
        return;
      }

      let downloadItems = [];

      // Evaluate each chosen option
      for (let path of this.value) {
        // Select the node corresponding to the path
        let node = treeService.getNode(this.options, path);

        // If it's not a leaf node
        if (node["children"]) {
          // Get all files under it
          let leafNodes = treeService.getLeafNodes(node);
          leafNodes.forEach((item) => downloadItems.push(item.id));
        } else {
          // This is a leaf node, simply add it to the set
          downloadItems.push(node.id);
        }
      }
      // Send the download set to server
      lzaApi.downloadFiles(this.pid, downloadItems)
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
      const pump = () => reader.read()
          .then(res =>
            res.done ? writer.close() : writer.write(res.value).then(pump)
          );

      pump();
    },
    async loadData() {
      const limit = 1000;
      let offset = 0;
      let firstCall = true;

      try {
        while (true) {
          let response = await lzaApi.getArchiveInfo(this.pid, limit, offset);
          if (firstCall) {
            // Store all data for the first call
            this.archiveInfo = response.data;
            firstCall = false;
          } else {
            // Otherwise, just add more files to the file array
            this.archiveInfo.files = this.archiveInfo.files.concat(
              response.data.files
            );
          }

          // There is no more file to get? Stop
          if (response.data.files.length < limit) {
            break;
          } else {
            // Get new files by increasing the offset
            offset += limit;
          }
        }
      } catch (error) {
        if (error.response.status === 404) {
          // ocrd-zips with next versions don't have files available
          return
        }
        this.error = true;
        console.log(error);
      } finally {
        this.loading = false;
      }

      this.options = this.buildTree();
    },
    buildTree() {
      let tree = [];
      if (this.archiveInfo.files === undefined) {
        return;
      }
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
    buildUrl(pid, path) {
      // Used to escape special characters
      let esc = encodeURIComponent;

      return `${lzaApi.getBaseUrl()}download-file?id=${pid}&path=${esc(path)}`;
    },
  },
  async created() {
    await this.loadData();
  },
};
</script>
