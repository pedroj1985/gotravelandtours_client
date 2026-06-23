<template>
  <div class="gtt__select_form">
    <button
      class="gtt__toggle"
      ref="buttonToggle"
      @click="toggleClicked"
      :value="uValue"
    >
      <div class="gtt__toggle_content">
        <div class="gtt__toggle_text">
          <div class="gtt__toggle_text_first_column">
            <slot name="iconSelectedValue"></slot>
          </div>
          <div class="gtt__toggle_text_second_column twoRows">
            <div class="small">
              <slot name="placeholder">Seleccione</slot>
            </div>
            <div>{{ constructDisplay(emitValue) }}</div>
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
    <div
      class="gtt__list_area_wrapper"
      :class="{ isVisible: isVisible }"
      v-click-outside="handleFocusOut"
    >
      <span class="arrow" v-if="arrow"></span>
      <div class="gtt__form">
        <div class="gtt__item row" v-for="item in finalValue" :key="item.code">
          <div class="gtt__item_label col-md-6">{{ item.label }}</div>
          <div class="col-md-2">
            <button
              class="gtt__picker_button"
              :class="{ disabled: item.value <= 0 }"
              :disabled="item.value <= 0"
              @click="remove(item, item.step)"
            >
              <i class="mdi mdi-minus"></i>
            </button>
          </div>
          <div class="col-md-1">
            <p class="gtt__picker_value">{{ item.value }}</p>
          </div>
          <div class="col-md-2">
            <button class="gtt__picker_button" @click="add(item, item.step)">
              <i class="mdi mdi-plus"></i>
            </button>
          </div>
        </div>
        <div class="gtt__item gtt__itemKids row" v-if="kids.length > 0">
          <div
            class="col-md-6 gtt__kidsSelect"
            v-for="(kid, i) in kids"
            :key="'kid-' + i"
          >
            <gtt-select :options="kidsAgeList" v-model="kid.age">
              <span slot="placeholder">Edad del menor {{ i + 1 }}</span>
              <template v-slot:selectedValue="selectedValue"
                >{{ selectedValue.selectedValue }} años</template
              >
            </gtt-select>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue"
import { clickOutside as vClickOutside } from "@/directives/clickOutside"
import GttSelect from "../custom-elements/GttSelect.vue"
import { constructDisplay } from "../../utils/utils"

const props = withDefaults(defineProps<{ options?: any[]; value?: Record<string, any> | null; modelValue?: Record<string, any> | null }>(), {
  value: null,
  modelValue: null
})

const emit = defineEmits<{ (e: "input", val: any): void; (e: "update:modelValue", val: any): void }>()

const kids = ref<any[]>([])
const kidsAgeList = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
const isChanged = ref(false)
const isVisible = ref(false)
const arrow = ref(true)
const emitValue = ref<Record<string, any>>({})
const finalValue = ref<any[]>([])

const initialValue = props.modelValue ?? props.value
if (!initialValue) {
  for (let index = 0; index < (props.options || []).length; index++) {
    const opt = props.options![index]
    finalValue.value.push({
      code: opt.code,
      label: opt.label,
      display: opt.display,
      value: opt.default
    })
  }
} else {
  for (const item of Object.entries(initialValue.value)) {
    finalValue.value.push(item[1])
  }
}

finalValue.value.forEach(element => {
  updateValue(element)
})

watch(() => props.value, (v) => {
  if (v) {
    finalValue.value = []
    for (const item of Object.entries(v)) {
      finalValue.value.push(item[1])
    }
  }
  finalValue.value.forEach(element => {
    updateValue(element)
  })
})


function toggleClicked(event?: Event) {
  event?.stopPropagation()
  isVisible.value = !isVisible.value
}

function handleFocusOut() {
  isVisible.value = false
}

function uValue() {
  emitValue.value = props.value || {}
}

function updateValue(item: any) {
  emitValue.value[item.code] = {
    display: item.display,
    code: item.code,
    label: item.label,
    value: item.value
  }
  emit("input", emitValue.value)
  emit("update:modelValue", emitValue.value)
}

function add(item: any, step = 1) {
  if (item.code == "kids") {
    kids.value.push({ age: null })
  }
  item.value += step
  isChanged.value = true
  updateValue(item)
}

function remove(item: any, step = 1) {
  if (item.code == "kids") {
    kids.value.pop()
  }
  const r = item.value - step
  if (r >= 1 && item.code != "kids") {
    item.value -= step
    isChanged.value = true
    updateValue(item)
  } else if (r >= 0 && item.code == "kids") {
    item.value -= step
    isChanged.value = true
    updateValue(item)
  }
}
</script>

<style lang="scss" scoped>
.gtt__select_form {
  width: 100%;
  position: relative;
}

.gtt__toggle {
  width: 100%;
  height: 44px;
  padding: 0 12px;
  border: none;
  border-bottom: 1px solid var(--ds-border);
  background-color: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: inherit;

  &:focus {
    outline: none;
    border-bottom-color: var(--ds-border-focus);
  }

  &:hover {
    border-bottom-color: var(--ds-text-secondary);
  }
}

.gtt__toggle_content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.gtt__toggle_text {
  display: flex;
  align-items: center;
  gap: 8px;
  text-align: left;

  .small {
    font-size: 12px;
    color: var(--ds-text-secondary);
    line-height: 1.2;
  }

  > div:last-child {
    font-size: 16px;
    font-weight: 500;
    color: var(--ds-text-value);
  }
}

.gtt__toggle_text_first_column {
  display: flex;
  align-items: center;
  color: var(--ds-text-secondary);
  font-size: 16px;
}

.gtt__toggle_text_second_column {
  flex: 1;
  min-width: 0;
}

.twoRows {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.gtt__toggle_arrow {
  display: flex;
  align-items: center;
  color: var(--ds-text-secondary);
  font-size: 20px;
  flex-shrink: 0;
}

.gtt__list_area_wrapper {
  display: none;
  position: absolute;
  left: 0;
  right: 0;
  top: calc(100% + 4px);
  z-index: var(--z-dropdown);
  background: var(--color-background-white);
  border-radius: var(--ds-radius-md);
  box-shadow: var(--ds-shadow-dropdown);

  &.isVisible {
    display: block;
  }
}

.arrow {
  display: none;
}

.gtt__form {
  padding: 20px 16px;
  background: var(--color-background-white);
  font-family: inherit;
  color: var(--ds-text-primary);
  font-size: 14px;
  min-width: 280px;
}

.gtt__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
}

.gtt__item_label {
  font-size: 14px;
  font-weight: 500;
  color: var(--ds-text-primary);
}

.gtt__item :deep(.col-md-2),
.gtt__item :deep(.col-md-1) {
  display: flex;
  align-items: center;
  justify-content: center;
}

.gtt__picker_button {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid var(--ds-border);
  background: var(--color-background-white);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--ds-text-primary);
  font-size: 16px;
  transition: border-color var(--transition-fast), background-color var(--transition-fast);

  i.mdi {
    font-size: 18px;
    line-height: 1;
  }

  &.disabled {
    opacity: 0.4;
    cursor: not-allowed;
    pointer-events: none;
  }

  &:hover:not(.disabled) {
    border-color: var(--ds-accent);
    background-color: var(--ds-bg-hover);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
  }
}

.gtt__picker_value {
  width: 24px;
  text-align: center;
  font-size: 16px;
  font-weight: 600;
  color: var(--ds-text-primary);
  margin: 0;
}

.gtt__itemKids {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid var(--ds-border);
}

.gtt__kidsSelect {
  margin-bottom: 8px;
}
</style>
