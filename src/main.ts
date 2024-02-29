import { createApp } from 'vue'
import App from "./App.vue";
import router from "./router";
import store from './store';

import "@fortawesome/fontawesome-free/css/all.css";
import PrimeVue from 'primevue/config';

import "./index.css";
import 'flowbite';

const app = createApp(App).use(router)
app.use(PrimeVue)
app.use(store)
app.mount('#app')
