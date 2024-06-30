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

<script>
import ClickOutside from "vue-click-outside";
import moment from "moment";

export default {
  directives: {
    ClickOutside
  },
  mounted() {
    console.log(this.value)
    this.popupItem = this.$el;
    console.log(this.opened)
    this.isVisible = this.opened
  },
  props: {
    value: {
      default: moment()
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
      default: false,
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
      dates: this.value,
    };
  },
  watch: {
    dates: function(val, oldVal) {
      if (val && val !== oldVal) {
        this.isVisible = false
      }
      if (!val) {
        this.$emit("input", this.minDate);
      }
      this.$emit("input", val);
    },
    value: function(){
      this.updateValue()
    }
  },
  methods: {
    toggleClicked() {
      if(this.clickable)
          this.isVisible = !this.isVisible;
    },
    handleFocusOut() {
      if(!this.opened)
        this.isVisible = false;
    },
    toMoment(date) {
      return moment(date);
    },
    formatDate(stringDate) {
      return this.toMoment(stringDate)
        .locale("es")
        .format("dddd, DD MMM YYYY");
    },
    constructDates(startDate, endDate) {
      let start = this.formatDate(startDate);
      let end = this.formatDate(endDate);
      let diff = this.toMoment(startDate).diff(this.toMoment(endDate), "days") * -1
      let dayNightString = ''
      if(diff>1)
        dayNightString = this.day ? " días)" : " noches)" 
      else
        dayNightString = this.day ? " día)" : " noche)" 
      
      return (
        start +
        " - " +
        end +
        " (" +
        diff
          +
        dayNightString
      );
    },
    constructSingleDate(date) {
      return this.toMoment(date)
        .locale("es")
        .format("DD MMM YYYY");
    },
    updateValue() {
      this.dates = this.value;
    },
    setScreensByMode() {
      return this.mode == "range" ? 2 : 1;
    }
  }
};
</script>

<style scoped>
.gtt__select_date {
  width: 100%;
  position: relative;
  margin-bottom: 15px;
}

.gtt__toggle {
  width: 100%;
  padding-left: 15px;
  padding-right: 7px;
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
  padding: 30px;
  background: #ffffff;
  /* min-height: 500px;*/
  position: absolute;
  border-radius: 10px;
  z-index: 3;
  top: 45px;
  margin-top: 30px;
  box-shadow: 0.5px -1px 15px rgba(0, 0, 0, 50%);
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

.displayDate {
  text-align: center;
  font-family: "Helvetica Neue LT Std-Roman";
  font-size: 14px;
  color: #6d6d6d;
}
@media (max-width: 1440px) {
  .gtt__toggle {
    height: 35px;
    /* margin-bottom: 20px; */
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
  .gtt__list_area_wrapper {
    top: 30px;
    margin-top: 20px;
  }
  .displayDate {
    font-size: 10px;
  }
}
</style>
<style>
.gtt__date_picker .vc-grid-cell-col-1 .vc-pane {
  margin-right: 15px;
}
.gtt__date_picker .vc-grid-cell-col-2 .vc-pane {
  margin-left: 15px;
}
.gtt__date_picker .vc-container {
  font-family: "Helvetica Neue LT Std-Roman";
  line-height: 1.2;
  border: none;
}

.gtt__date_picker .vc-container .vc-title {
  font-size: 16px;
  text-transform: uppercase;
}

.gtt__date_picker .vc-container .vc-weekday {
  font-size: 14px;
  /* color: #6d6d6d !important; */
}

.gtt__date_picker .vc-highlights .vc-highlight {
  background: transparent;
}
.gtt__date_picker .vc-highlights + span {
  background: #bcd01d;
}
.gtt__date_picker .vc-container span {
  color: #212f3d;
  padding: 16px;
  font-size: 14px;
}

.gtt__date_picker .vc-highlights + span:focus {
  background: #bcd01d;
}

.gtt__date_picker hr {
  height: 1px;
  border: none;
  background-color: #c4c4c4;
}

/* .gtt__date_picker .vc-grid-cell + .vc-grid-cell > .vc-pane{
        margin-left: 60px;
    } */
@media (max-width: 1368px) {
  .gtt__date_picker .vc-container .vc-title {
    font-size: 12px;
  }

  .gtt__date_picker .vc-container .vc-weekday {
    font-size: 10px;
    /* color: #6d6d6d !important; */
  }

  .gtt__date_picker .vc-container span {
    padding: 12px;
    font-size: 12px;
  }
}
</style>