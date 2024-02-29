<template>
  <section>
    <div class="gray-div-header">
      <h4 class="text-base">{{ "File structure" }}</h4>
      <div>
        <button @click="toggleExpand" class="detail-blue-button">
          <i
            :class="[
              Object.keys(this.expandedKeys).length ? 'fa-angle-double-up' : 'fa-angle-double-down',
              'fas mr-1',
            ]"
          />
          {{ Object.keys(this.expandedKeys).length ? "Collapse" : "Expand" }}
        </button>
      </div>
    </div>
    <div class="mx-4 mt-2 text-yellow-600" role="alert" v-if="warnNoSelection">
      Please select the files to be downloaded
      <button class="close" aria-label="Close" @click="warnNoSelection = false">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="p-4">
      <div class="flex">
        <Tree v-model:expandedKeys="expandedKeys" v-model:selectionKeys="selectedKeys" :value="options" class="w-full md:w-30rem"
          selectionMode="checkbox">
          <template #default="slotProps">
            <b>{{ slotProps.node.label }} ({{ slotProps.node.children.length }})</b>
          </template>
          <template #leaf="slotProps">
            {{ slotProps.node.label }}
            <span v-if="!slotProps.node.isDisabled" >
              - <a :href="buildUrl(pid, slotProps.node.key)" target="_blank" class="text-sky-500 hover:text-slate-700">View</a>
            </span>
          </template>
        </Tree>
        <button @click="download" :disabled="!isOpen"
          class="detail-blue-button whitespace-nowrap max-h-9">
          <i class="fas fa-download" /> {{ "Download" }}
        </button>
      </div>
    </div>
  </section>
</template>

<script>
import lzaApi from "@/services/lzaApi";
import emojiService from "@/services/emojiService";
import { WritableStream } from "web-streams-polyfill/ponyfill";
import streamSaver from "streamsaver";
import Tree from 'primevue/tree';
import 'primevue/resources/themes/lara-light-blue/theme.css'
import treeService from "@/services/treeService";

export default {
  components: {
    Tree: Tree,
  },
  props: {
    pid: {
      type: String,
      default: "",
    },
    isUserLoggedIn: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      loading: true,
      options: [],
      selectedKeys: [],
      archiveInfo: {},
      warnNoSelection: false,
      expandedKeys: {},
    };
  },
  computed: {
    isOpen() {
      return this.archiveInfo.state == "open"
        || (this.archiveInfo.state == "locked" && this.isUserLoggedIn);
    },
    isDisabled() {
      return !this.isOpen || this.value.length < 1;
    }
  },
  methods: {
    removeWarnNoSelection() {
      this.warnNoSelection = null
    },

    download() {
      this.warnNoSelection = false;
      if (this.selectedKeys.length < 1) {
        this.warnNoSelection = true;
        return;
      }

      let downloadItems = [];

      // Evaluate each chosen option
      for ( let path in this.selectedKeys) {
        if (!this.selectedKeys[path].checked) {
          continue;
        }
        // Select the node corresponding to the path
        let node = treeService.getNode(this.options, path);

        // If it is not a leaf node
        if (node["children"]) {
          // Get all files under it
          let leafNodes = treeService.getLeafNodes(node);
          leafNodes.forEach((item) => downloadItems.push(item.key));
        } else {
          // This is a leaf node, simply add it to the set
          downloadItems.push(node.key);
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
          let response = await lzaApi.getArchiveInfo(this.pid, limit, offset, true);
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
          let existingPath = findWhere(currentLevel, "key", partId);

          // If yes, looking deeper
          if (existingPath) {
            currentLevel = existingPath.children;
          } else {
            let newPart = {
              // Full path to this node
              key: partId,

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
            } else {
              newPart.type = "leaf"
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
    toggleExpand() {
      if (!Object.keys(this.expandedKeys).length) {
        for (let node of this.options) {
          this.expandNode(node);
        }
        this.expandedKeys = { ...this.expandedKeys };
      } else {
        this.expandedKeys = {};
      }
    },
    expandNode(node) {
      if (node.children && node.children.length) {
        this.expandedKeys[node.key] = true;

        for (let child of node.children) {
          this.expandNode(child);
        }
      }
    },
  },
  async created() {
    await this.loadData();
  },
};
</script>
<style>
.p-checkbox {
  background-color: lightgray;
  border-width: 2px;
  border-radius: 0px;
}
.p-checkbox-box {
  border-radius: 0px;
  height: 19px;
}
.p-tree-toggler {
  height: 1.5rem;
}
.p-tree .p-tree-container .p-treenode .p-treenode-content {
  padding: 0.2rem;
}
.p-tree {
  padding: 1px;
}
ul.p-treenode-children {
  margin-left: 2rem;
}
</style>
