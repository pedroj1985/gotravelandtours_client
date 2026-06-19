<template>
  <div id="content">
    <NavBar2 :menuLinks="menuLinks"></NavBar2>
    <Breadcrumb :elementList="breadcrumbList"></Breadcrumb>
    <booking-content></booking-content>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import Breadcrumb from "@/components/shared/Breadcrumb.vue";
import NavBar2 from "@/components/shared/NavBar2.vue";
import BookingContent from "./BookingContent.vue";

defineOptions({ name: "BookingConditions" });

const router = useRouter();

const emit = defineEmits<{
  (e: "userLogin", value: any): void
}>();

const breadcrumbList = ref(["Inicio", "Condiciones Generales"]);
const menuLinks = ref([
  {
    name: "index",
    displayName: "Condiciones Generales",
    id: "content"
  }
]);

function emitUserLogin(value: any) {
  emit("userLogin", value);
  router.go(0);
}
</script>
