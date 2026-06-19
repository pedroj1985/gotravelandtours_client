<template>
  <div class="gtt__select">
    <button
      class="gtt__toggle"
      ref="buttonToggle"
      @click="toggleClicked"
      @keydown="onToggleKeydown"
      :value="updateValue"
      :disabled="isDisabled"
      role="combobox"
      :aria-expanded="isVisible"
      aria-haspopup="listbox"
      aria-controls="gtt-select-listbox"
      :aria-activedescendant="activeDescendant"
      :aria-label="toggleAriaLabel"
    >
      <div class="gtt__toggle_content">
        <div class="gtt__toggle_text" :class="{ 'align-left': alignLeft }">
          <div class="gtt__toggle_text_first_column">
            <slot name="iconSelectedValue"></slot>
          </div>
          <div
            class="gtt__toggle_text_second_column"
            :class="{ twoRows: twoRows }"
          >
            <div
              class="small"
              v-if="twoRows || (twoRows == false && !selectedValue)"
            >
              <slot name="placeholder">
                Seleccione
              </slot>
            </div>
            <div v-if="selectedValue" class="bigDown">
              <template v-if="selectedValue != 'ALL_ITEMS'">
                <slot name="selectedValue" v-bind:selectedValue="selectedValue">
                  <span :title="selectedValue">{{ selectedValue }}</span>
                </slot>
              </template>
              <span v-else>{{ $helpers.traducir("Todos") }}</span>
            </div>
            <div v-else class="bigDown">
              <slot name="selectedPlaceholder"></slot>
            </div>
          </div>
        </div>
        <div class="gtt__toggle_arrow">
          <i
            class="mdi"
            :class="{ 'mdi-menu-down': !isVisible, 'mdi-menu-up': isVisible }"
          ></i>
        </div>
      </div>
    </button>
    <slot name="error"></slot>
    <div
      class="gtt__list_area_wrapper"
      :class="{ isVisible: isVisible }"
      role="listbox"
      id="gtt-select-listbox"
      v-click-outside="handleFocusOut"
    >
      <span class="arrow" v-if="arrow"></span>
      <GttSelectDropdown
        v-if="!search"
        :options="options"
        :nullable="nullable"
        :searchQuery.sync="searchQuery"
        :opened="opened"
        :selectedValue="selectedValue"
        @select="setSelectedValue"
        @search="searchQuery = $event"
      />
      <GttSelectSearch
        v-else
        :options="options"
        :searchQuery.sync="searchQuery"
        :selectedValue="selectedValue"
        @select="setSelectedValue"
        @search="searchQuery = $event"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue"
import { clickOutside as vClickOutside } from "@/directives/clickOutside"
import GttSelectDropdown from "./GttSelectDropdown.vue"
import GttSelectSearch from "./GttSelectSearch.vue"

const props = withDefaults(defineProps<{
  openedLodging?: any
  twoRows?: any
  options?: any[]
  search?: boolean
  clickable?: boolean
  opened?: boolean
  searchFinished?: boolean
  value?: any
  isDisabled?: boolean
  nullable?: boolean
  alignLeft?: boolean
}>(), {
  search: false,
  clickable: true,
  opened: false,
  searchFinished: false,
  isDisabled: false,
  nullable: false,
  alignLeft: false
})

const emit = defineEmits<{
  (e: "update:openedLodging", val: boolean): void
  (e: "input", val: any): void
  (e: "update:searchQuery", val: string): void
}>()

const isVisible = ref(props.opened)
const searchQuery = ref("")
const arrow = ref(true)
const selectedValue = ref(props.value != null ? props.value : "")
const buttonToggle = ref<HTMLElement | null>(null)

const toggleAriaLabel = computed(() => {
  if (selectedValue.value && selectedValue.value !== 'ALL_ITEMS') {
    return typeof selectedValue.value === 'object'
      ? selectedValue.value.nombre || 'Seleccionar'
      : String(selectedValue.value)
  }
  return 'Seleccionar'
})

const activeDescendant = computed(() => {
  if (!isVisible.value || !selectedValue.value || selectedValue.value === 'ALL_ITEMS') {
    return undefined
  }
  const idx = (props.options || []).findIndex((opt: any) => {
    if (typeof opt === 'object' && typeof selectedValue.value === 'object') {
      return opt.id === selectedValue.value.id
    }
    return opt === selectedValue.value
  })
  return idx >= 0 ? `gtt-option-${idx}` : undefined
})

watch(() => props.value, (val) => {
  selectedValue.value = val
})

onMounted(() => {
  updateValue()
})

function updateValue() {
  selectedValue.value = props.value
}

async function toggleClicked() {
  if (props.clickable) {
    isVisible.value = !isVisible.value
    if (isVisible.value == true) {
      emitOpen()
    } else {
      searchQuery.value = ""
      emitClose()
    }
  }
}

function onToggleKeydown(e: KeyboardEvent) {
  if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
    e.preventDefault()
    toggleClicked()
  }
  if (e.key === "Escape") {
    isVisible.value = false
    emitClose()
  }
}

function setSelectedValue(item: any) {
  buttonToggle.value?.focus()
  selectedValue.value = item
  emitValue(selectedValue.value)
  searchQuery.value = ""
  isVisible.value = false
  emitClose()
}

function handleFocusOut() {
  if (!props.opened) {
    isVisible.value = false
    emitClose()
  }
}

function emitClose() {
  emit("update:openedLodging", false)
}

function emitOpen() {
  emit("update:openedLodging", true)
}

function emitValue(value: any) {
  emit("input", value)
}
</script>

<style lang="scss" scoped>
.gtt__select {
  width: 100%;
  position: relative;
  margin-bottom: var(--spacing-md);
}

.gtt__toggle {
  @include gtt-button;
  width: 100%;
  background-color: var(--color-background-white);
  justify-content: flex-start;
  font-size: var(--font-size-md);
  border-radius: var(--border-radius-sm);

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(33, 47, 61, 0.2);
  }
}

.gtt__toggle_content {
  @include flex-between;
  width: 100%;
}

.gtt__toggle_text {
  @include flex-center;
  flex: 1;

  &.align-left {
    justify-content: flex-start;
  }
}

.gtt__toggle_text_first_column,
.gtt__toggle_text_second_column {
  padding-top: 11px;
}

.gtt__toggle_text_second_column {
  text-align: left;
  padding-left: var(--spacing-xs);

  &.twoRows {
    padding-top: var(--spacing-xs);
  }
}

.gtt__toggle_arrow {
  margin-left: auto;
  font-size: 30px;
}

.gtt__list_area_wrapper {
  display: none;
  @include dropdown-wrapper;
  position: absolute;
  left: 0;
  right: 0;
  top: calc(100% + var(--spacing-xs));
  margin-top: 0;
  z-index: var(--z-dropdown);

  &.isVisible {
    display: block;
  }
}

.arrow {
  @include dropdown-arrow;
}

@media (max-width: 1440px) {
  .gtt__toggle {
    height: 35px;
    font-size: var(--font-size-xs);
    padding: var(--spacing-xs) var(--spacing-sm);
    cursor: pointer;
  }

  .arrow {
    top: -12px;
  }

  .gtt__toggle_text {
    padding-top: 0;
  }

  .gtt__toggle_text_first_column,
  .gtt__toggle_text_second_column {
    padding-top: var(--spacing-xs);
  }

  .gtt__toggle_text_second_column .bigDown {
    line-height: var(--line-height-tight);
  }

  .twoRows {
    padding-top: 0;
  }

  .gtt__toggle_arrow {
    font-size: 20px;
  }
}
</style>
