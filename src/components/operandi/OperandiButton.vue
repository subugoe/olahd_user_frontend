<template>
  <Dialog
    header="Start Operandi-Workflow"
    :append-to-body="true"
    v-model:visible="showDialog"
    modal
    dismissableMask
    @hide=""
    :pt="{
      title: {
        class: ['text-lg', 'font-medium'],
      },
    }"
    :class="{ 'w-1/4' : !isMobile }"
  >
    <div>
      <p class="mb-4">The workspace is transferred to operandi.ocr-d.de and then a workflow is started to process
         the workspace. Once the workflow has finished, the processed workspace is uploaded back to OLA-HD and
         saved as a next version. 
         Depending on the complexity of the workspace to be processed, this can take several hours
         until the job is completed</p>
      <div class="flex place-content-center">
        <button class="detail-blue-button flex-none" @click="runOperandi">Run</button>
        <button class="detail-blue-button flex-none" @click="this.showDialog = false">Cancel</button>
      </div>
    </div>
  </Dialog>
  <div>
    <button :disabled="disable" @click="operandiButtonClicked" class="w-fit detail-blue-button"
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
import Dialog from "primevue/dialog";

export default {
  components: { Dialog },
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
      showDialog: false,
    };
  },
  computed: {
    show() {
      let res = this.isUserLoggedIn && this.archiveState == "open"
      return res;
    }
  },
  methods: {
    operandiButtonClicked() {
      this.showDialog = true
    },

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
      this.showDialog = false;
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
