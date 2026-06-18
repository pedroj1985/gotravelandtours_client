import { createApp } from "vue";
import App from "./App.vue";
import { createRouter, createWebHistory } from "vue-router";
import { routes } from "./routes";
import "bootstrap/dist/css/bootstrap.css";
import "@/assets/styles/main.scss";
import Vue3Toastify, { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import { storageService } from "./utils/storageService";
import lodash from "lodash";
import { helpers } from "./utils/helpers";
import { authStore } from "./stores/authStore";
import { cartStore } from "./stores/cartStore";
import { setupGlobalErrorHandler, setToastInstance } from "./utils/errorHandler";

const app = createApp(App);

setupGlobalErrorHandler(app);

app.use(Vue3Toastify, {
  autoClose: 5000
});

setToastInstance(toast);

app.config.globalProperties.$helpers = helpers;
app.config.globalProperties.$lodash = lodash;
app.config.globalProperties.$toasted = {
  show: (message, options) => toast(message, options)
};

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { x: 0, y: 0 };
  }
});

router.beforeEach((to, from) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (storageService.getToken() == null) {
      return { name: "index", params: { nextUrl: to.fullPath } };
    } else {
      const expiryDate = storageService.getExpiryDate();
      if (expiryDate) {
        if (new Date(expiryDate).getTime() > new Date().getTime()) {
          return true;
        } else {
          const saveVersion = storageService.getVersion();
          storageService.clear();
          storageService.setVersion(saveVersion);

          cartStore.refresh();
          authStore.logout();
          toast.error("Sesión expirada");
          return { name: "index", params: { nextUrl: to.fullPath } };
        }
      } else {
        return true;
      }
    }
  } else if (storageService.getToken() == null) {
    return true;
  } else
    return { name: "indexLogged" };
});

app.use(router);

app.mount("#app");
