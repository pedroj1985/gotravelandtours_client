<template>
  <div class="gtt__select_form" ref="root">
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
                    (item.code == 'kids' && item.value == 0),
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

<script setup lang="ts">
import { ref, watch } from "vue";
import { clickOutside as vClickOutside } from "@/directives/clickOutside";
import _ from "lodash";

const props = withDefaults(
  defineProps<{
    dsb?: boolean;
    clickable?: boolean;
    opened?: boolean;
    options?: any[];
    value?: any[];
    rooms?: number;
  }>(),
  {
    dsb: false,
    clickable: true,
    opened: false,
    rooms: 1,
  },
);

const emit = defineEmits<{
  (e: "input", val: any): void;
  (e: "roomAdded"): void;
  (e: "roomRemoved", index: number): void;
}>();

const kids = ref<any[]>([]);
const kidsAgeList = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
const isChanged = ref(false);
const isVisible = ref(props.opened);
const arrow = ref(true);
const root = ref<HTMLElement | null>(null);
const emitValue = ref({});
const finalValue = ref<any[]>([]);
const roomsLayout = ref<any[]>([]);

if (!props.value || props.value.length == 0) {
  const r: any[] = [];
  for (let index = 1; index <= props.rooms; index++) {
    const Hs: any[] = [];
    for (let pos = 0; pos < (props.options || []).length; pos++) {
      const opt = props.options![pos];
      Hs.push({
        code: opt.code,
        label: opt.label,
        display: opt.display,
        value: opt.default,
      });
    }
    r.push({ room: index, layout: Hs });
  }
  roomsLayout.value = r;
  updateValue();
} else {
  roomsLayout.value = props.value;
  updateValue();
}
if (import.meta.env.DEV) {
  console.log(roomsLayout.value);
}
if (import.meta.env.DEV) {
  console.log("asjdasdhka");
}

watch(
  () => props.rooms,
  (item) => {
    const d = item - roomsLayout.value.length;
    const r: any[] = [];
    if (d > 0) {
      for (
        let i = roomsLayout.value.length + 1;
        i <= roomsLayout.value.length + d;
        i++
      ) {
        const Hs: any[] = [];
        for (let pos = 0; pos < (props.options || []).length; pos++) {
          const opt = props.options![pos];
          Hs.push({
            code: opt.code,
            label: opt.label,
            display: opt.display,
            value: opt.default,
          });
        }
        r.push({ room: i, layout: Hs });
      }
      r.forEach((j) => {
        roomsLayout.value.push(j);
      });
    } else if (d < 0) {
      for (let o = 1; o <= Math.abs(d); o++) {
        roomsLayout.value.pop();
      }
    }
    updateValue();
  },
);

function toggleClicked() {
  if (props.clickable) isVisible.value = !isVisible.value;
}

function handleFocusOut(event?: Event) {
  if (!props.opened && !(event && root.value?.contains(event.target as Node)))
    isVisible.value = false;
}

function uValue() {
  emitValue.value = props.value || [];
}

function updateValue(item?: any) {
  emit("input", roomsLayout.value);
}

function constructDisplay() {
  const totalAdults = _.sumBy(roomsLayout.value, (i: any) => {
    return i.layout.find((j: any) => j.code == "adults").value;
  });
  const totalKids = _.sumBy(roomsLayout.value, (i: any) => {
    return i.layout.find((j: any) => j.code == "kids").value;
  });
  return `${totalAdults} adultos · ${totalKids} niños`;
}

function add(item: any, index: number) {
  if (item.code == "kids") {
    kids.value.push({ age: null });
    item.value += 1;
    isChanged.value = true;
    updateValue(item);
  } else {
    if (item.value == 3) {
      const indexElementToAddOneMore = roomsLayout.value.findIndex((i: any) => {
        const adults = i.layout.find((i: any) => i.code == "adults");
        return adults && adults.value < 3;
      });
      if (indexElementToAddOneMore <= index) {
        emit("roomAdded");
        isChanged.value = true;
      } else {
        roomsLayout.value[indexElementToAddOneMore].layout.find(
          (i: any) => i.code == "adults",
        ).value += 1;
        isChanged.value = true;
        updateValue(item);
      }
    } else if (item.value < 3) {
      item.value += 1;
      isChanged.value = true;
      updateValue(item);
    }
  }
}

function remove(item: any, index: number) {
  if (item.code == "kids") {
    kids.value.pop();
    item.value -= 1;
    isChanged.value = true;
    updateValue(item);
  } else {
    item.value -= 1;
    if (item.value == 0) {
      emit("roomRemoved", index);
    } else {
      isChanged.value = true;
      updateValue(item);
    }
  }
}
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
  left: 0;
  right: 0;
  top: calc(100% + var(--spacing-xs));
  margin-top: 0;
  border-radius: 10px;
  z-index: var(--z-dropdown);
  box-shadow: 0.5px -1px 15px rgba(0, 0, 0, 50%);
  display: none;

  &.isVisible {
    display: block;
  }
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
  height: 350px;
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
  overflow: auto;
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
