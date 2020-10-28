<template>
  <div id="app">
    <NavBar1 @userLogin="updateUser" :isUserLogged="isLogged" :user="user"></NavBar1>
    <router-view @userLogin="updateUser"></router-view>
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

export default {
  name: "App",
  computed: {
    isLogged(){
      return this.user?true:false
    }
  },
  data(){
    return {
      user: null
    }
  },
  methods: {
    updateUser(value){
      console.log('entra en el evento')
      this.user = value
    }
  },
  mounted(){
    let s = localStorage.getItem('token')
    let u = localStorage.getItem('nombre')
    if(s && u){
      this.user = {name: u}
    }
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
