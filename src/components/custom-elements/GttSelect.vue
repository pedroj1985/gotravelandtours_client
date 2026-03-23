<template>
  <div class="gtt__select">
    <button
      class="gtt__toggle"
      ref="buttonToggle"
      @click="toggleClicked"
      :value="updateValue"
      :disabled="isDisabled"
    >
      <div class="gtt__toggle_content">
        <div class="gtt__toggle_text">
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
      v-click-outside="handleFocusOut"
    >
      <span class="arrow" v-if="arrow"></span>
      <div v-if="!search" class="gtt__list_area_div">
        <input
          autofocus
          type="text"
          ref="gttinput"
          class="gtt__list_area_input"
          v-model="searchQuery"
          @keyup="submitSearch"
          placeholder="Buscar"
        />
        <ul class="gtt__list_area">
          <li
            v-if="nullable"
            class="gtt__item"
            @click="setSelectedValue('ALL_ITEMS')"
          >
            {{ $helpers.traducir("Todos") }}
          </li>
          <li
            class="gtt__item"
            v-for="option in searchResult"
            :key="option.id"
            @click="
              if (option.hasOwnProperty('value')) {
                setSelectedValue(option);
              } else {
                setSelectedValue(option);
              }
            "
          >
            <slot name="option" v-bind:option="option">{{ option }}</slot>
          </li>
        </ul>
      </div>
      <div class="gtt__search_area" v-else>
        <input
          type="text"
          v-model="searchQuery"
          @keyup="submitSearch"
          placeholder="¿Donde desea alojarse?"
        />
        <ul class="gtt__list_area" v-if="searchQuery">
          <li
            class="gtt__item"
            v-for="option in searchResult"
            :key="option.id"
            @click="
              if (option.hasOwnProperty('value')) {
                setSelectedValue(option);
              } else {
                setSelectedValue(option);
              }
            "
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
    </div>
  </div>
</template>

<script>
import ClickOutside from "vue-click-outside";
// import {HTTP} from '../../utils/auth'

export default {
  directives: {
    ClickOutside,
  },
  created() {
    this.isVisible = this.opened;
  },
  mounted() {
    this.popupItem = this.$el;
    this.searchResult = this.options;
    this.updateValue();
    this.focusInputSearch();
  },
  watch: {
    options: function(val) {
      this.searchResult = val;
    },
    value: function(val) {
      this.selectedValue = val;
    },
  },
  props: {
    openedLodging: {
      default: false,
    },
    twoRows: {
      default: true,
    },
    options: {
      type: Array,
    },
    search: {
      type: Boolean,
      default: false,
    },
    clickable: {
      type: Boolean,
      default: true,
    },
    opened: {
      type: Boolean,
      default: false,
    },
    searchFinished: {
      type: Boolean,
      default: false,
    },
    value: {
      default: null,
    },
    isDisabled: {
      type: Boolean,
      default: false,
    },
    nullable: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isVisible: false,
      searchResult: [],
      searchQuery: "",
      arrow: true,
      selectedValue: "",
    };
  },
  methods: {
    submitSearch() {
      let result = this.options.filter((e) => {
        return e.nombre.toLowerCase().includes(this.searchQuery.toLowerCase());
      });

      this.searchResult = result;
    },
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
      this.selectedValue = this.value;
    },
    emitClose() {
      this.$emit("update:openedLodging", false);
    },
    emitOpen() {
      this.$emit("update:openedLodging", true);
    },
    focusInputSearch() {
      this.$refs.gttinput.focus();
    },
    emitValue(value) {
      this.$emit("input", value);
    },
  },
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

.gtt__list_area_div {
  @include dropdown-wrapper;
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

.gtt__search_area {
  width: 400px;
  text-align: left;
  padding: var(--spacing-xl);
  color: var(--color-text-primary);
  border-radius: var(--border-radius-lg);
  background-color: var(--color-background-white);
  font-family: 'Helvetica Neue LT Std-Roman';
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
  border-radius: var(--border-radius-lg);
  overflow: auto;
  padding: var(--spacing-md) 0;
  background-color: var(--color-background-white);
  margin-bottom: 0;
  color: var(--color-text-primary);
  padding-left: 0;
  font-family: 'Helvetica Neue LT Std-Roman';
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
