<template>
  <div class="gtt__search_area">
    <input
      type="text"
      :value="searchQuery"
      @input="onInput"
      @keyup="submitSearch"
      placeholder="¿Donde desea alojarse?"
    />
    <ul class="gtt__list_area" v-if="searchQuery">
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
    <div class="no-result-area" v-else>
      <div class="result-area-search-icon">
        <i class="mdi mdi-magnify"></i>
      </div>
      <slot name="no-result-text"
        >Buscar por destino, alojamiento o punto de interés</slot
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from "vue";

const props = withDefaults(
  defineProps<{ options?: any[]; searchQuery?: string; selectedValue?: any }>(),
  { searchQuery: "" },
);

const emit = defineEmits<{
  (e: "update:searchQuery", value: string): void;
  (e: "search", value: string): void;
  (e: "select", option: any): void;
}>();

const searchResult = ref<any[]>([]);

onMounted(() => {
  searchResult.value = props.options || [];
});

watch(
  () => props.options,
  (val) => {
    searchResult.value = val || [];
  },
);

function isSelected(option: any) {
  if (typeof option === "object" && typeof props.selectedValue === "object") {
    return option.id === props.selectedValue.id;
  }
  return option === props.selectedValue;
}

function onInput(e: Event) {
  const target = e.target as HTMLInputElement;
  emit("update:searchQuery", target.value);
  emit("search", target.value);
}

function submitSearch(e: Event) {
  const target = e.target as HTMLInputElement;
  const query = target.value;
  searchResult.value = (props.options || []).filter((opt: any) =>
    opt.nombre.toLowerCase().includes(query.toLowerCase()),
  );
}
</script>

<style lang="scss" scoped>
.gtt__search_area {
  width: 400px;
  text-align: left;
  padding: var(--spacing-xl);
  color: var(--color-text-primary);
  font-family: "Helvetica Neue LT Std-Roman";
  font-size: var(--font-size-sm);

  input {
    @include gtt-input;
    border: none;
    border-bottom: 1px solid var(--color-border);
    border-radius: 0;
    padding-top: var(--spacing-md);
    padding-bottom: var(--spacing-xl);
    font-size: var(--font-size-sm);
  }
}

.result-area-search-icon {
  font-size: 60px;
  color: var(--color-text-secondary);
}

.no-result-area {
  font-size: var(--font-size-xs);
  text-align: center;
  color: var(--color-text-secondary);
  padding-top: 60px;
  line-height: var(--line-height-tight);
}

.gtt__search_result_area {
  overflow: auto;
}

ul.gtt__list_area {
  min-height: 100px;
  max-height: 300px;
  min-width: 150px;
  list-style: none;
  text-align: left;
  overflow: auto;
  padding: var(--spacing-md) 0;
  margin-bottom: 0;
  color: var(--color-text-primary);
  padding-left: 0;
  font-family: "Helvetica Neue LT Std-Roman";
  font-size: var(--font-size-sm);
}

.gtt__search_area ul.gtt__list_area {
  width: 100%;
  height: 100%;
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
