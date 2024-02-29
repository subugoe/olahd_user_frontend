<template>
  <section>
    <div class="gray-div-header">
      <h4 class="text-base">{{ "Other versions" }}</h4>
    </div>
    <div class="px-4 py-2 border-b">
      <span v-if="!hasOtherVersion">
        This archive does not have any other version.
      </span>
      <ul class="list-disc list-inside">
        <template v-if="versionInfo.previousVersion">
          <li>
            Previous version:
            <router-link class="text-sky-500 hover:text-slate-700 m-2"
              :to="{
                name: 'search-detail',
                query: { id: versionInfo.previousVersion.pid },
              }"
            >
              {{ versionInfo.previousVersion.pid }}
            </router-link>
          </li>
        </template>
        <template v-if="versionInfo.nextVersions">
          <li>
            Next version:
            <ul class="list-disc list-inside px-4 py-2">
              <li v-for="value in versionInfo.nextVersions" :key="value.onlineId">
                <router-link class="text-sky-500 hover:text-slate-700"
                  :to="{
                    name: 'search-detail',
                    query: { id: value.pid },
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
  </section>
</template>

<script>
import lzaApi from "@/services/lzaApi";
export default {
  props: {
    pid: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      versionInfo: {},
    };
  },
  computed: {
    hasOtherVersion() {
      let hasVersion = false;
      if (this.versionInfo.previousVersion || this.versionInfo.nextVersions) {
        hasVersion = true;
      }

      return hasVersion;
    },
  },
  methods: {
    async loadData() {
      // Get version information
      lzaApi
        .getVersionInfo(this.pid)
        .then((response) => {
          this.versionInfo = response.data;
        })
        .catch((error) => {
          this.error = true;
        });
    }
  },
  async created() {
    await this.loadData();
  }
};
</script>
