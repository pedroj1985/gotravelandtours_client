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
      <div class="currentPrices hn-roman">
        {{ constructPrices() }}
      </div>
      <div class="range-inputs">
        <label>{{ localMin }} USD</label>
        <input type="range" :min="min" :max="max" :value="localMin" @input="onMinInput" />
        <input type="range" :min="min" :max="max" :value="localMax" @input="onMaxInput" />
        <label>{{ localMax }} USD</label>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue"

const props = withDefaults(defineProps<{ label?: string; value?: number[]; min?: number; max?: number }>(), {
  min: 0,
  max: 100
})

const emit = defineEmits<{ (e: "input", val: number[]): void }>()

const isOpen = ref(true)
const localMin = ref(props.value ? props.value[0] : props.min)
const localMax = ref(props.value ? props.value[1] : props.max)

watch(() => props.value, (newVal) => {
  if (newVal) {
    localMin.value = newVal[0]
    localMax.value = newVal[1]
  }
}, { deep: true })

function openClose() {
  isOpen.value = !isOpen.value
}

function onMinInput(event: Event) {
  const target = event.target as HTMLInputElement
  localMin.value = Number(target.value)
  emit("input", [localMin.value, localMax.value])
}

function onMaxInput(event: Event) {
  const target = event.target as HTMLInputElement
  localMax.value = Number(target.value)
  emit("input", [localMin.value, localMax.value])
}

function constructPrices() {
  const v = props.value || []
  return (v[0] || 0) + " USD - " + (v[1] || 0) + " USD"
}
</script>
