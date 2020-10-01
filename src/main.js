import Vue from "vue";
import App from "./App.vue";
import VueResource from "vue-resource";
import VueScrollTo from "vue-scrollto";
import VueRouter from "vue-router";
import { routes } from "./routes";
import VCalendar from 'v-calendar';
import BootstrapVue from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import VeeValidate from "vee-validate"
import {ValidationProvider} from "vee-validate"
import {ValidationObserver} from "vee-validate"
Vue.config.productionTip = false;
Vue.use(VueResource);
Vue.use(BootstrapVue);
Vue.use(VueScrollTo, {
  offset: -30
});
Vue.use(VueRouter);
Vue.use(VCalendar, {
  locales: {
      'es': {
          masks: {
              title: "MMMM",
              weekdays: "WWW",
          },
      }
  }
});
Vue.use(VeeValidate);
Vue.component('ValidationProvider', ValidationProvider);
Vue.component('ValidationObserver', ValidationObserver);
const router = new VueRouter({
  routes
});

export const eventBus = new Vue();
export const eventUserBus = new Vue();

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
