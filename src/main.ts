import { createApp } from 'vue'
import App from "./App.vue";
import router from "./router";
import { createPinia } from 'pinia';

import "@fortawesome/fontawesome-free/css/all.css";
import PrimeVue from 'primevue/config';
import Tooltip from 'primevue/tooltip';
import { authService } from './auth/auth';

import "./index.css";
import 'flowbite';
const app = createApp(App).use(router)
app.use(PrimeVue)
app.use(createPinia())
app.directive('tooltip', Tooltip)
app.mount('#app')
authService.init()
