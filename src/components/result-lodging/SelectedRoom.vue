<template>
  <div class="selected-room flex-wrapper">
    <div class="room-name">
      {{ item.name }} (
      <AdultsKidsIcons
        :adults="item.CantAdultos"
        :kids="item.CantidadMenores"
        :id="id"
      ></AdultsKidsIcons>
      )
    </div>
    <div class="flex-right-side room-price">
      {{
        styledPrice(item.habitacion.PrecioOrden).intPart *
          item.habitacion.CantidadHabitaciones
      }}
      USD
      <button type="button" class="antonio-regular remove-icon" @click="remove">
        <i class="mdi mdi-trash-can"></i>
      </button>
    </div>
  </div>
</template>

<script>
import AdultsKidsIcons from "./AdultsKidsIcons";
import { uuid } from "vue-uuid";

export default {
  components: {
    AdultsKidsIcons,
  },
  // mounted(){
  //     console.log(this.item)
  //     console.log('room aqui')
  // },
  created() {
    this.id = uuid.v4();
  },
  data() {
    return {
      id: null,
    };
  },
  props: {
    item: {
      type: Object,
      default: function() {
        return {};
      },
    },
  },
  methods: {
    remove() {
      this.$emit("removeFromList", this.item);
    },
    styledPrice(number) {
      let intPart = Math.ceil(number);
      let decimalPart = Math.round((number - intPart) * 100);

      if (decimalPart == 0) decimalPart = "00";

      return { intPart: intPart, decimalPart: decimalPart };
    },
  },
};
</script>

<style>
.remove-icon {
  /* border: none; */
  background: transparent;
  border-radius: 5px;
  margin-left: 15px;
}
.remove-icon:hover {
  /* border: none; */
  color: #ffffff;
  background: #212f3d;
}
.selected-room {
  margin-bottom: 15px;
}
.room-name,
.room-price {
  font-size: 14px;
}
</style>
