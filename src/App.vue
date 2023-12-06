<template>
  <div id="app" class="min-h-screen flex flex-col flex-1">
    <NavigationMenu />
    <div class="h-14" />
    <Main v-if="isHeaderVisible"></Main>
    <div class="flex flex-1 flex-col">
      <RouterView />
    </div>
    <Footer />
  </div>
</template>

<script>
import Footer from "@/layout/footer/index.vue";
import Main from "@/layout/main/index.vue";
import NavigationMenu from "@/layout/navigation-menu/index.vue";

export default {
  components: {
    Footer,
    Main,
    NavigationMenu,
  },
  computed: {
    isHeaderVisible() {
      return this.$router.currentRoute.value.path === "/";
    },
  },
};
</script>
