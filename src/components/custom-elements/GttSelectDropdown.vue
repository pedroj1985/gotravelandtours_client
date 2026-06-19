<template>
  <div class="gtt__list_area_div">
    <input
      autofocus
      type="text"
      ref="gttinput"
      class="gtt__list_area_input"
      :value="searchQuery"
      @input="onInput"
      @keyup="submitSearch"
      placeholder="Buscar"
    />
    <ul class="gtt__list_area">
      <li
        v-if="nullable"
        class="gtt__item"
        role="option"
        :aria-selected="isSelected('ALL_ITEMS')"
        id="gtt-option-all"
        @click="$emit('select', 'ALL_ITEMS')"
      >
        {{ $helpers.traducir("Todos") }}
      </li>
      <li
        class="gtt__item"
        role="option"
        v-for="(option, index) in searchResult"
        :key="option.id"
        :aria-selected="isSelected(option)"
        :id="'gtt-option-' + index"
        @click="$emit('select', option)"
      >
        <slot name="option" v-bind:option="option">{{ option }}</slot>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from "vue"

const props = withDefaults(defineProps<{ options?: any[]; nullable?: boolean; searchQuery?: string; opened?: boolean; selectedValue?: any }>(), {
  nullable: false,
  searchQuery: "",
  opened: false
})

const emit = defineEmits<{
  (e: "update:searchQuery", value: string): void
  (e: "search", value: string): void
  (e: "select", option: any): void
}>()

const searchResult = ref<any[]>([])
const gttinput = ref<HTMLInputElement | null>(null)

onMounted(() => {
  searchResult.value = props.options || []
  if (gttinput.value) {
    gttinput.value.focus()
  }
})

watch(() => props.options, (val) => {
  searchResult.value = val || []
})

function isSelected(option: any) {
  if (option === 'ALL_ITEMS') {
    return props.selectedValue === 'ALL_ITEMS'
  }
  if (typeof option === 'object' && typeof props.selectedValue === 'object') {
    return option.id === props.selectedValue.id
  }
  return option === props.selectedValue
}

function onInput(e: Event) {
  const target = e.target as HTMLInputElement
  emit("update:searchQuery", target.value)
  emit("search", target.value)
}

function submitSearch(e: Event) {
  const target = e.target as HTMLInputElement
  const query = target.value
  searchResult.value = (props.options || []).filter((opt: any) =>
    opt.nombre.toLowerCase().includes(query.toLowerCase())
  )
}
</script>

<style lang="scss" scoped>
.gtt__list_area_div {
  @include dropdown-wrapper;
}

ul.gtt__list_area {
  min-height: 100px;
  max-height: 300px;
  min-width: 150px;
  list-style: none;
  text-align: left;
  border-radius: var(--border-radius-lg);
  overflow: auto;
  padding: var(--spacing-md) 0;
  background-color: var(--color-background-white);
  margin-bottom: 0;
  color: var(--color-text-primary);
  padding-left: 0;
  font-family: "Helvetica Neue LT Std-Roman";
  font-size: var(--font-size-sm);
}

.gtt__list_area_input {
  @include gtt-input;
  border: none;
  background: var(--color-background-white);
  padding: var(--spacing-md) var(--spacing-xl);
  border-top-left-radius: var(--border-radius-lg);
  border-top-right-radius: var(--border-radius-lg);
  border-bottom: 1px solid var(--color-border-light);

  &:focus {
    outline: none;
  }
}

li.gtt__item {
  padding: var(--spacing-md) var(--spacing-xl);
  cursor: default;

  &:hover {
    background: var(--color-text-primary);
    color: var(--color-text-light);
  }
}

@media (max-width: 1440px) {
  ul.gtt__list_area {
    font-size: 10px;
    padding: var(--spacing-xs) 0;
  }

  li.gtt__item {
    padding: var(--spacing-xs) var(--spacing-xl);
    cursor: default;
  }
}
</style>
