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

<style scoped>
.gtt__select {
  width: 100%;
  position: relative;
  margin-bottom: 15px;
}

.gtt__toggle {
  width: 100%;
  padding-left: 15px;
  padding-right: 15px;
  height: 50px;
  background-color: #ffffff;
  border: 1px solid #c4c4c4;
  border-radius: 5px;
  font-family: "Helvetica Neue LT Std-Roman";
  font-size: 16px;
  cursor: pointer;
}
.gtt__toggle:focus {
  outline: none;
  box-shadow: 0px 0px 2px #212f3d;
}
.gtt__toggle_content {
  display: flex;
}
.gtt__toggle_text {
  display: flex;
  float: left;
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
.gtt__list_area_div {
  background: white;
  border-radius: 10px;
}
.gtt__list_area_wrapper {
  position: absolute;
  border-radius: 10px;
  z-index: 3;
  top: 45px;
  margin-top: 30px;
  box-shadow: 0.5px -1px 15px rgba(0, 0, 0, 50%);
  display: none;
}
.isVisible {
  display: block;
}
.arrow {
  position: absolute;
  z-index: 1000;
  top: -15px;
  left: 10%;
  width: 0;
  height: 0;
  border-left: 15px solid transparent;
  border-right: 15px solid transparent;
  border-bottom: 15px solid #ffffff;
}
.gtt__search_area {
  /* height: 300px; */
  width: 400px;
  text-align: left;
  padding-left: 30px;
  padding-right: 30px;
  padding-top: 30px;
  color: #212f3d;
  padding-bottom: 30px;
  border-radius: 10px;
  background-color: #ffffff;
  font-family: "Helvetica Neue LT Std-Roman";
  font-size: 14px;
}
.result-area-search-icon {
  font-size: 60px;
  color: #6d6d6d;
}
.gtt__search_area input {
  border: none;
  width: 100%;
  padding-top: 15px;
  padding-bottom: 30px;
  font-size: 14px;
  border-bottom: 1px solid #c4c4c4;
}

.no-result-area {
  font-size: 12px;
  text-align: center;
  color: #6d6d6d;
  padding-top: 60px;
  line-height: 1.2;
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
  border-radius: 10px;
  overflow: auto;
  padding-top: 15px;
  padding-bottom: 15px;
  background-color: #ffffff;
  margin-bottom: 0;
  color: #212f3d;
  padding-left: 0;
  font-family: "Helvetica Neue LT Std-Roman";
  font-size: 14px;
}
.gtt__list_area_input {
  width: 100%;
  border: none;
  background: white;
  padding-left: 30px;
  padding-top: 15px;
  padding-right: 30px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  border-bottom: 1px solid #cacaca;
}
.gtt__list_area_input:focus {
  outline: none;
}
.gtt__search_area ul.gtt__list_area {
  width: 100%;
  height: 100%;
}
li.gtt__item {
  padding-left: 30px;
  padding-right: 30px;
  padding-bottom: 15px;
  padding-top: 15px;
  cursor: default;
}

li.gtt__item:hover {
  background: #212f3d;
  color: #ffffff;
}

@media (max-width: 1440px) {
  .gtt__toggle {
    height: 35px;
    font-size: 12px;
    padding-left: 8px;
    padding-right: 8px;
    /* margin-bottom: 20px; */
    cursor: pointer;
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
  .gtt__toggle_text_second_column .bigDown {
    line-height: 1;
  }
  .twoRows {
    padding-top: 0px;
  }
  .gtt__toggle_arrow {
    font-size: 20px;
  }
  .gtt__list_area_wrapper {
    top: 30px;
    margin-top: 20px;
  }
  ul.gtt__list_area {
    font-size: 10px;
    padding-top: 7px;
    padding-bottom: 7px;
  }
  li.gtt__item {
    padding-left: 30px;
    padding-right: 30px;
    padding-bottom: 8px;
    padding-top: 8px;
    cursor: default;
  }
}
</style>
