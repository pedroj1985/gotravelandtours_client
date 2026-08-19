<template>
  <div class="input-wrapper">
    <div class="input-header">
      <div class="input-label mr-auto">{{ label }}</div>
      <div class="input-open-close-button ml-auto" @click="openClose">
        <i
          class="mdi"
          :class="{ 'mdi-chevron-up': isOpen, 'mdi-chevron-down': !isOpen }"
        ></i>
      </div>
    </div>
    <div class="input-content" v-show="isOpen">
      <div class="stars-line">
        <div class="stars-align">
          <span
            class="star-button"
            ref="star"
            data-value="1"
            @click="updateValue"
            ><i class="mdi mdi-star"></i
          ></span>
          <span
            class="star-button"
            ref="star"
            data-value="2"
            @click="updateValue"
            ><i class="mdi mdi-star"></i
          ></span>
          <span
            class="star-button"
            ref="star"
            data-value="3"
            @click="updateValue"
            ><i class="mdi mdi-star"></i
          ></span>
          <span
            class="star-button"
            ref="star"
            data-value="4"
            @click="updateValue"
            ><i class="mdi mdi-star"></i
          ></span>
          <span
            class="star-button"
            ref="star"
            data-value="5"
            @click="updateValue"
            ><i class="mdi mdi-star"></i
          ></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

const props = withDefaults(
  defineProps<{ label?: string; placeholder?: string; value?: number }>(),
  { value: 0 },
);

const emit = defineEmits<{ (e: "input", val: string): void }>();

const isOpen = ref(true);
const currentValue = ref(props.value);

onMounted(() => {
  currentValue.value = props.value;
});

function openClose() {
  isOpen.value = !isOpen.value;
}

function updateValue(event: Event) {
  const target = event.currentTarget as HTMLElement;
  currentValue.value = Number(target.getAttribute("data-value"));
  setActiveStars();
  emit("input", target.getAttribute("data-value") as string);
}

function setActiveStars() {
  const current = currentValue.value;
  document.querySelectorAll<HTMLElement>(".star-button").forEach(function (el) {
    const v = Number(el.getAttribute("data-value"));
    if (v <= current) {
      el.classList.add("active");
    } else {
      el.classList.remove("active");
    }
  });
}
</script>
