import { createRouter, createWebHistory } from 'vue-router'
import Home from "@/pages/home/index.vue";
import Search from "@/pages/search/index.vue";
import SearchDetail from "@/pages/search-detail/index.vue";
import OcrdIdentifierRedirect from "@/pages/ocrd-identifier/index.vue";
import DashView from '@/pages/dashview/index.vue'
import Dashboard from '@/components/dashview/Dashboard.vue'
import Import from '@/components/dashview/Import.vue'
import OperandiJob from '@/components/dashview/OperandiJob.vue'
import Tify from '@/components/tify/Tify.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    // always scroll to top
    return { top: 0 }
  },
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
    },
    {
      path: "/search",
      name: "search",
      component: Search,
    },
    {
      path: "/search-detail",
      name: "search-detail",
      component: SearchDetail,
      props: true,
    },
    /*{
      path: "/contact",
      name: "contact",
      component: () =>
        import("@/pages/contact/index.vue"),
    },*/
    {
      path: "/data_protection",
      name: "data_protection",
      component: () =>
        import("@/pages/data_protection/index.vue"),
    },
    {
      path: "/dashview",
      name: "dashview",
      component: DashView,
      props: true,
      children: [
        {
          path: "dashboard",
          component: Dashboard,
          name: "dashboard",
        },
        {
          path: "import",
          component: Import,
          name: "import",
        },
        {
          path: "operandi",
          component: OperandiJob,
          name: "operandi",
        },
      ],
    },
    {
      path: "/ocrd-identifier",
      name: "ocrd-identifier-redirect",
      component: OcrdIdentifierRedirect,
      props: true,
    },
    {
      path: "/tify",
      name: "tify",
      component: Tify,
      props: true,
    },
  ],
});

router.afterEach((to, from) => {
  setTimeout(() => {
    const h1 = document.querySelector('h1')
    const defaultTitle = 'OLA-HD - OCR Long-Term Archive'
    if (to.path === '/') {
      document.title = defaultTitle
    } else if (to.path === '/search-detail') {
      const id = to.query["id"]
      document.title = id ? `Details for PID: ${id} | OLA-HD` : "Search-Details | OLA-HD"
    } else if (to.path === '/search') {
      const searchterm = to.query["q"]
      document.title = searchterm ? `Search: ${searchterm} | OLA-HD` : "Search | OLA-HD"
    } else {
      document.title = h1 ? `${h1.innerText} | OLA-HD` : defaultTitle
    }
  }, 0)
})

export default router
