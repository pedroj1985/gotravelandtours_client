<template>
  <div id="second-nav">
    <div class="main-nav custom-margin antonio-bold">
      <div class="menu-content">
        <div
          v-for="menuLink in menuLinks"
          :key="menuLink.name"
          class="menu-item-container"
        >
          <span
            class="marker"
            :class="{ 'not-selected': setLinkSelected(menuLink.name) }"
          ></span>
          <router-link
            :to="{
              name: 'indexLogged',
              params: {
                idPage: menuLink.id,
              },
            }"
            @click="
              changeSelected(menuLink.name);
              scrollTo(menuLink.id);
            "
          >
            {{ menuLink.displayName }}
          </router-link>
          <!-- <a href="#content" @click="changeSelected(menuLink.name)" v-scroll-to="'#'+menuLink.id">{{ menuLink.displayName }}</a> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useScrollStore } from "../../stores/scrollStore";

defineOptions({ name: "NavBar2" });

const props = defineProps<{
  menuLinks?: any[];
}>();

const route = useRoute();
const scrollStore = useScrollStore();

const linkSelected = ref("index");

const activeSection = computed(() => scrollStore.activeSection);

watch(activeSection, (section: any) => {
  changeSelected(section);
});

onMounted(() => {
  let id = route.params.idPage as string;
  if (id) {
    let elment = document.getElementById(id);
    if (import.meta.env.DEV) {
      console.log(elment);
    }
    if (elment) elment.scrollIntoView({ behavior: "smooth" });
  }
});

function scrollTo(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
}

function changeSelected(item: string) {
  linkSelected.value = item;
}

function setLinkSelected(item: string) {
  if (linkSelected.value == item) {
    return false;
  }
  return true;
}
</script>
