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
        v-model:searchQuery="searchQuery"
        :opened="opened"
        :selectedValue="selectedValue"
        @select="setSelectedValue"
        @search="searchQuery = $event"
      />
      <GttSelectSearch
        v-else
        :options="options"
        v-model:searchQuery="searchQuery"
        :selectedValue="selectedValue"
        @select="setSelectedValue"
        @search="searchQuery = $event"
      />
    </div>
  </div>
</template>

<script>
import { clickOutside } from "@/directives/clickOutside";
import GttSelectDropdown from "./GttSelectDropdown";
import GttSelectSearch from "./GttSelectSearch";

export default {
  components: {
    GttSelectDropdown,
    GttSelectSearch
  },
  directives: {
    clickOutside
  },
  created() {
    this.isVisible = this.opened;
  },
  mounted() {
    this.popupItem = this.$el;
    this.updateValue();
  },
  watch: {
    modelValue: function(val) {
      this.selectedValue = val;
    }
  },
  props: {
    openedLodging: {
      default: false
    },
    twoRows: {
      default: true
    },
    options: {
      type: Array
    },
    search: {
      type: Boolean,
      default: false
    },
    clickable: {
      type: Boolean,
      default: true
    },
    opened: {
      type: Boolean,
      default: false
    },
    searchFinished: {
      type: Boolean,
      default: false
    },
    modelValue: {
      default: null
    },
    isDisabled: {
      type: Boolean,
      default: false
    },
    nullable: {
      type: Boolean,
      default: false
    },
    alignLeft: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    toggleAriaLabel() {
      if (this.selectedValue && this.selectedValue !== 'ALL_ITEMS') {
        return typeof this.selectedValue === 'object'
          ? this.selectedValue.nombre || 'Seleccionar'
          : String(this.selectedValue);
      }
      return 'Seleccionar';
    },
    activeDescendant() {
      if (!this.isVisible || !this.selectedValue || this.selectedValue === 'ALL_ITEMS') {
        return undefined;
      }
      const idx = this.options.findIndex(opt => {
        if (typeof opt === 'object' && typeof this.selectedValue === 'object') {
          return opt.id === this.selectedValue.id;
        }
        return opt === this.selectedValue;
      });
      return idx >= 0 ? `gtt-option-${idx}` : undefined;
    }
  },
  data() {
    return {
      isVisible: false,
      searchQuery: "",
      arrow: true,
      selectedValue: ""
    };
  },
  methods: {
    async toggleClicked() {
      if (this.clickable) {
        this.isVisible = !this.isVisible;
        if (this.isVisible == true) {
          this.emitOpen();
        } else {
          this.searchQuery = "";
          this.emitClose();
        }
      }
    },
    onToggleKeydown(e) {
      if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
        e.preventDefault();
        this.toggleClicked();
      }
      if (e.key === "Escape") {
        this.isVisible = false;
        this.emitClose();
      }
    },
    setSelectedValue(item) {
      this.$refs["buttonToggle"].focus();
      this.selectedValue = item;
      this.emitValue(this.selectedValue);
      this.searchQuery = "";
      this.isVisible = false;
      this.emitClose();
    },
    handleFocusOut() {
      if (!this.opened) {
        this.isVisible = false;
        this.emitClose();
      }
    },
    updateValue() {
      this.selectedValue = this.modelValue;
    },
    emitClose() {
      this.$emit("update:openedLodging", false);
    },
    emitOpen() {
      this.$emit("update:openedLodging", true);
    },
    emitValue(value) {
      this.$emit("update:modelValue", value);
    }
  }
};
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
