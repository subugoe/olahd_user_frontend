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
      <h4 class="text-base">{{ "Other versions" }}</h4>
      <div>
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
                <li v-for="value in versionInfo.nextVersions" :key="value.onlineId">
                  <router-link
                    :to="{
                      name: 'search-detail',
                      params: {
                        id: value.onlineId ? value.onlineId : value.offlineId,
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
  </section>
</template>

<script>
export default {
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
};
</script>