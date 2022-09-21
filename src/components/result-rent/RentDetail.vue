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
                <img :src="image" alt="" v-if="!isLoadingImage" />
                <b-spinner
                  class="loading-spinner img-loading"
                  label="Text Centered"
                  v-else
                ></b-spinner>
              </div>
            </div>
            <div class="col-lg-3 text-center">
              <div class="right-side-bar">
                <div class="font24 gtt-text-color hn-ltcn">
                  {{ displayName(car.Nombre) }}
                </div>
                <div class="car-dist">
                  <img :src="imageProvider" alt="" />
                  <!-- <b-spinner class="loading-spinner img-loading" label="Text Centered" v-else></b-spinner> -->
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
<script>
import NavBar2 from "../shared/NavBar2";
import RentForm from "./RentForm";
import { authGetCar, authGetImage, authSearchProvider } from "../../utils/auth";

export default {
  components: {
    NavBar2,
    RentForm,
  },
  async created() {
    let carId = this.$route.params.id;
    try {
      let { data } = await authGetCar(carId);
      this.car = data;
      console.log({ data });
      this.isLoaded = true;
      this.image = await this.getImage();
      this.imageProvider = await this.getProviderImage(this.car.ProveedorId);
    } catch (error) {
      if (error) {
        this.$toasted.show("Su petición no se ha podido procesar", {
          type: "error",
        });
      }
    }
  },
  methods: {
    displayTransmission(item) {
      return item.split(" ")[0].toLowerCase();
    },
    displayName(data) {
      let data_splitted = data.split("-");
      let sp = data_splitted.slice(1, data_splitted.lenght);

      return sp.join("-");
    },
    async getImage() {
      let { data } = await authGetImage(this.$route.params.id);

      this.isLoadingImage = false;
      return data.ImageContent;
    },
    async getProviderImage(id) {
      let { data } = await authSearchProvider(id);
      return data.ImageContent;
    },
  },
  data() {
    return {
      car: {},
      isLoadingImage: true,
      image: null,
      imageProvider: null,
      isLoaded: false,
      filter: {},
      menuLinks: [
        {
          name: "index",
          displayName: "Inicio",
          id: "home-logged-banner",
        },
        {
          name: "lodging",
          displayName: "alojamientos",
          id: "home-logged-banner",
        },
        {
          name: "car-rent",
          displayName: "renta de autos",
          id: "index-logged-rent-wrapper",
        },
        {
          name: "transfer",
          displayName: "traslados",
          id: "index-logged-transfer",
        },
        {
          name: "excursions",
          displayName: "Excursiones y actividades",
          id: "index-logged-excursion",
        },
      ],
    };
  },
};
</script>
<style>
ul#icon-list-ul {
  list-style: none;
  padding-left: 0;
}
.custom-line-2 a {
  width: auto;
  height: 50px;
  padding: 15px 30px;
  border-radius: 5px;
  margin-right: 30px;
}
.custom-line-2 a:hover {
  text-decoration-line: none;
}
#car-info-block {
  margin-right: 9.375%;
  padding-right: 30px;
}
#car-info-block .img-wrapper {
  position: relative;
  text-align: center;
}
#car-info-block .img-wrapper img {
  width: 100%;
  height: 500px;
  object-fit: cover;
}
.right-side-bar {
  background-color: #f5f5f5;
  padding: 15px;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
  height: 100%;
  position: relative;
}
.right-side-bar .attention-note {
  position: absolute;
  bottom: 15px;
  border-top: 1px solid #c4c4c4;
  padding-top: 15px;
  margin-right: 15px;
  margin-left: 15px;
}
.car-dist {
  height: 34px;
  margin-top: 45px;
  margin-bottom: 45px;
}
.car-dist img {
  height: 100%;
}
.icons-row {
  margin-left: 15px !important;
  margin-right: 15px !important;
}
</style>
