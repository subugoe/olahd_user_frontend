<template>
  <div>
    <button :disabled="disable" @click="runOperandi" class="w-fit detail-blue-button"
      v-tooltip="tooltip"
      v-show="show">
      <i class="fas fa-newspaper mr-1" />
      {{ "Run Operandi" }}
    </button>
    <span v-if="jobId">Operandi Job submitted</span>
    <span v-if="errorMsg">{{ errorMsg }}</span>
  </div>
</template>

<script>
import lzaApi from "@/services/lzaApi";

export default {
  props: {
    pid: {
      type: String,
      default: "",
    },
    isUserLoggedIn: {
      type: Boolean,
      default: false,
    },
    archiveState: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      tooltip: "",
      jobId: null,
      disable: true,
      errorMsg: "",
    };
  },
  computed: {
    show() {
      let res = this.isUserLoggedIn && this.archiveState == "open"
      return res;
    }
  },
  methods: {
    runOperandi() {
      //double check logged in user not neseccary, as backend call is authenticated
      this.disable = true;
      this.tooltip = "There is already a running job for this workspace"
      lzaApi.runOperandiWorkflow(this.pid)
        .then((response) => {
          this.jobId = response.data.jobId
        })
        .catch((error) => {
          this.errorMsg = "Starting operandi workflow failed"
          this.disable = true;
          this.tooltip = "Starting failed"
        });
    },

    async enableOperandiButton() {
      if (!this.isUserLoggedIn) {
        return;
      }
      lzaApi.areOperandiJobsRunning(this.pid)
        .then((response) => {
          this.disable = response.data.jobsRunning
          if (this.disable) {
            if (response.data.jobsForPid) {
              this.tooltip = "There is already a running job for this workspace"
            } else {
              this.tooltip = "Currently only one running operandi job per user is allowed"
            }
          } else {
            this.tooltip = ""
          }
        })
        .catch((error) => {
          this.disable = true;
          this.tooltip = "Error querying Job Status"
        });
    },
  },
  async mounted() {
    await this.enableOperandiButton();
  },
};
</script>
<style>
</style>
