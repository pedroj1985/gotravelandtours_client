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
        <div v-if="mode == 'range'" class="date-range-inputs">
          <label class="date-label">Desde:</label>
          <input
            type="date"
            :value="formatDateISO(dates.start)"
            :min="formatDateISO(minDate)"
            @input="onStartDateChange"
            class="date-input"
          />
          <label class="date-label">Hasta:</label>
          <input
            type="date"
            :value="formatDateISO(dates.end)"
            :min="formatDateISO(dates.start || minDate)"
            @input="onEndDateChange"
            class="date-input"
          />
        </div>
        <div v-else class="date-single-input">
          <input
            type="date"
            :value="formatDateISO(dates)"
            :min="formatDateISO(minDate)"
            @input="onSingleDateChange"
            class="date-input"
          />
        </div>
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

<script>
import { clickOutside } from "@/directives/clickOutside";
import moment from "moment";

export default {
  directives: {
    clickOutside
  },
  mounted() {
    this.popupItem = this.$el;
    this.isVisible = this.opened;
  },
  props: {
    modelValue: {
      default() {
        return moment();
      }
    },
    clickable: {
      type: Boolean,
      default: true
    },
    opened: {
      type: Boolean,
      default: false
    },
    dsb: {
      type: Boolean,
      default: false
    },
    day: {
      type: Boolean,
      default: false
    },
    mode: {
      type: String,
      default: "range"
    },
    minDate: {
      default: function() {
        return moment().format("DD/MM/YYYY");
      }
    }
  },
  data() {
    return {
      isVisible: false,
      arrow: true,
      dates: this.modelValue
    };
  },
  watch: {
    // Solo sincroniza el valor interno desde el padre SIN re-emitir,
    // evitando ciclos de realimentación con los watchers del formulario.
    modelValue: function() {
      this.updateValue();
    }
  },
  methods: {
    toggleClicked() {
      if (this.clickable) this.isVisible = !this.isVisible;
    },
    handleFocusOut() {
      if (!this.opened) this.isVisible = false;
    },
    toMoment(date) {
      return moment(date);
    },
    formatDate(stringDate) {
      return this.toMoment(stringDate)
        .locale("es")
        .format("dddd, DD MMM YYYY");
    },
    formatDateISO(date) {
      if (!date) return "";
      return this.toMoment(date).format("YYYY-MM-DD");
    },
    constructDates(startDate, endDate) {
      let start = this.formatDate(startDate);
      let end = this.formatDate(endDate);
      let diff =
        this.toMoment(startDate).diff(this.toMoment(endDate), "days") * -1;
      let dayNightString = "";
      if (diff > 1) dayNightString = this.day ? " días)" : " noches)";
      else dayNightString = this.day ? " día)" : " noche)";

      return start + " - " + end + " (" + diff + dayNightString;
    },
    constructSingleDate(date) {
      if (!date) return "";
      return this.toMoment(date)
        .locale("es")
        .format("DD MMM YYYY");
    },
    updateValue() {
      this.dates = this.modelValue;
    },
    onStartDateChange(e) {
      const val = e.target.value;
      this.dates = { ...this.dates, start: val ? moment(val).toDate() : null };
      this.$emit("update:modelValue", this.dates);
      this.isVisible = false;
    },
    onEndDateChange(e) {
      const val = e.target.value;
      this.dates = { ...this.dates, end: val ? moment(val).toDate() : null };
      this.$emit("update:modelValue", this.dates);
      this.isVisible = false;
    },
    onSingleDateChange(e) {
      const val = e.target.value;
      this.dates = val ? moment(val).toDate() : null;
      this.$emit("update:modelValue", this.dates);
      this.isVisible = false;
    }
  }
};
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
  z-index: var(--z-dropdown);
}

.arrow {
  @include dropdown-arrow;
}

.displayDate {
  text-align: center;
  font-family: "Helvetica Neue LT Std-Roman";
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.date-range-inputs,
.date-single-input {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: var(--spacing-sm);
  flex-wrap: wrap;
}

.date-label {
  font-family: "Helvetica Neue LT Std-Roman";
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
}

.date-input {
  padding: 6px 10px;
  border: 1px solid #c4c4c4;
  border-radius: var(--border-radius-sm);
  font-family: "Helvetica Neue LT Std-Roman";
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
  cursor: pointer;
}

.date-input:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(33, 47, 61, 0.2);
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
