<template>
  <div id="content">
    <NavBar2 :menuLinks="menuLinks"></NavBar2>
    <Breadcrumb :elementList="breadcrumbList"></Breadcrumb>
    <booking-content></booking-content>
  </div>
</template>

<script>
import Breadcrumb from "@/components/shared/Breadcrumb.vue";
import NavBar2 from "@/components/shared/NavBar2.vue";
import BookingContent from "./BookingContent.vue";

export default {
  name: "Index",
  components: {
    NavBar2,
    Breadcrumb,
    BookingContent
  },
  data() {
    return {
      breadcrumbList: ["Inicio", "Condiciones Generales"],
      menuLinks: [
        {
          name: "index",
          displayName: "Condiciones Generales",
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
