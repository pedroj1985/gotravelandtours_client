<template>
  <div>
    <div class="item-children">
      <div class="children-wrapper">
        <div class="item-children-header">
          <div class="item-children-info-btn">
            <button
              type="button"
              v-b-tooltip.hover
              title="Descripción"
              class="btn-children-info"
              :class="{ selected: selectedInfo == 'info' }"
              @click="selectInfo('info')"
            >
              <i class="mdi mdi-clipboard-text"></i>
            </button>
          </div>
          <div class="item-children-name hn-roman">
            <slot name="itemChildrenNameSlot" v-bind:child="child">
              <span class="font16" @click="selectInfo('roomLayout')">{{
                child.name
              }}</span>
              <!-- <span class="dist">{{child.combinacion.display}}</span> -->
            </slot>
          </div>
          <slot name="itemChildren" v-bind:child="child">
            <div class="item-children-section hn-roman">
              <div
                class="item-children-section-item"
                v-b-tooltip.hover
                :title="child.planAlimenticioNombre"
              >
                {{ child.planAlimenticioCodigo }}
              </div>
              <div
                class="item-children-section-item item-children-section-icon"
                v-b-tooltip.hover
                title="Confirmación Inmediata o a Solicitud"
              >
                <i class="mdi mdi-phone-check"></i>
              </div>
              <div
                class="item-children-section-item item-children-section-icon item-children-info-btn"
              >
                <button
                  type="button"
                  v-b-tooltip.hover
                  title="Precios"
                  class="btn-children-info"
                  :class="{ selected: selectedInfo == 'roomLayout' }"
                  @click="selectInfo('roomLayout')"
                >
                  <i class="mdi mdi-floor-plan"></i>
                </button>
              </div>
            </div>
          </slot>
          <div class="item-children-right-part">
            <div class="item-children-price hn-roman">
              <slot name="itemChildrenPriceSlot" v-bind:child="child">
                {{ styledPrice(child.combinacion.total).intPart }}. USD
              </slot>
            </div>
            <div class="item-children-reserve form-actions">
              <button
                type="submit"
                class="antonio-regular inverse btn-cart"
                @click="addToCart"
              >
                <i class="mdi mdi-cart"></i>
              </button>
              <button type="submit" class="antonio-regular" @click="reserve">
                Reservar
              </button>
            </div>
          </div>
        </div>
        <div class="item-children-content hn-roman">
          <div class="item-children-content-info" v-if="selectedInfo == 'info'">
            <slot name="itemContentInfoSlot" v-bind:child="child">
              <div class="hn-roman" v-html="child.habitacion.Descripcion"></div>
            </slot>
          </div>
          <slot name="item-room-layout" v-bind:extraInfo="child">
            <div
              class="item-children-content-info pd-15"
              v-if="selectedInfo == 'roomLayout'"
            >
              <div class="pt-30">
                <div
                  v-for="distribution in child.combinacion.listado"
                  :key="distribution.id"
                >
                  <div class="flex-wrapper">
                    <span class="flex-left-side"
                      >{{ distribution.tipoHabitacionNombre }} x{{
                        distribution.cantidad
                      }}</span
                    >
                    <span class="flex-right-side">
                      {{ styledPrice(distribution.price.value).intPart }}
                      USD
                    </span>
                  </div>
                </div>
              </div>
              <!-- <pre class="hn-roman">{{child.roomLayout}}</pre> -->
            </div>
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { lodgingUtilsMixin } from "../../mixins/lodgingUtilsMixin";
  import { authGetRoomTypes } from "../../utils/auth";
  export default {
    mixins: [lodgingUtilsMixin],
    data() {
      return {
        selectedInfo: "",
        todosTiposHabitaciones: []
      };
    },
    async created() {
      let tth = await authGetRoomTypes();
      this.todosTiposHabitaciones = tth.data;
    },
    props: {
      child: Object
    },
    methods: {
      addToCart() {
        this.$emit("listReserve", this.child);
      },
      styledPrice(number) {
        let intPart = Math.ceil(number);
        let decimalPart = Math.round((number - intPart) * 100);

        if (decimalPart == 0) decimalPart = "00";

        return { intPart: intPart, decimalPart: decimalPart };
      },
      selectInfo(section) {
        if (this.selectedInfo == section) {
          this.selectedInfo = "";
        } else {
          this.selectedInfo = section;
        }
      },
      reserve() {
        this.$emit("reserve", this.child);
      },
      findPrecio(item, listadoPrecios) {
        let tipoHabitacion = this.habitacionPorCantidadPersonas(
          item.CantAdult,
          this.todosTiposHabitaciones
        );
        let r = listadoPrecios.find(i => {
          return i.tipoHabitacion == tipoHabitacion.TipoHabitacionId;
        });
        return r.price;
      }
    }
  };
</script>

<style scoped>
  .btn-cart {
    margin-right: 5px;
    width: 50px;
  }
  .children-wrapper {
    border-bottom: 1px solid #c4c4c4;
  }
  .item-children-header {
    padding-bottom: 5px;
    display: flex;
  }
  .item-children-content {
    padding-right: 230px;
    padding-left: 60px;
  }
  .item-children-content pre {
    font-size: 16px;
    color: #6d6d6d;
    white-space: pre-wrap;
  }
  .item-children {
    /* display: flex; */
  }
  .item-children-name {
    /* margin-right: auto; */
    color: #6d6d6d;
    font-size: 16px;
    width: 35%;
  }
  .item-children-name span:hover {
    cursor: pointer;
  }
  .dist {
    font-size: 12px;
  }
  .item-children-section {
    color: #6d6d6d;
    font-size: 24px;
    display: flex;
  }

  .item-children-section-item {
    padding-right: 25px;
    align-self: center;
    font-size: 30px !important;
  }
  .item-children-section-icon {
    font-size: 30px !important;
    color: #212f3d;
    align-self: center;
  }
  .item-children-right-part {
    margin-left: auto;
    display: flex;
  }
  .item-children-price {
    padding-right: 60px;
    color: #6d6d6d;
    font-size: 24px;
  }
  .item-children-info-btn {
    font-size: 24px;
    color: #212f3d;
    padding-right: 20px;
  }
  .item-children-info-btn button {
    border: none;
    background-color: transparent;
  }
  .item-children-info-btn button:hover {
    cursor: pointer;
  }
  .item-children-info-btn button:focus {
    border: none;
    outline: none;
  }
  .item-children-name,
  .item-children-section,
  .item-children-price,
  .item-children-info-btn {
    align-self: center;
  }
  .selected {
    color: #c4c4c4;
  }
</style>
