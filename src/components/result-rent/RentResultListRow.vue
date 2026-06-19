<template>
  <div class="item-children">
    <div class="children-wrapper">
      <div class="item-children-header">
        <div class="item-children-info-btn">
          <button
            type="button"
            class="btn-children-info"
            :class="{ selected: selectedInfo == 'info' }"
            @click="selectInfo('info')"
          >
            <i class="mdi mdi-clipboard-text"></i>
          </button>
        </div>
        <div class="item-children-name hn-bdcn">
          <slot name="itemChildrenNameSlot" v-bind:child="child">
            {{ $helpers.traducir(child.marca) }}
            {{
              $helpers.traducir(
                $helpers.findTransmissionLocale(child.transmision)
              )
            }}
          </slot>
        </div>
        <slot name="itemChildren" v-bind:child="child">
          <div class="item-children-section hn-roman">
            <div
              class="item-children-section-item item-children-section-icon item-children-info-btn"
              v-if="child.cancelation"
            >
              <button
                type="button"
                class="btn-children-info"
                :class="{ selected: selectedInfo == 'cancelation_policy' }"
                @click="selectInfo('cancelation_policy')"
              >
                <i class="mdi mdi-credit-card-off-outline"></i>
              </button>
            </div>
          </div>
          <div class="item-children-section hn-roman">
            <div
              class="item-children-section-item item-children-section-icon item-children-info-btn"
              v-if="child.cancelation"
            >
              <button type="button" class="btn-children-info">
                <i class="mdi mdi-email"></i>
              </button>
            </div>
          </div>
        </slot>
        <div class="item-children-right-part">
          <!-- <div class="item-children-price hn-roman">
                            <slot name="itemChildrenPriceSlot" v-bind:child="child">
                                {{ styledPrice(child.precio).intPart}}.<sup>{{ styledPrice(child.precio).decimalPart}}</sup> USD
                            </slot>
                        </div> -->
          <div class="item-children-reserve form-actions">
            <template v-if="!onlyToSelect">
              <button
                type="submit"
                class="antonio-regular inverse btn-cart"
                :disabled="diffDays"
                :class="{ disabled: diffDays }"
                @click="addToCartAndNotifyIt"
              >
                <i class="mdi mdi-cart"></i>
              </button>
              <button
                type="submit"
                class="antonio-regular"
                :disabled="diffDays"
                :class="{ disabled: diffDays }"
                @click="addToCartAndGoTo"
              >
                Reservar
              </button>
            </template>
            <button
              v-else
              type="submit"
              class="antonio-regular"
              @click="emitElement"
            >
              Seleccionar
            </button>
          </div>
        </div>
      </div>
      <div class="item-children-content hn-roman">
        <div class="item-children-content-info" v-if="selectedInfo == 'info'">
          <slot name="itemContentInfoSlot" v-bind:child="child">
            <!-- <pre class="hn-roman"> -->
            <div v-html="child.descripcion"></div>
            <!-- </pre> -->
          </slot>
        </div>
        <div
          class="item-children-content-info"
          v-if="selectedInfo == 'cancelation_policy'"
        >
          <slot name="itemContentInfoSlot" v-bind:child="child">
            <!-- <pre class="hn-roman"> -->
            <div v-html="child.cancelation"></div>
            <!-- </pre> -->
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue"
import { useRouter } from "vue-router"
import { toast } from "vue3-toastify"
import { helpers } from "../../utils/helpers";
import { diffDaysEmitter } from "../../utils/emitter";
import { useCartStore } from "../../stores/cartStore";
import { verifyDifferentsDates } from "../../utils/utils";

const $helpers = helpers

const props = defineProps<{
  child: any
  onlyToSelect?: boolean
}>()

const emit = defineEmits<{
  (e: "selectedElementEditRow", value: any): void
}>()

const router = useRouter()
const selectedInfo = ref("")
const filters = ref<any>(null)
const diffDays = ref(false)

filters.value = JSON.parse(localStorage.getItem("searchRentFilters") || "null")

diffDaysEmitter.on("diffDays", (i: boolean) => {
  diffDays.value = i
})

onMounted(() => {
  verifyDifferentsDates({
    FechaRecogida: props.child.orderVehiculo.FechaRecogida,
    FechaEntrega: props.child.orderVehiculo.FechaEntrega
  })
})

onBeforeUnmount(() => {
  diffDaysEmitter.off("diffDays")
})

function addToCartAndGoTo() {
  addToCart()
  router.push({ name: "reservation" })
}

function addToCartAndNotifyIt() {
  addToCart()
  verifyDifferentsDates({
    FechaRecogida: props.child.orderVehiculo.FechaRecogida,
    FechaEntrega: props.child.orderVehiculo.FechaEntrega
  })
  toast("Elemento agregado con éxito a su carrito de compra.", { type: "success" })
}

function emitElement() {
  emit("selectedElementEditRow", props.child)
}

function addToCart() {
  $helpers.shoppingCartAdd(props.child)
  useCartStore().refresh()
}

function styledPrice(number: number) {
  let intPart = Math.ceil(number)
  let decimalPart = Math.round((number - intPart) * 100)
  if (decimalPart == 0) decimalPart = "00"
  return { intPart, decimalPart }
}

function selectInfo(section: string) {
  if (selectedInfo.value == section) {
    selectedInfo.value = ""
  } else {
    selectedInfo.value = section
  }
}
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
  padding-right: 60px;
  padding-left: 60px;
}
.item-children-content-info {
  padding-bottom: 30px;
  font-size: 14px;
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
  margin-right: auto;
  color: #6d6d6d;
  font-size: 20px;
  width: 20%;
}
.item-children-section {
  color: #6d6d6d;
  font-size: 24px;
  display: flex;
}

.item-children-section-item {
  padding-right: 25px;
  align-self: center;
  font-size: 30px;
}
.item-children-section-icon {
  font-size: 30px;
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

@media (max-width: 1440px) {
  .item-children-info-btn {
    font-size: 18px;
  }
  .item-children-name {
    font-size: 12px;
  }
  .item-children-section {
    color: #6d6d6d;
    font-size: 18px;
    display: flex;
  }
}
</style>
