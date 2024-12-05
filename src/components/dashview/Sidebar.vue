<template>
  <!-- Sidebar -->
  <div
    :class="
      'bg-sky-600 py-4 flex flex-col flex-1 duration-200 ' +
      (isSidebarExpanded ? 'w-72' : '')
    "
  >
    <RouterLink
      to="/dashview/dashboard"
      class="text-3xl font-semibold text-center text-sky-800"
      exact
    >
      <div class="flex items-center justify-center space-x-2">
        <div class="flex flex-col">
          <i class="fas fa-cogs text-white" />
        </div>
        <div class="text-white text-2xl" v-if="isSidebarExpanded">OLA-HD</div>
      </div>
    </RouterLink>
    <hr class="bg-white mt-4" />
    <ul class="mt-4">
      <RouterLink
        to="/dashview/dashboard"
        tag="li"
        :class="(isSidebarExpanded ? 'text-left' : 'text-center')"
        active-class="!text-white"
        class="flex items-center rounded-md px-3 text-white/50"
        exact
      >
        <a
          :class="
            'space-x-3 font-medium text-inherit hover:text-white/100 w-full ' +
            (isSidebarExpanded ? 'text-lg' : 'text-2xl')
          "
        >
          <i class="fas fa-fw fa-tachometer-alt" />
          <span class="text-inherit" v-if="isSidebarExpanded">Dashboard</span>
        </a>
      </RouterLink>
    </ul>
    <hr class="bg-white mt-4" />
    <span class="text-white/60 font-semibold mt-4 px-3 text-center">Tools</span>
    <ul class="mt-4">
      <RouterLink
        to="/dashview/import"
        tag="li"
        :class="(isSidebarExpanded ? 'text-left' : 'text-center')"
        class="flex items-center rounded-md px-3 text-white/50"
        active-class="!text-white"
        exact
      >
        <a
          :class="
            'space-x-3 font-medium text-inherit hover:text-white/100 w-full ' +
            (isSidebarExpanded ? 'text-lg' : 'text-2xl')
          "
        >
          <i class="fas fa-fw fa-upload" />
          <span v-if="isSidebarExpanded">Import</span>
        </a>
      </RouterLink>
    </ul>
    <hr class="bg-white mt-4" />
    <button
      class="bg-white/30 h-12 w-12 rounded-full mx-auto mt-4 hover:bg-white/40"
      @click="toggleSidebar"
      aria-label="Toggle sidebar"
    >
      <i
        :class="
          'fas fa-fw text-white/70 text-xl ' +
          (isSidebarExpanded ? 'fa-chevron-left' : 'fa-chevron-right')
        "
      />
    </button>
  </div>
</template>

<script>
import $ from "jquery";
import { mystore } from "@/store";
import { mapState } from "pinia";

export default {
  mounted() {
    // Toggle the side navigation
    $("#sidebarToggle, #sidebarToggleTop").on("click", function (e) {
      $("body").toggleClass("sidebar-toggled");
      $(".sidebar").toggleClass("toggled");
      if ($(".sidebar").hasClass("toggled")) {
        $(".sidebar .collapse").collapse("hide");
      }
    });
  },
  computed: {
    ...mapState(mystore, ["isSidebarExpanded"]),
  },
  methods: {
    toggleSidebar() {
      const store = mystore()
      store.setIsSidebarExpanded(!store.isSidebarExpanded)
    },
  },
};
</script>

<style scoped></style>
