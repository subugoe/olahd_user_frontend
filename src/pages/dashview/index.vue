<template>
  <div class="flex border-r flex-grow" :class="{ 'flex-wrap' : isMobile }" v-if="isUserLoggedIn">
    <div class="flex flex-col flex-shrink" v-if="!isMobile">
      <Sidebar/>
    </div>
    <MobileDashbar class="w-screen" v-if="isMobile"/>

    <div class="flex-1 p-4">
      <router-view />
    </div>
  </div>
</template>

<script>
import Sidebar from "@/components/dashview/Sidebar.vue";
import MobileDashbar from "@/components/dashview/MobileDashbar.vue";
import { authService } from "../../auth/auth"
import $ from "jquery";
import "jquery.easing";
import { mystore } from "@/store";
import { mapState } from "pinia";

export default {
  components: {
    Sidebar,
    MobileDashbar,
  },
  data() {
    return {
      isUserLoggedIn: false,
      listenerKey: -1,
    }
  },
  computed: {
    ...mapState(mystore, ["isMobile"]),
  },
  async unmounted() {
    authService.removeLoggedInListener(this.listenerKey);
  },
  async mounted() {
    var self = this
    this.listenerKey = authService.addLoggedInListener((newVal) => {
      self.isUserLoggedIn = newVal
    })
    this.isUserLoggedIn = await authService.isUserLoggedIn();
    // Close any open menu accordions when window is resized below 768px
    $(window).resize(function () {
      if ($(window).width() < 768) {
        $(".sidebar .collapse").collapse("hide");
      }
    });

    // Prevent the content wrapper from scrolling when the fixed side navigation hovered over
    $("body.fixed-nav .sidebar").on(
      "mousewheel DOMMouseScroll wheel",
      function (e) {
        if ($(window).width() > 768) {
          let e0 = e.originalEvent,
            delta = e0.wheelDelta || -e0.detail;
          this.scrollTop += (delta < 0 ? 1 : -1) * 30;
          e.preventDefault();
        }
      }
    );

    // Scroll to top button appear
    $(document).on("scroll", function () {
      let scrollDistance = $(this).scrollTop();
      if (scrollDistance > 100) {
        $(".scroll-to-top").fadeIn();
      } else {
        $(".scroll-to-top").fadeOut();
      }
    });

    // Smooth scrolling using jQuery easing
    $(document).on("click", "a.scroll-to-top", function (e) {
      let $anchor = $(this);
      $("html, body")
        .stop()
        .animate(
          {
            scrollTop: $($anchor.attr("href")).offset().top,
          },
          1000,
          "easeInOutExpo"
        );
      e.preventDefault();
    });
  },
};
</script>

<style scoped>
</style>
