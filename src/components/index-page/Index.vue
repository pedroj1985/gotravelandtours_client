<template>
  <div id="content">
    <IndexBanner @userLogin="emitUserLogin"></IndexBanner>
    <IndexWhoAreWe></IndexWhoAreWe>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router"
import IndexBanner from "./IndexBanner.vue"
import Destinies from "./Destinies.vue"
import IndexServices from "./IndexServices.vue"
import IndexPackages from "./IndexPackages.vue"
import IndexOtherServices from "./IndexOtherServices.vue"
import IndexWhoAreWe from "./IndexWhoAreWe.vue"

defineOptions({ name: "Index" })

const emit = defineEmits<{ (e: "userLogin", value: unknown): void }>()
const router = useRouter()

function emitUserLogin(value: unknown) {
  emit("userLogin", value)
  router.go()
}
</script>
