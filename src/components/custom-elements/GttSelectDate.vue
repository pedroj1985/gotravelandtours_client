<template>
  <div class="gtt__select_date">
    <button
      class="gtt__toggle"
      ref="buttonToggle"
      @click="toggleClicked"
      :value="updateValue"
      :disabled="dsb"
    >
      <div class="gtt__toggle_content">
        <div class="gtt__toggle_text">
          <div class="gtt__toggle_text_first_column">
            <slot name="iconSelectedValue"></slot>
          </div>
          <div class="gtt__toggle_text_second_column twoRows">
            <div class="small">
              <slot name="placeholder">
                Fecha de entrada y salida
              </slot>
            </div>
            <div class="bigDown">
              <span v-if="mode == 'range'">
                {{ constructDates(dates.start, dates.end) }}</span
              >
              <span v-else> {{ constructSingleDate(dates) }}</span>
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
    <div class="gtt-errors">
      <slot name="error"></slot>
    </div>
    <div
      class="gtt__list_area_wrapper"
      v-if="isVisible"
      v-click-outside="handleFocusOut"
    >
      <span class="arrow" v-if="arrow"></span>
      <div class="gtt__date_picker">
        <v-date-picker
          v-model="dates"
          :mode="mode"
          is-inline
          locale="es"
          :min-date="minDate"
          :columns="$screens({ default: 1, lg: mode == 'range' ? 2 : 1 })"
        />
      </div>
      <hr />
      <div v-if="dates" class="displayDate">
        <span v-if="mode == 'range'">{{
          constructDates(dates.start, dates.end)
        }}</span>
        <span v-else>{{ constructSingleDate(dates) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from "vue"
import { clickOutside as vClickOutside } from "@/directives/clickOutside"
import moment from "moment"

const props = withDefaults(defineProps<{
  value?: any
  modelValue?: any
  clickable?: boolean
  opened?: boolean
  dsb?: boolean
  day?: boolean
  mode?: string
  minDate?: string
}>(), {
  clickable: true,
  opened: false,
  dsb: false,
  day: false,
  mode: "range"
})

const emit = defineEmits<{ (e: "input", val: any): void; (e: "update:modelValue", val: any): void }>()

const isVisible = ref(props.opened)
const arrow = ref(true)
const dates = ref(props.modelValue ?? props.value ?? moment())

function toggleClicked(event?: Event) {
  event?.stopPropagation()
  if (props.clickable) isVisible.value = !isVisible.value
}

function handleFocusOut() {
  if (!props.opened) isVisible.value = false
}

function toMoment(date: any) {
  return moment(date)
}

function formatDate(stringDate: any) {
  return toMoment(stringDate).locale("es").format("dddd, DD MMM YYYY")
}

function constructDates(startDate: any, endDate: any) {
  const start = formatDate(startDate)
  const end = formatDate(endDate)
  let diff = toMoment(startDate).diff(toMoment(endDate), "days") * -1
  let dayNightString = ""
  if (diff > 1) dayNightString = props.day ? " días)" : " noches)"
  else dayNightString = props.day ? " día)" : " noche)"
  return start + " - " + end + " (" + diff + dayNightString
}

function constructSingleDate(date: any) {
  return toMoment(date).locale("es").format("DD MMM YYYY")
}

function updateValue() {
  dates.value = props.modelValue ?? props.value ?? moment()
}

function setScreensByMode() {
  return props.mode == "range" ? 2 : 1
}

watch(dates, (val, oldVal) => {
  if (val && val !== oldVal) {
    isVisible.value = false
  }
  if (!val) {
    const fallback = props.minDate || moment().format("DD/MM/YYYY")
    emit("input", fallback)
    emit("update:modelValue", fallback)
    return
  }
  emit("input", val)
  emit("update:modelValue", val)
})

watch(() => props.value, () => {
  updateValue()
})

onMounted(() => {
  if (import.meta.env.DEV) { console.log(props.value) }
  if (import.meta.env.DEV) { console.log(props.opened) }
  isVisible.value = props.opened
})
</script>

<style lang="scss" scoped>
.gtt__select_date {
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

  .bigDown {
    font-size: 16px;
    font-weight: 500;
    color: var(--ds-text-value);
    line-height: 1.3;
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

  &.twoRows {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
}

.gtt__toggle_arrow {
  display: flex;
  align-items: center;
  color: var(--ds-text-secondary);
  font-size: 20px;
  flex-shrink: 0;
}

.gtt__list_area_wrapper {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: calc(100% + 8px);
  z-index: var(--z-dropdown);
  background: var(--color-background-white);
  border-radius: var(--ds-radius-lg);
  box-shadow: var(--ds-shadow-datepicker);
  padding: 16px;
}

.arrow {
  display: none;
}

.displayDate {
  text-align: center;
  font-family: inherit;
  font-size: 13px;
  color: var(--ds-text-primary);
  margin-top: 8px;
}

.gtt-errors {
  margin-top: 4px;
}

/* v-calendar overrides inside the popover */
.gtt__date_picker :deep(.vc-container) {
  border: none;
  font-family: inherit;
}

.gtt__date_picker :deep(.vc-header) {
  padding: 8px 0 12px;
}

.gtt__date_picker :deep(.vc-title) {
  font-size: 16px;
  font-weight: 700;
  color: var(--ds-text-primary);
  text-transform: uppercase;
}

.gtt__date_picker :deep(.vc-arrow) {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--ds-text-primary);
  &:hover { background: var(--ds-bg-hover); }
}

.gtt__date_picker :deep(.vc-weekday) {
  font-size: 12px;
  font-weight: 500;
  color: var(--ds-text-secondary);
  padding: 4px 0;
  text-transform: lowercase;
}

.gtt__date_picker :deep(.vc-day) {
  width: 40px;
  height: 40px;
  text-align: center;
}

.gtt__date_picker :deep(.vc-day-content) {
  width: 40px;
  height: 40px;
  font-size: 14px;
  font-weight: 400;
  color: var(--ds-text-primary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: var(--ds-bg-hover);
  }
}

.gtt__date_picker :deep(.vc-day.is-selected .vc-day-content) {
  background: var(--ds-accent);
  color: #ffffff;
  font-weight: 500;
}

.gtt__date_picker :deep(.vc-day.is-in-range .vc-day-content) {
  background: var(--ds-bg-date-range);
  border-radius: 0;
}

.gtt__date_picker :deep(.vc-day.is-start .vc-day-content) {
  border-radius: 50%;
  background: var(--ds-accent);
  color: #ffffff;
}

.gtt__date_picker :deep(.vc-day.is-end .vc-day-content) {
  border-radius: 50%;
  background: var(--ds-accent);
  color: #ffffff;
}

.gtt__date_picker :deep(.vc-highlight) {
  background: var(--ds-bg-date-range);
}
</style>
