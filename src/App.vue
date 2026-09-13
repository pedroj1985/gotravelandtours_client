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

<script setup lang="ts">
import Footer2 from "./components/shared/Footer2.vue";
import Footer1 from "./components/shared/Footer1.vue";
import NavBar1 from "./components/shared/NavBar1.vue";
import { computed, onMounted } from "vue";
import { useAuthStore } from "./stores/authStore";
import { useCartStore } from "./stores/cartStore";

const authStore = useAuthStore();
const cartStore = useCartStore();

const user = computed(() => authStore.user);
const itemsInCart = computed(() => cartStore.count);
const isLogged = computed(() => Boolean(user.value));

onMounted(() => {
  cartStore.refresh();
});
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
