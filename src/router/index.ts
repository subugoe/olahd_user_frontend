import Vue from "vue";
import Router from "vue-router";
import Home from "@/pages/home/index.vue";
import Search from "@/pages/search/index.vue";
import SearchDetail from "@/pages/search-detail/index.vue";
import DashView from '@/pages/dashview/index.vue'
import Dashboard from '@/components/dashview/Dashboard.vue'
import Import from '@/components/dashview/Import.vue'
import { rule } from "postcss";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
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
      props: (route) => ({ query: route.query.q }),
    },
    {
      path: "/search-detail/:id",
      name: "search-detail",
      component: SearchDetail,
      props: true,
    },
    {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "about" */ "@/pages/about/index.vue"),
    },
    {
      path: "/contact",
      name: "contact",
      component: () =>
        import(/* webpackChunkName: "about" */ "@/pages/contact/index.vue"),
    },
    {
      path: "/impressum",
      name: "impressum",
      component: () =>
        import(/* webpackChunkName: "about" */ "@/pages/impressum/index.vue"),
    },
    {
      path: "/dashview",
      name: "dashview",
      component: DashView,
      props: true,
      children: [
        {
          path: "",
          component: Dashboard,
          name: "home",
        },
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
      ],
    },
  ],
});
