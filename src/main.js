import Vue from "vue";
import App from "./App.vue";
import VueResource from "vue-resource";
import VueScrollTo from "vue-scrollto";
import VueRouter from "vue-router";
import { routes } from "./routes";

Vue.config.productionTip = false;
Vue.use(VueResource);
Vue.use(VueScrollTo, {
  offset: -30
});
Vue.use(VueRouter);

const router = new VueRouter({
  routes
});

export const eventBus = new Vue();

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
