<template>
  <div class="gtt__select_form">
    <button
      class="gtt__toggle"
      ref="buttonToggle"
      @click="toggleClicked"
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
              :class="{ disabled: tempValue(item.code) <= 0 }"
              :disabled="tempValue(item.code) <= 0"
              @click="change(item.code, -1)"
            >
              <i class="mdi mdi-minus"></i>
            </button>
          </div>
          <div class="col-md-1">
            <p class="gtt__picker_value">{{ tempValue(item.code) }}</p>
          </div>
          <div class="col-md-2">
            <button
              class="gtt__picker_button"
              :class="{ disabled: tempValue(item.code) >= 10 }"
              :disabled="tempValue(item.code) >= 10"
              @click="change(item.code, 1)"
            >
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
              <template #placeholder>Edad del menor {{ i + 1 }}</template>
              <template v-slot:selectedValue="selectedValue"
                >{{ selectedValue.selectedValue }} años</template
              >
            </gtt-select>
          </div>
        </div>
        <div class="gtt__form_actions">
          <button class="gtt__picker_button gtt__form_accept" @click="accept">
            Aceptar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { clickOutside } from "@/directives/clickOutside";
import GttSelect from "../custom-elements/GttSelect";
import { constructDisplay } from "../../utils/utils";

export default {
  components: {
    GttSelect
  },
  directives: {
    clickOutside
  },
  mounted() {
    this.popupItem = this.$el;
  },
  props: {
    options: Array,
    modelValue: {
      type: Object,
      default: null
    }
  },
  watch: {
    modelValue(v) {
      if (v) {
        this.emitValue = v;
      }
    }
  },
  created() {
    for (let index = 0; index < this.options.length; index++) {
      let option = this.options[index];
      this.finalValue.push({
        code: option.code,
        label: option.label,
        display: option.display,
        value: option.default
      });
    }

    if (this.modelValue) {
      for (const item of Object.entries(this.modelValue)) {
        this.emitValue[item[0]] = item[1];
      }
    } else {
      this.finalValue.forEach(element => {
        this.emitValue[element.code] = {
          display: element.display,
          code: element.code,
          label: element.label,
          value: element.value
        };
      });
    }
    this.$emit("update:modelValue", this.emitValue);
    this.snapshotTemp();
  },
  data() {
    return {
      kids: [],
      kidsAgeList: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
      isVisible: false,
      arrow: true,
      emitValue: {},
      finalValue: [],
      tempAdults: 1,
      tempChildren: 0
    };
  },
  methods: {
    constructDisplay,
    toggleClicked() {
      this.isVisible = !this.isVisible;
      if (this.isVisible) {
        this.snapshotTemp();
      }
    },
    handleFocusOut(event) {
      if (!event || !this.$el.contains(event.target)) {
        this.isVisible = false;
      }
    },
    getModelValue(code) {
      return this.modelValue && this.modelValue[code]
        ? this.modelValue[code].value
        : undefined;
    },
    defaultValue(code, fallback) {
      const item = this.finalValue.find(i => i.code === code);
      const value = item ? item.value : undefined;
      return typeof value === "number" ? value : fallback;
    },
    snapshotTemp() {
      const adults = this.getModelValue("adults");
      const children = this.getModelValue("kids");
      this.tempAdults =
        typeof adults === "number" ? adults : this.defaultValue("adults", 1);
      this.tempChildren =
        typeof children === "number" ? children : this.defaultValue("kids", 0);
      this.syncKidsAges();
    },
    syncKidsAges() {
      const count = Math.max(0, this.tempChildren);
      while (this.kids.length < count) {
        this.kids.push({ age: null });
      }
      if (this.kids.length > count) {
        this.kids.splice(count);
      }
    },
    tempValue(code) {
      return code === "adults" ? this.tempAdults : this.tempChildren;
    },
    change(code, delta) {
      if (code === "adults") {
        this.tempAdults = Math.min(10, Math.max(0, this.tempAdults + delta));
      } else if (code === "kids") {
        this.tempChildren = Math.min(
          10,
          Math.max(0, this.tempChildren + delta)
        );
        this.syncKidsAges();
      }
    },
    accept() {
      if (this.tempAdults === 0 && this.tempChildren === 0) {
        this.tempAdults = 1;
      }
      this.emitValue = {};
      this.finalValue.forEach(element => {
        const value =
          element.code === "adults"
            ? this.tempAdults
            : element.code === "kids"
            ? this.tempChildren
            : element.value;
        this.emitValue[element.code] = {
          display: element.display,
          code: element.code,
          label: element.label,
          value
        };
      });
      this.$emit("update:modelValue", this.emitValue);
      this.isVisible = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.gtt__select_form {
  width: 100%;
  position: relative;
  margin-bottom: var(--spacing-md);
}

.gtt__toggle {
  @include gtt-button;
  width: 100%;
  margin-bottom: var(--spacing-xl);
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
  float: left;
  display: flex;
}
.gtt__toggle_text_first_column,
.gtt__toggle_text_second_column {
  padding-top: 11px;
}
.gtt__toggle_text_second_column {
  text-align: left;
  padding-left: 5px;
}

.twoRows {
  padding-top: 2px;
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

.gtt__form {
  padding: var(--spacing-xl);
  position: relative;
  background: var(--color-background-white);
  min-width: 450px;
  min-height: 150px;
  border-radius: var(--border-radius-lg);
  font-family: "Helvetica Neue LT Std-Roman";
  color: var(--color-text-primary);
  font-size: var(--font-size-sm);
  line-height: var(--line-height-tight);
}

.gtt__picker_button {
  width: 48px;
  height: 48px;
  border-radius: 100%;
  border: 1px solid var(--color-text-primary);
  background: var(--color-background-white);
  font-size: var(--font-size-sm);
  font-family: "Helvetica Neue LT Std-Roman";
  color: var(--color-text-primary);

  &.disabled {
    color: var(--color-border);
    border: 1px solid var(--color-border);
  }
}

.gtt__picker_button:focus {
  outline: none;
}
.gtt__picker_button:hover {
  color: #c4c4c4;
  border: 1px solid #c4c4c4;
}

@media (max-width: 1440px) {
  .gtt__toggle {
    height: 35px;
    margin-bottom: 20px;
    font-size: 12px;
    padding-left: 8px;
    padding-right: 8px;
  }
  .arrow {
    top: -12px;
  }
  .gtt__toggle_text {
    padding-top: 0px;
  }
  .gtt__toggle_text_first_column,
  .gtt__toggle_text_second_column {
    padding-top: 5px;
  }
  .twoRows {
    padding-top: 0px;
  }
  .gtt__toggle_arrow {
    font-size: 20px;
  }
  .gtt__form {
    padding: 15px;
    font-size: 12px;
  }
  .gtt__picker_button {
    width: 36px;
    height: 36px;
    font-size: 12px;
  }
  .gtt__itemKids {
    margin-top: 30px;
    width: 100%;
    margin-left: 0px;
  }
  .gtt__kidsSelect {
    padding-right: 5px;
    padding-left: 0;
    height: 50px;
    margin-bottom: 5px;
  }
}
</style>
