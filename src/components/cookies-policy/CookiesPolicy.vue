<template>
  <div id="content">
    <NavBar2 :menuLinks="menuLinks"></NavBar2>
    <Breadcrumb :elementList="breadcrumbList"></Breadcrumb>
    <cookies-content></cookies-content>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import CookiesContent from "./CookiesContent.vue";
import Breadcrumb from "@/components/shared/Breadcrumb.vue";
import NavBar2 from "@/components/shared/NavBar2.vue";

defineOptions({ name: "CookiesPolicy" });

const router = useRouter();

const emit = defineEmits<{
  (e: "userLogin", value: any): void
}>();

const breadcrumbList = ref(["Inicio", "Política de Cookies"]);
const menuLinks = ref([
  {
    name: "index",
    displayName: "Política de Cookies",
    id: "content"
  }
]);

function emitUserLogin(value: any) {
  emit("userLogin", value);
  router.go(0);
}
</script>
