<template>
  <div id="app">
    <NavBar1
      :isUserLogged="isLogged"
      :user="user"
      :itemsInCart="itemsInCart"
    ></NavBar1>
    <router-view></router-view>
    <!--    <IndexOffers></IndexOffers>-->
    <Footer1></Footer1>
    <Footer2></Footer2>
  </div>
</template>

<script>
import Footer2 from "./components/shared/Footer2.vue";
import Footer1 from "./components/shared/Footer1.vue";
import NavBar1 from "./components/shared/NavBar1.vue";
import IndexOffers from "./components/index-page/IndexOffers";
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
    NavBar1,
    IndexOffers
  }
};
</script>

<style></style>
