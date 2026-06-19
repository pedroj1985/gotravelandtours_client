<template>
  <div
    id="content"
    class="custom-padding-top-2-navbar"
    style="margin-top: 30px;"
  >
    <NavBar2 :menuLinks="menuLinks"></NavBar2>
    <!-- <Breadcrumb :elementList="breadcrumbList"></Breadcrumb> -->
    <div id="twoColumn">
      <div class="left-column-filter-wrapper">
        <div id="left-column-filters">
          <RentForm
            :propPickUpDate="filter.pickUpDate"
            :propDeliveryDate="filter.deliveryDate"
            :propPickUpPlace="filter.pickUpPlace"
            :propDeliveryPlace="filter.deliveryPlace"
            :propCarCategory="filter.marca"
            :propTransmission="filter.transmision"
            :propNationality="filter.nationality"
          ></RentForm>
        </div>
      </div>
      <div class="right-column-list-wrapper">
        <div id="right-column-list" v-if="isLoaded">
          <div class="map-wrapper">
            <div class="icon-list">
              <ul id="icon-list-ul">
                <li>
                  <div class="item-info-icon-people">
                    <div class="iii-info-item iii-info-icon">
                      <i class="mdi mdi-account"></i>
                    </div>
                    <div class="iii-info-item iii-info-text">
                      {{ car.CantidadPlazas }}
                    </div>
                  </div>
                </li>
                <li>
                  <div class="item-info-icon-transmission">
                    <div class="iii-info-item iii-info-icon">
                      <i class="mdi mdi-engine"></i>
                    </div>
                    <div class="iii-info-item iii-info-text">
                      {{
                        displayTransmission(
                          $helpers.traducir(
                            $helpers.findTransmissionLocale(car.TipoTransmision)
                          )
                        )
                      }}
                    </div>
                  </div>
                </li>
              </ul>
            </div>
            <div class="left-side-map">
              <div class="custom-line-1">
                <div class="item-name hn-bdcn">
                  {{ displayName(car.Nombre) }}
                </div>
              </div>
              <div class="custom-line-2">
                <a href="#disponibilidad_precio" class="gtt-button"
                  >Disponibilidad y precio</a
                >
                <a href="#politicas_info" class="gtt-button"
                  >Políticas e información</a
                >
              </div>
            </div>
            <div class="right-side-map">
              <img src="../../../public/img/icomap.svg" alt="mapa" />
            </div>
          </div>
          <div id="car-info-block" class="row">
            <div class="col-lg-9">
              <div class="img-wrapper">
                <img :src="image" alt="Imagen del vehículo" v-if="!isLoadingImage" />
                <span
                  class="gtt-spinner loading-spinner img-loading"
                  v-else
                ></span>
              </div>
            </div>
            <div class="col-lg-3 text-center">
              <div class="right-side-bar">
                <div class="font24 gtt-text-color hn-ltcn">
                  {{ displayName(car.Nombre) }}
                </div>
                <div class="car-dist">
                  <img :src="imageProvider" alt="Proveedor" />
                  <!-- <span class="gtt-spinner loading-spinner img-loading" v-else></span> -->
                </div>
                <div class="row icons-row">
                  <div class="col-lg-6">
                    <div class="item-info-icon-people gtt-text-color">
                      <div class="iii-info-item iii-info-icon font36">
                        <i class="mdi mdi-account"></i>
                      </div>
                      <div class="iii-info-item iii-info-text">
                        {{ car.CantidadPlazas }}
                      </div>
                    </div>
                  </div>
                  <div class="col-lg-6">
                    <div class="item-info-icon-transmission gtt-text-color">
                      <div class="iii-info-item iii-info-icon font36">
                        <i class="mdi mdi-engine"></i>
                      </div>
                      <div class="iii-info-item iii-info-text">
                        {{
                          displayTransmission(
                            $helpers.traducir(
                              $helpers.findTransmissionLocale(
                                car.TipoTransmision
                              )
                            )
                          )
                        }}
                      </div>
                    </div>
                  </div>
                </div>
                <div class="attention-note general-text-opt">
                  <div class="attention-title font14 gtt-text-color">
                    <i class="mdi mdi-alert"></i>
                    <span class="to-uppercase hn-roman">Atención</span>
                    <i class="mdi mdi-alert"></i>
                  </div>
                  <div class="attention-text">
                    Chequee su auto antes de partir. Notifique al personal de
                    renta si detecta cualquier desperfecto y exija que se anote
                    en el contrato
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from "vue"
import { useRoute } from "vue-router"
import { toast } from "vue3-toastify"
import NavBar2 from "../shared/NavBar2.vue";
import RentForm from "./RentForm.vue";
import { authGetCar, authGetImage, authSearchProvider } from "../../utils/auth";

const route = useRoute()

const car = ref<any>({})
const isLoadingImage = ref(true)
const image = ref<any>(null)
const imageProvider = ref<any>(null)
const isLoaded = ref(false)
const filter = ref<any>({})
const menuLinks = ref([
  { name: "index", displayName: "Inicio", id: "home-logged-banner" },
  { name: "lodging", displayName: "alojamientos", id: "home-logged-banner" }
])

onMounted(async () => {
  let carId = route.params.id as string
  try {
    let { data } = await authGetCar(carId)
    car.value = data
    if (import.meta.env.DEV) { console.log({ data }) }
    isLoaded.value = true
    image.value = await getImage()
    imageProvider.value = await getProviderImage(car.value.ProveedorId)
  } catch (error) {
    if (error) {
      toast("Su petición no se ha podido procesar", { type: "error" })
    }
  }
})

function displayTransmission(item: string) {
  return item.split(" ")[0].toLowerCase()
}

function displayName(data: string) {
  let data_splitted = data.split("-")
  let sp = data_splitted.slice(1, data_splitted.length)
  return sp.join("-")
}

async function getImage() {
  let { data } = await authGetImage(route.params.id as string)
  isLoadingImage.value = false
  return data.ImageContent
}

async function getProviderImage(id: number) {
  let { data } = await authSearchProvider(id)
  return data.ImageContent
}
</script>
