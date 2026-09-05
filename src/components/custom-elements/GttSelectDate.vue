<template>
  <div class="gtt__select_date" v-click-outside="handleFocusOut">
    <button
      type="button"
      class="gtt__toggle"
      ref="buttonToggle"
      @click="toggleClicked"
      :value="undefined"
      :disabled="dsb"
    >
      <div class="gtt__toggle_content">
        <div class="gtt__toggle_text">
          <div class="gtt__toggle_text_first_column">
            <slot name="iconSelectedValue"></slot>
          </div>
          <div class="gtt__toggle_text_second_column twoRows">
            <div class="small">
              <slot name="placeholder"> Fecha de entrada y salida </slot>
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
    <div class="gtt__list_area_wrapper" v-if="isVisible">
      <span class="arrow" v-if="arrow"></span>
      <div class="gtt__date_picker" :data-mode="mode">
        <VDatePicker
          v-model="dates"
          :is-range="mode === 'range'"
          :mode="'date'"
          is-inline
          is-required
          :min-date="minDate"
          locale="es"
          :masks="{ weekdays: 'WWW', title: 'MMMM' }"
          :columns="mode === 'range' ? 2 : 1"
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
import { ref, watch, onMounted, computed } from "vue";
import moment from "moment";

const props = withDefaults(
  defineProps<{
    modelValue?: any;
    clickable?: boolean;
    opened?: boolean;
    dsb?: boolean;
    day?: boolean;
    mode?: string;
    minDate?: string;
  }>(),
  {
    clickable: true,
    opened: false,
    dsb: false,
    day: false,
    mode: "range",
  },
);

const emit = defineEmits<{
  (e: "update:modelValue", val: any): void;
}>();

const isVisible = ref(props.opened);
const arrow = ref(true);
const dates = ref(
  props.modelValue !== undefined
    ? props.modelValue
    : props.mode === "range"
      ? { start: moment().toDate(), end: moment().add(1, "day").toDate() }
      : moment().toDate(),
);

const boundValue = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit("update:modelValue", value);
  },
});

function toggleClicked() {
  if (props.clickable) isVisible.value = !isVisible.value;
}

function handleFocusOut() {
  if (!props.opened) isVisible.value = false;
}

function toMoment(date: any) {
  return moment(date);
}

function formatDate(stringDate: any) {
  return toMoment(stringDate).locale("es").format("dddd, DD MMM YYYY");
}

function constructDates(startDate: any, endDate: any) {
  const start = formatDate(startDate);
  const end = formatDate(endDate);
  let diff = toMoment(startDate).diff(toMoment(endDate), "days") * -1;
  let dayNightString = "";
  if (diff > 1) dayNightString = props.day ? " días)" : " noches)";
  else dayNightString = props.day ? " día)" : " noche)";
  return start + " - " + end + " (" + diff + dayNightString;
}

function constructSingleDate(date: any) {
  return toMoment(date).locale("es").format("DD MMM YYYY");
}

function updateValue() {
  if (props.modelValue !== undefined) {
    dates.value = props.modelValue;
  } else if (props.mode === "range") {
    dates.value = {
      start: moment().toDate(),
      end: moment().add(1, "day").toDate(),
    };
  } else {
    dates.value = moment().toDate();
  }
}

function emitValue(value: any) {
  boundValue.value = value;
}

watch(dates, (val, oldVal) => {
  if (val && val !== oldVal) {
    isVisible.value = false;
  }
  if (!val) {
    emitValue(props.minDate || moment().format("DD/MM/YYYY"));
  } else {
    emitValue(val);
  }
});

watch(
  () => props.modelValue,
  () => {
    updateValue();
  },
);

onMounted(() => {
  isVisible.value = props.opened;
});
</script>

<style lang="scss" scoped>
.gtt__select_date {
  width: 100%;
  position: relative;
  margin-bottom: var(--spacing-md);
}

.gtt__toggle {
  @include gtt-button;
  width: 100%;
  padding-right: 7px;
  border-radius: var(--border-radius-sm);
  justify-content: flex-start;

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
  display: flex;
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
  @include dropdown-wrapper;
  position: absolute;
  left: 0;
  right: 0;
  top: calc(100% + var(--spacing-xs));
  margin-top: 0;
  padding: 0;
  z-index: var(--z-dropdown);
}

.arrow {
  @include dropdown-arrow;
}

.gtt__date_picker {
  padding: var(--spacing-sm) var(--spacing-md);
}

.displayDate {
  text-align: center;
  font-family: "Helvetica Neue LT Std-Roman";
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  padding: var(--spacing-md);
}

.gtt__list_area_wrapper hr {
  height: 1px;
  border: none;
  background-color: #c4c4c4;
  margin: 0;
  width: 100%;
}

@media (max-width: 1440px) {
  .gtt__toggle {
    height: 35px;
    font-size: var(--font-size-xs);
    padding: var(--spacing-xs) var(--spacing-sm);
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

  .gtt__toggle_arrow {
    font-size: 20px;
  }

  .displayDate {
    font-size: 10px;
  }
}
</style>
