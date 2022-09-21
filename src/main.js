import Vue from "vue";
import App from "./App.vue";
import VueResource from "vue-resource";
import VueScrollTo from "vue-scrollto";
import VueRouter from "vue-router";
import { routes } from "./routes";
import VCalendar from "v-calendar";
import BootstrapVue from "bootstrap-vue";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import VeeValidate from "vee-validate";
import { ValidationProvider } from "vee-validate";
import { ValidationObserver } from "vee-validate";
import { Validator } from "vee-validate";
import Toasted from "vue-toasted";
import es from "vee-validate/dist/locale/es";
import VueTimepicker from "vue2-timepicker";
import "vue2-timepicker/dist/VueTimepicker.css";
import VueLodash from "vue-lodash";
import lodash from "lodash";
import { helpers } from "./utils/helpers";
import Multiselect from "vue-multiselect";
import "vue-multiselect/dist/vue-multiselect.min.css";
import VueLazyLoad from "vue-lazyload";
import "vue-image-lightbox/dist/vue-image-lightbox.min.css";
import axios from "axios";

Vue.config.productionTip = false;
Vue.use(VueLazyLoad);
Vue.use(VueResource);
Vue.use(BootstrapVue);
Vue.use(VueLodash, { lodash: lodash });
Vue.use(Toasted, {
  duration: 5000,
  className: "gtt-notification",
});
Vue.use(VueScrollTo, {
  offset: -30,
});

// const originalPush = VueRouter.prototype.push
// VueRouter.prototype.push = function push(location) {
//   return originalPush.call(this, location).catch(err => err)
// }

Vue.use(VueRouter);
Vue.use(VCalendar, {
  locales: {
    es: {
      masks: {
        title: "MMMM",
        weekdays: "WWW",
      },
    },
  },
});
Vue.prototype.$helpers = helpers;
Vue.use(VeeValidate, {
  fieldsBagName: "inputs ",
});
Vue.component("multiselect", Multiselect);
Vue.component("ValidationProvider", ValidationProvider);
Vue.component("ValidationObserver", ValidationObserver);
Vue.component("VueTimepicker", VueTimepicker);
Validator.localize("es", es);
const router = new VueRouter({
  routes,
  scrollBehavior() {
    return { x: 0, y: 0 };
  },
});

const version = JSON.parse(localStorage.getItem("version"));

versionCheck();

async function versionCheck() {
  if (!version) {
    const response = await axios.get(
      "https://admin.gotravelandtours.com/publicEliecer/api/Versions/1"
    );
    localStorage.setItem("version", JSON.stringify(response.data));
    Vue.toasted.show(`Nueva version instalada`);
  }
  newVersion();
  let intervalo = setInterval(newVersion, 1800000);
}

async function newVersion() {
  const response = await axios.get(
    "https://admin.gotravelandtours.com/publicEliecer/api/Versions/1"
  );
  const data = response.data;
  const v = JSON.parse(localStorage.getItem("version"));
  if (v.VersionName != data.VersionName) {
    Vue.toasted.show(`Nueva version`, {
      action: {
        text: "Actualizar",
        onClick: (e, toastObject) => {
          localStorage.setItem("version", JSON.stringify(data));
          window.location.reload();
          toastObject.goAway(0);
        },
      },
    });
  }
}

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (localStorage.getItem("token") == null) {
      next({
        name: "index",
        params: { nextUrl: to.fullPath },
      });
    } else {
      if (localStorage.getItem("fecha_exp")) {
        if (
          new Date(localStorage.getItem("fecha_exp")).getTime() >
          new Date().getTime()
        ) {
          next();
        } else {
          const saveVersion = JSON.parse(localStorage.getItem("version"));
          localStorage.clear();
          localStorage.setItem("version", JSON.stringify(saveVersion));

          eventCartBus.$emit("updateCart");
          eventBus.$emit("userLogin", null);
          Vue.toasted.show(`Sesión expirada`, {
            type: "error",
          });
          router.push({
            name: "index",
            params: { nextUrl: to.fullPath },
          });
        }
      } else {
        next();
      }
    }
  } else if (localStorage.getItem("token") == null) {
    next();
  } else
    next({
      name: "indexLogged",
    });
});

export const eventBus = new Vue();
export const eventUserBus = new Vue();
export const eventFiltersRent = new Vue();
export const eventDiffDays = new Vue();
const eventLodgingReserve = new Vue();
const eventCartBus = new Vue();
Vue.prototype.$eventCartBus = eventCartBus;
Vue.prototype.$eventLodgingReserve = eventLodgingReserve;

new Vue({
  router,
  mounted() {
    this.$validator.localize(es);
  },
  render: (h) => h(App),
}).$mount("#app");
