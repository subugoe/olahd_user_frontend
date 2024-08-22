import { createRouter, createWebHistory } from 'vue-router'
import Home from "@/pages/home/index.vue";
import Search from "@/pages/search/index.vue";
import SearchDetail from "@/pages/search-detail/index.vue";
import OcrdIdentifierRedirect from "@/pages/ocrd-identifier/index.vue";
import DashView from '@/pages/dashview/index.vue'
import Dashboard from '@/components/dashview/Dashboard.vue'
import Import from '@/components/dashview/Import.vue'
import { authService } from '../auth/auth'

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
    {
      path: "/contact",
      name: "contact",
      component: () =>
        import("@/pages/contact/index.vue"),
    },
    {
      path: "/imprint",
      name: "imprint",
      component: () =>
        import("@/pages/imprint/index.vue"),
    },
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
      ],
    },
    {
      path: "/ocrd-identifier",
      name: "ocrd-identifier-redirect",
      component: OcrdIdentifierRedirect,
      props: true,
    },
  ],
});

router.beforeEach(async (to, from, next) => {
  // This isn't an actual route leading to a component. It is called by the OAuth server once
  //   the user logged in. Handling it here prevents us to have an additional callback.html file.
  //   An additional file would lead to a short hick-up after logging in. (callback.html is
  //   loaded and than the actual route.)
  // So here we handle the login redirect and than send the user to the "/" route.
  if (authService.isKeycloak() && (to.path === '/login' || to.path === '/logout')) {
    if (to.path === '/login') {
      if (to.fullPath.includes("error")) {
        return;
      }
      // Inform the authentication of the login redirect. Afterwards we send the user to the
      // destination page
      try {
        await authService.handleLoginRedirect();
        next('/dashview/dashboard');
      } catch (error) {
        next('/');
      }
      // this is indirectly used to propagate the login status to its listeners
      authService.isUserLoggedIn()
    } else if (to.path === '/logout') {
      // This is similar to the "/callback" route not leading to an actual component but only to handle the logout callback from the authentication server.
      await authService.handleLogoutRedirect()
      next('/');
    }
  } else {
    // Default case. The user is send to the desired route.
    next();
  }
})

export default router
