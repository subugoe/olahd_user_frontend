import { createApp } from 'vue'
import App from "./App.vue";
import router from "./router";
import { createPinia } from 'pinia';

import "@fortawesome/fontawesome-free/css/all.css";
import PrimeVue from 'primevue/config';
import Tooltip from 'primevue/tooltip';
import { authService } from './auth/auth';
import MyPreset from './utils/primevue-preset';

import "./index.css";
const app = createApp(App).use(router)
app.use(PrimeVue, { theme: { preset: MyPreset, } })
app.use(createPinia())
app.directive('tooltip', Tooltip)
app.mount('#app')
authService.init()
