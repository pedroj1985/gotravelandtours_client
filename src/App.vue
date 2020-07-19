<template>
  <div id="app">
    <NavBar1></NavBar1>
    <Index></Index>
    <Footer1></Footer1>
    <Footer2></Footer2>
  </div>
</template>

<script>
import Footer2 from "./components/shared/Footer2.vue"
import Footer1 from "./components/shared/Footer1.vue"
import NavBar1 from "./components/shared/NavBar1.vue"
import Index from "./components/index-page/Index.vue"

export default {
  name: "App",
  components: {
    Footer2,
    Footer1,
    NavBar1,
    Index
  }
};
</script>

<style>
</style>
