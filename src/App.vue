<template>
  <div id="app">
    <NavBar1 :isUserLogged="isLogged" :user="user"></NavBar1>
    <router-view></router-view>
    <IndexOffers></IndexOffers>
    <Footer1></Footer1>
    <Footer2></Footer2>
  </div>
</template>

<script>
import Footer2 from "./components/shared/Footer2.vue"
import Footer1 from "./components/shared/Footer1.vue"
import NavBar1 from "./components/shared/NavBar1.vue"
import IndexOffers from "./components/index-page/IndexOffers"
import { eventUserBus } from "./main"

export default {
  name: "App",
  computed: {
    isLogged(){
      return this.user ? true : false
    }
  },
  data(){
    return {
      user: null
    }
  },
  created(){
    eventUserBus.$on('userLogin', (item) => {
      this.user = item
      console.log(this.user ? true : false)
    })
  },
  components: {
    Footer2,
    Footer1,
    NavBar1,
    IndexOffers
  }
};
</script>

<style>
</style>
