import Vue from "vue";
import App from "./App.vue";
import VueResource from "vue-resource";
import VueScrollTo from "vue-scrollto";

Vue.config.productionTip = false;
Vue.use(VueResource);
Vue.use(VueScrollTo, {
  offset: -30
});

export const eventBus = new Vue();

new Vue({
  render: h => h(App)
}).$mount("#app");
