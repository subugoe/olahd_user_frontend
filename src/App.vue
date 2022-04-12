<template>
  <div id="app">
    <navigation-menu></navigation-menu>
    <app-header></app-header>
    <router-view />
    <app-footer></app-footer>
  </div>
</template>

<script>
import Footer from "@/layout/footer/index.vue";
import Header from "@/layout/header/index.vue";
import NavigationMenu from "@/layout/navigation-menu/index.vue";

export default {
  components: {
    appFooter: Footer,
    appHeader: Header,
    navigationMenu: NavigationMenu,
  },
};
</script>
