<template>
  <div id="content">
    <NavBar2 :menuLinks="menuLinks"></NavBar2>
    <Breadcrumb :elementList="breadcrumbList"></Breadcrumb>
    <privacy-content></privacy-content>
  </div>
</template>

<script>
import Breadcrumb from "@/components/shared/Breadcrumb.vue";
import NavBar2 from "@/components/shared/NavBar2.vue";
import PrivacyContent from "./PrivacyContent.vue";

export default {
  name: "Index",
  components: {
    NavBar2,
    Breadcrumb,
    PrivacyContent
  },
  data() {
    return {
      breadcrumbList: ["Inicio", "Política de Privacidad"],
      menuLinks: [
        {
          name: "index",
          displayName: "Política de Privacidad",
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
