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
  background: var(--color-background-white);
}

ul.gtt__list_area {
  max-height: 240px;
  list-style: none;
  text-align: left;
  overflow: auto;
  padding: 4px 0;
  margin: 0;
  padding-left: 0;
  font-family: inherit;
  font-size: 14px;
  color: var(--ds-text-primary);
}

.gtt__list_area_input {
  display: none;
}

li.gtt__item {
  height: 40px;
  padding: 0 16px;
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 14px;
  color: var(--ds-text-primary);
  transition: background-color var(--transition-fast);

  &:hover {
    background-color: var(--ds-bg-hover);
  }

  &[aria-selected="true"] {
    background-color: var(--ds-accent-bg);
    color: var(--ds-accent);
    font-weight: 600;
  }
}

li.gtt__item + li.gtt__item {
  border-top: 1px solid var(--ds-border);
}
</style>
