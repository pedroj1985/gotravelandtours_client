<template>
  <div class="gtt__select_form">
    <button
      class="gtt__toggle"
      ref="buttonToggle"
      @click="toggleClicked"
      :value="uValue"
      :disabled="dsb"
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
            <div>{{ constructDisplay() }}</div>
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
        <div
          class="gtt__item gtt__room"
          v-for="(i, index) in roomsLayout"
          :key="i.id"
        >
          <div class="gtt__room_name">Habitación {{ i.room }}</div>
          <div
            class="row gtt__room_row"
            v-for="item in i.layout"
            :key="item.id"
          >
            <div class="gtt__item_label col-md-6">{{ item.label }}</div>
            <div class="col-md-2">
              <button
                class="gtt__picker_button"
                :class="{
                  disabled:
                    (item.value <= 1 &&
                      roomsLayout.length == 1 &&
                      item.code == 'adults') ||
                    (item.code == 'kids' && item.value == 0)
                }"
                :disabled="
                  (item.value <= 1 &&
                    roomsLayout.length == 1 &&
                    item.code == 'adults') ||
                    (item.code == 'kids' && item.value == 0)
                "
                @click="remove(item, index)"
              >
                <i class="mdi mdi-minus"></i>
              </button>
            </div>
            <div class="col-md-1">
              <p class="gtt__picker_value">{{ item.value }}</p>
            </div>
            <div class="col-md-2">
              <button
                class="gtt__picker_button"
                @click="add(item, index)"
                :class="{ disabled: item.code == 'kids' && item.value >= 2 }"
                :disabled="item.code == 'kids' && item.value >= 2"
              >
                <i class="mdi mdi-plus"></i>
              </button>
            </div>
          </div>
        </div>
        <div class="display text-center antonio-bold mt-4">
          {{ constructDisplay() }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ClickOutside from "vue-click-outside";
// import GttSelect from '../custom-elements/GttSelect';
import _ from "lodash";

export default {
  components: {
    // GttSelect
  },
  directives: {
    ClickOutside
  },
  mounted() {
    this.popupItem = this.$el;
  },
  watch: {
    rooms: function(item) {
      let d = item - this.roomsLayout.length;
      let r = [];
      if (d > 0) {
        for (
          let i = this.roomsLayout.length + 1;
          i <= this.roomsLayout.length + d;
          i++
        ) {
          let Hs = [];
          for (let pos = 0; pos < this.options.length; pos++) {
            let code = this.options[pos].code;
            let d = this.options[pos].default;
            Hs.push({
              code: code,
              label: this.options[pos].label,
              display: this.options[pos].display,
              value: d
            });
          }
          // console.log(this.roomsLayout)
          r.push({
            room: i,
            layout: Hs
          });
        }

        r.forEach(j => {
          this.roomsLayout.push(j);
        });
      } else if (d < 0) {
        for (let o = 1; o <= Math.abs(d); o++) {
          this.roomsLayout.pop();
        }
      }
      this.updateValue();
    }
  },
  props: {
    dsb: {
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
    options: Array,
    value: {
      type: Array,
      default: function() {
        return [];
      }
    },
    rooms: {
      type: Number,
      default: 1
    }
  },
  created() {
    this.isVisible = this.opened;
    let r = [];
    if (this.value.length == 0) {
      for (let index = 1; index <= this.rooms; index++) {
        let Hs = [];
        for (let pos = 0; pos < this.options.length; pos++) {
          let code = this.options[pos].code;
          let d = this.options[pos].default;
          Hs.push({
            code: code,
            label: this.options[pos].label,
            display: this.options[pos].display,
            value: d
          });
        }
        r.push({
          room: index,
          layout: Hs
        });
      }
      this.roomsLayout = r;
      this.updateValue();
    } else {
      this.roomsLayout = this.value;
      this.updateValue();
    }
    console.log(this.roomsLayout);
    console.log("asjdasdhka");
  },
  data() {
    return {
      kids: [],
      kidsAgeList: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
      isChanged: false,
      isVisible: false,
      arrow: true,
      emitValue: {},
      finalValue: [],
      roomsLayout: []
    };
  },
  methods: {
    toggleClicked() {
      if (this.clickable) this.isVisible = !this.isVisible;
    },
    handleFocusOut() {
      if (!this.opened) this.isVisible = false;
    },
    uValue() {
      this.emitValue = this.value;
    },
    updateValue() {
      this.$emit("input", this.roomsLayout);
    },
    constructDisplay() {
      let totalAdults = _.sumBy(this.roomsLayout, i => {
        return i.layout.find(j => {
          return j.code == "adults";
        }).value;
      });
      let totalKids = _.sumBy(this.roomsLayout, i => {
        return i.layout.find(j => {
          return j.code == "kids";
        }).value;
      });
      let s = `${totalAdults} adultos · ${totalKids} niños`;

      return s;
    },
    add(item, index) {
      if (item.code == "kids") {
        this.kids.push({
          age: null
        });
        item.value += 1;
        this.isChanged = true;
        this.updateValue(item);
      } else {
        if (item.value == 3) {
          let indexElementToAddOneMore = this.roomsLayout.findIndex(i => {
            let adults = i.layout.find(i => i.code == "adults");
            return adults && adults.value < 3;
          });
          if (indexElementToAddOneMore <= index) {
            this.$emit("roomAdded");
            this.isChanged = true;
          } else {
            this.roomsLayout[indexElementToAddOneMore].layout.find(
              i => i.code == "adults"
            ).value += 1;
            this.isChanged = true;
            this.updateValue(item);
          }
        } else if (item.value < 3) {
          item.value += 1;
          this.isChanged = true;
          this.updateValue(item);
        }
      }
    },
    remove(item, index) {
      if (item.code == "kids") {
        this.kids.pop();
        item.value -= 1;
        this.isChanged = true;
        this.updateValue(item);
      } else {
        item.value -= 1;
        if (item.value == 0) {
          this.$emit("roomRemoved", index);
        } else {
          this.isChanged = true;
          this.updateValue(item);
        }
      }
    }
  }
};
</script>

<style scoped>
.gtt__select_form {
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
  margin-bottom: 30px;
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
  position: absolute;
  border-radius: 10px;
  z-index: 3;
  top: 45px;
  margin-top: 30px;
  box-shadow: 0.5px -1px 15px rgba(0, 0, 0, 50%);
  display: none;
}
.gtt__itemKids {
  margin-top: 30px;
}
.gtt__kidsSelect {
  padding-right: 5px;
  padding-left: 0;
  height: 50px;
  margin-bottom: 5px;
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

.gtt__form {
  padding: 30px;
  position: relative;
  background: #ffffff;
  min-width: 450px;
  min-height: 150px;
  border-radius: 10px;
  font-family: "Helvetica Neue LT Std-Roman";
  color: #212f3d;
  font-size: 14px;
  line-height: 1.2;
}
.gtt__item {
  /* display: flex; */
  margin-bottom: 5px;
}
.gtt__room_row {
  /* display: flex; */
  margin-bottom: 5px;
}
.gtt__item_v_picker {
  display: flex;
}
.gtt__picker_button {
  width: 48px;
  height: 48px;
  border-radius: 100%;
  border: 1px solid #212f3d;
  background: #ffffff;
  font-size: 14px;
  font-family: "Helvetica Neue LT Std-Roman";
  color: #212f3d;
}
.gtt__item_label,
.gtt__picker_value {
  padding-top: 15px;
}
.gtt__picker_value {
  text-align: center;
}

.gtt__picker_button.disabled {
  color: #c4c4c4;
  border: 1px solid #c4c4c4;
}

.gtt__picker_button:focus {
  outline: none;
}
.gtt__picker_button:hover {
  color: #c4c4c4;
  border: 1px solid #c4c4c4;
}
.gtt__room {
  margin-bottom: 15px;
}
.gtt__room_name {
  font-size: 18px;
  text-align: center;
  width: 100%;
  margin-bottom: 10px;
}
.gtt__form {
  max-height: 500px;
  overflow: scroll;
  overflow-x: hidden;
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
  .gtt__list_area_wrapper {
    top: 30px;
    margin-top: 20px;
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
