import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store/store";

import "@fortawesome/fontawesome-free/css/all.css";

import "./index.css";
import 'flowbite';

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
