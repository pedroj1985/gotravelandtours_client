<template>
  <div id="content">
    <NavBar2 :menuLinks="menuLinks"></NavBar2>
    <Breadcrumb :elementList="breadcrumbList"></Breadcrumb>
    <cookies-content></cookies-content>
  </div>
</template>

<script>
import CookiesContent from "./CookiesContent";
import Breadcrumb from "@/components/shared/Breadcrumb.vue";
import NavBar2 from "@/components/shared/NavBar2.vue";

export default {
  name: "Index",
  components: {
    NavBar2,
    Breadcrumb,
    CookiesContent
  },
  data() {
    return {
      breadcrumbList: ["Inicio", "Política de Cookies"],
      menuLinks: [
        {
          name: "index",
          displayName: "Política de Cookies",
          id: "content"
        },
      ]
    };
  },
  methods: {
    emitUserLogin(value) {
      this.$emit("userLogin", value);
      this.$router.go();
    }
  }
};
</script>
