<template>
  <div id="content">
    <NavBar2 :menuLinks="menuLinks"></NavBar2>
    <Breadcrumb :elementList="breadcrumbList"></Breadcrumb>
    <legal-content></legal-content>
  </div>
</template>

<script>
import Breadcrumb from "@/components/shared/Breadcrumb.vue";
import NavBar2 from "@/components/shared/NavBar2.vue";
import LegalContent from "./LegalContent.vue";

export default {
  name: "Index",
  components: {
    NavBar2,
    Breadcrumb,
    LegalContent
  },
  data() {
    return {
      breadcrumbList: ["Inicio", "Información Legal"],
      menuLinks: [
        {
          name: "index",
          displayName: "Información Legal",
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
