<template>
  <div id="app" class="min-h-screen flex flex-col flex-1">
    <NavigationMenu />
    <Main v-if="isHeaderVisible"></Main>
    <div class="flex flex-1 flex-col">
      <Router-View v-slot="{ Component, route }">
        <component :is="Component" :key="$route.fullPath" />
      </Router-View>
    </div>
    <Footer />
  </div>
</template>

<script>
import Footer from "@/layout/footer/index.vue";
import Main from "@/layout/main/index.vue";
import NavigationMenu from "@/layout/navigation-menu/index.vue";
import { mystore } from '@/store';

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
  created() {
    const store = mystore()
    store.setIsMobile(window.innerWidth < 640)
    window.onresize = () => {
      const isMobile = window.innerWidth < 640
      store.setIsMobile(isMobile)
    }
  }
};
</script>
