import { createApp } from 'vue'
import App from "./App.vue";
import router from "./router";
import { createPinia } from 'pinia';

import "@fortawesome/fontawesome-free/css/all.css";
import PrimeVue from 'primevue/config';
import Tooltip from 'primevue/tooltip';

import "./index.css";
import 'flowbite';

const app = createApp(App).use(router)
app.use(PrimeVue)
app.directive('tooltip', Tooltip)
app.use(createPinia())
app.mount('#app')
