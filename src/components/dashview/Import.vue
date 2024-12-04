<template>
  <div class="container">
    <!-- Page Heading -->
    <h1 class="text-xl font-bold my-8">Import Your Data Here</h1>

    <div
      v-if="isSuccess"
      class="alert alert-success alert-dismissible fade show"
      role="alert"
    >
      <h2 class="alert-heading">Success!</h2>
      <p>Your data is valid and being processed by the system.</p>
      <p>
        Your PID: <strong>{{ newPid }}</strong>
      </p>
      <button
        type="button"
        class="close"
        data-dismiss="alert"
        aria-label="Close"
      >
        <span aria-hidden="true">&times;</span>
      </button>
    </div>

    <div
      v-if="isError"
      class="alert alert-danger alert-dismissible fade show"
      role="alert"
    >
      <h2 class="alert-heading">Failed!</h2>
      <p>The system cannot process your data. Please check the error below:</p>
      <hr />
      <p>{{ errorMessage }}</p>
      <button
        type="button"
        class="close"
        data-dismiss="alert"
        aria-label="Close"
      >
        <span aria-hidden="true">&times;</span>
      </button>
    </div>

    <div class="">
      <div class="grid grid-cols-3">
        <form class="col-span-2" @submit.prevent="onSubmit">
          <div>
            <input
              type="file"
              class="border px-3 py-2.5 mb-2 rounded-md w-full"
              aria-describedby="help-text"
              @change="processFile($event)"
            />
            <label
              class="text-sm text-gray-500"
              for="file-upload"
              data-browse="Choose file"
            >
              {{ fileName }}
            </label>
          </div>

          <div>
            <label for="prev-version" class="sr-only"
              >PID of the previous version</label
            >
            <input
              type="text"
              placeholder="PID of the previous version"
              class="border px-3 py-2.5 mt-4 rounded-md w-full"
              aria-describedby="help-text"
              v-model="prevPid"
            />
            <small id="help-text" class="text-sm text-gray-500">
              Leave this blank if there is no previous version.
            </small>
          </div>

          <template v-if="showProgress">
            <h2 class="small font-weight-bold">
              Upload progress
              <span class="float-right">{{ uploadPercentage }}%</span>
            </h2>
            <div class="progress mb-4">
              <div
                class="progress-bar bg-info"
                role="progressbar"
                :style="{ width: uploadPercentage + '%' }"
                aria-valuemin="0"
                aria-valuemax="100"
              ></div>
            </div>
          </template>

          <!-- <button type="submit" class="btn btn-primary">Submit</button> -->
          <div class="flex justify-end">
            <button type="submit" class="normal-blue-button mt-4" :disabled="showProgress">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "../../axios-config";

export default {
  data() {
    return {
      prevPid: "",
      file: null,
      newPid: "",
      uploadPercentage: 0,
      showProgress: false,
      isSuccess: false,
      isError: false,
      errorMessage: "",
    };
  },
  computed: {
    fileName() {
      if (this.file) {
        return this.file.name;
      }
      return "Choose an OCRD-ZIP...";
    },
  },
  methods: {
    processFile(event) {
      // Get a list of selected files
      let files = event.target.files || event.dataTransfer.files;

      // If user chooses new files
      if (files.length > 0) {
        // Take the new file
        this.file = files[0];
      }
    },
    onSubmit() {
      this.showProgress = true;
      this.uploadPercentage = 0;
      this.isSuccess = false;
      this.isError = false;

      // TODO: validate the input
      let data = new FormData();
      data.append("file", this.file);

      // Take the PID of the previous version if given by user
      if (this.prevPid) {
        data.append("prev", this.prevPid);
      }

      axios
        .post("/bag", data, {
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: function (progressEvent) {
            this.uploadPercentage = Math.round(
              (progressEvent.loaded / progressEvent.total) * 100
            );
          }.bind(this),
        })
        .then((response) => {
          this.isSuccess = true;
          this.newPid = response.data.pid;
        })
        .catch((error) => {
          this.isError = true;
          this.errorMessage = error.response.data.message;
        })
        .finally(() => {
          this.showProgress = false;
        });
    },
  },
};
</script>

<style scoped>
</style>
