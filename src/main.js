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
import {Validator} from "vee-validate"
import Toasted from 'vue-toasted';
import es from 'vee-validate/dist/locale/es'

Vue.config.productionTip = false;
Vue.use(VueResource);
Vue.use(BootstrapVue);
Vue.use(Toasted, {
  duration: 5000,
  containerClass: 'gtt-notification'
})
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
Validator.localize("es",es)
const router = new VueRouter({
  routes
});
router.beforeEach((to, from, next) => {
  if(to.matched.some(record => record.meta.requiresAuth)) {
      if (localStorage.getItem('token') == null) {
          next({
              path: '/login',
              params: { nextUrl: to.fullPath }
          })
      } else {
          next()
      }
  }
  else if(localStorage.getItem('token') == null){
      next()
     }
     else
      next({
        name: 'indexLogged'
      })
})

export const eventBus = new Vue();
export const eventUserBus = new Vue();

new Vue({
  router,
  mounted(){
    this.$validator.localize(es)
  },
  render: h => h(App)
}).$mount("#app");
