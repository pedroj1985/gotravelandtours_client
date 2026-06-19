<template>
  <div id="app">
    <a href="#main-content" class="skip-link">Ir al contenido principal</a>
    <NavBar1
      :isUserLogged="isLogged"
      :user="user"
      :itemsInCart="itemsInCart"
    ></NavBar1>
    <div id="main-content" tabindex="-1">
      <router-view></router-view>
    </div>
    <!--    <IndexOffers></IndexOffers>-->
    <Footer1></Footer1>
    <Footer2></Footer2>
  </div>
</template>

<script>
import Footer2 from "./components/shared/Footer2.vue";
import Footer1 from "./components/shared/Footer1.vue";
import NavBar1 from "./components/shared/NavBar1.vue";
import { authStore } from "./stores/authStore";
import { cartStore } from "./stores/cartStore";

export default {
  name: "App",
  computed: {
    user() {
      return authStore.user;
    },
    itemsInCart() {
      return cartStore.count;
    },
    isLogged() {
      return this.user ? true : false;
    }
  },
  data() {
    return {};
  },
  methods: {},
  mounted() {
    this.itemsInCart = this.$helpers.getCartItems();
  },
  components: {
    Footer2,
    Footer1,
    NavBar1
  }
};
</script>

<style>
.skip-link {
  position: absolute;
  top: -100%;
  left: 0;
  z-index: 10000;
  padding: 8px 16px;
  background: var(--color-primary);
  color: #fff;
  font-size: 14px;
  text-decoration: none;
}
.skip-link:focus {
  top: 0;
}
</style>
