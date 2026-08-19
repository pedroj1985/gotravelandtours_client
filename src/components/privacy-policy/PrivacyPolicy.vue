<template>
  <div id="content">
    <NavBar2 :menuLinks="menuLinks"></NavBar2>
    <Breadcrumb :elementList="breadcrumbList"></Breadcrumb>
    <privacy-content></privacy-content>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import Breadcrumb from "@/components/shared/Breadcrumb.vue";
import NavBar2 from "@/components/shared/NavBar2.vue";
import PrivacyContent from "./PrivacyContent.vue";

defineOptions({ name: "PrivacyPolicy" });

const router = useRouter();

const emit = defineEmits<{
  (e: "userLogin", value: any): void;
}>();

const breadcrumbList = ref(["Inicio", "Política de Privacidad"]);
const menuLinks = ref([
  {
    name: "index",
    displayName: "Política de Privacidad",
    id: "content",
  },
]);

function emitUserLogin(value: any) {
  emit("userLogin", value);
  router.go(0);
}
</script>
