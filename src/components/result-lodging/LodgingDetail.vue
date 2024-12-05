<template>
  <div
    id="lodging-detail"
    class="custom-padding-top-2-navbar"
    style="margin-top: 30px;"
  >
    <GttLodgingDetailNewSearchModal
      :inDate="inDate"
      :outDate="outDate"
      :sRL="selectedRoomLayout"
      :tR="totalRooms"
      :item="item"
      :clickedItem="clickedItem"
      v-if="isModalLodgingActive"
      @modalCancel="isModalLodgingActive = false"
      @searched="updateResult"
      @errorC="errorSearch"
    ></GttLodgingDetailNewSearchModal>
    <LightBox
      :media="imagesTreated"
      v-if="isModalGalleryActive"
      @onClosed="isModalGalleryActive = false"
    ></LightBox>
    <NavBar2 :menuLinks="menuLinks"></NavBar2>
    <div class="row lodging-detail-wrapper">
      <div class="col-md-3 col-sm-5 left-side-wrapper">
        <div class="left-side">
          <div class="lodging-form">
            <LodgingForm ref="lodgingForm"
              :propLodgingDestinyValue="filters.Destiny"
              :propArriveDate="filters.Entrada"
              :propDepartureDate="filters.Salida"
              :propRoomLayout="filters.Visitantes"
              :propNationality="filters.Nacionalidad"
            ></LodgingForm>
          </div>
          <div class="selected-rooms hn-roman gtt-first-color">
            <div class="selected-rooms-title hn-bdcn font18">
              Habitaciones a reservar
            </div>
            <div
              class="selected-rooms-empty font12 gtt-text-color"
              v-if="roomsToReserve.length == 0"
            >
              --No hay seleccionada ninguna habitación--
            </div>
            <SelectedRoom
              v-for="item in roomsToReserve"
              :key="item.id"
              :item="item"
              @removeFromList="removeFromToReserve"
            ></SelectedRoom>
            <div class="form-actions selected-rooms-footer flex-wrapper">
              <template v-if="roomsToReserve.length > 0">
                <button
                  type="button"
                  class="selected-rooms-btn btn-reserve"
                  @click="reserve"
                >
                  Reservar
                </button>
                <!-- <button type="button" @click="addToGeneralCart" class=" selected-rooms-btn antonio-regular inverse btn-cart"><i class="mdi mdi-cart"></i></button> -->
              </template>
              <div
                class="total-to-pay font18 flex-right-side to-uppercase hn-bdcn"
              >
                Total: {{ styledPrice(totalPay).intPart }} USD
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-9 col-sm-7" v-if="item != null">
        <div class="lodging-detail-header">
          <div class="row">
            <div class="col-md-1 header-star">
              <div class="star-wrapper">
                <i class="mdi mdi-star icon"></i>
                <span class="total-stars">{{
                  item.lodging.NumeroEstrellas
                }}</span>
              </div>
            </div>
            <div class="col-md-6 antonio-regular gtt-first-color">
              <div class="header-name  font24">{{ item.lodging.Nombre }}</div>
              <div class="header-info hn-roman font14 gtt-text-color">
                Del
                {{
                  toMoment(filters.Entrada)
                    .locale("es")
                    .format("DD MMM YYYY")
                }}
                al
                {{
                  toMoment(filters.Salida)
                    .locale("es")
                    .format("DD MMM YYYY")
                }}
              </div>
              <div class="headers-buttons form-actions">
                <button
                  type="button"
                  class="to-uppercase inverse antonio-regular"
                  v-scroll-to="{ el: '#pai', offset: -100 }"
                >
                  Precios e información
                </button>
              </div>
            </div>
            <div class="col-md-4 header-map"></div>
          </div>
        </div>
        <div class="lodging-detail-info flex-wrapper">
          <div class="lodging-info-carousel">
            <Slick
              ref="slick"
              :slidesToShow="1"
              :slidesToScroll="1"
              :draggable="true"
              :arrows="true"
              :dots="false"
              :autoplay="true"
              class="lic-carousel"
            >
              <div slot="prevArrow" class="custom-prevArrow">
                <i class="mdi mdi-chevron-left"></i>
              </div>
              <div slot="nextArrow" class="custom-nextArrow">
                <i class="mdi mdi-chevron-right"></i>
              </div>
              <div
                class="result-images-carousel"
                v-for="destinyImage in item.images"
                :key="destinyImage"
              >
                <img v-bind:src="destinyImage" alt="" />
                <div class="w-100 h-100 position-absolute bgHolder"></div>
              </div>
            </Slick>
            <div class="footer-buttons-carousel">
              <i
                class="mdi mdi-image-multiple font18 float-right"
                @click="isModalGalleryActive = true"
              ></i>
            </div>
          </div>
          <div class="lodging-info-info">
            <div class="lodging-info-name hn-ltcn font24 gtt-text-color">
              {{ item.lodging.Nombre }}
            </div>
            <div class="lodging-info-stars">
              <div class="item-hotel-stars">
                <ul class="stars font24">
                  <li v-for="i in item.lodging.NumeroEstrellas" :key="i">
                    <i class="mdi mdi-star"></i>
                  </li>
                </ul>
              </div>
            </div>
            <div
              class="lodging-info-location gtt-text-color hn-roman general-text-opt pt-30"
            >
              <div class="font14">ubicación:</div>
              <div class="font16">{{ item.lodging.Direccion }}</div>
            </div>
            <div
              class="lodging-info-schedule gtt-text-color hn-roman general-text-opt pt-15"
            >
              <div class="font14">horario:</div>
              <div class="checkin font16">
                <span class="check-sp">Check-In:</span>
                <span>{{ item.lodging.CheckIn }}</span>
              </div>
              <div class="checkout font16">
                <span class="check-sp">Check-Out:</span>
                <span>{{ item.lodging.CheckOut }}</span>
              </div>
            </div>
            <!-- <div class="lodging-info-lang gtt-text-color hn-roman"></div> -->
            <div
              class="lodging-info-contacts gtt-text-color hn-roman general-text-opt pt-15"
            >
              <div class="font14">contactos del hotel:</div>
              <div class="font16">
                <span>{{ item.lodging.Telefono }}</span>
              </div>
            </div>
          </div>
        </div>
        <div id="pai" class="pt-30">
          <div class="verify-step-title pb-30 hn-bdcn font24 gtt-first-color">
            Precios e información
          </div>
          <div class="info-box pt-15">
            <div class="about pl-15 pr-15 pb-30 hn-roman">
              <div class="gtt-first-color font18 pb-15">Acerca del hotel</div>
              <div
                v-html="item.lodging.Descripcion"
                class="font16 gtt-text-color"
              ></div>
            </div>
            <div class="rooms-disponibility hn-roman">
              <div class="gtt-first-color font18 pl-15 pb-15">
                Habitaciones y disponibilidad
              </div>
              <!-- <div
                class="flex-wrapper rooms-disponibility-form pl-15 pr-15"
                @click="openModal"
              >
                <GttSelectDate
                  :mode="'single'"
                  v-model="inDate"
                  :dsb="roomsToReserve.length > 0"
                  class="room-form-item"
                  :clickable="false"
                  @click.native="changeClicked('fecha-entrada')"
                >
                  <i
                    slot="iconSelectedValue"
                    class="mdi mdi-calendar-today"
                  ></i>
                  <span slot="placeholder">
                    Fecha de entrada
                  </span>
                </GttSelectDate>
                <GttSelectDate
                  :mode="'single'"
                  v-model="outDate"
                  :dsb="roomsToReserve.length > 0"
                  class="room-form-item"
                  :clickable="false"
                  @click.native="changeClicked('fecha-salida')"
                >
                  >
                  <i
                    slot="iconSelectedValue"
                    class="mdi mdi-calendar-today"
                  ></i>
                  <span slot="placeholder">
                    Fecha de salida
                  </span>
                </GttSelectDate>
                <GttSelectForm2
                  :options="roomLayout"
                  class="room-form-item"
                  v-model="selectedRoomLayout"
                  :rooms="totalRooms.value"
                  :dsb="roomsToReserve.length > 0"
                  :clickable="false"
                  @click.native="changeClicked('visitantes')"
                >
                  <span slot="iconSelectedValue"
                    ><i class="mdi mdi-account"></i
                  ></span>
                  <span slot="placeholder">Visitantes</span>
                </GttSelectForm2>
                <GttSelect
                  :options="roomsOpt"
                  v-model="totalRooms"
                  :isDisabled="roomsToReserve.length > 0"
                  :clickable="false"
                  @click.native="changeClicked('habitaciones')"
                  class="room-form-item last"
                >
                  <i slot="iconSelectedValue" class="mdi mdi-bed"></i>
                  <span slot="placeholder"> Habitaciones</span>
                  <template v-slot:option="option">
                    {{ option.option.display }}
                  </template>
                  <template v-slot:selectedValue="selectedValue">
                    {{ selectedValue.selectedValue.display }}
                  </template>
                </GttSelect>
                <div class="form-actions prices-info-search-btn">
                  <button
                    type="submit"
                    class="antonio-regular inverse"
                    @click="changeClicked('')"
                  >
                    Buscar
                  </button>
                </div>
              </div> -->
            </div>
            <div class="rooms-result" v-if="roomsSelecting">
              <div
                class="list-item-select gtt-first-color hn-bdcn"
                v-if="roomsResult.length > 0"
              >
                <span class="result-text">Resultados para: </span>
                <div class="buscando flex-wrapper">
                  <div
                    v-for="(rl, index) in this.selectedRoomLayout"
                    :key="rl.id"
                  >
                    <span><i v-if="index != 0">, </i>Hab. {{ rl.room }} </span>
                    (<AdultsKidsIcons
                      :adults="getAdults(rl)"
                      :kids="getKids(rl)"
                      :id="'room_' + rl.room"
                    ></AdultsKidsIcons
                    >)
                  </div>
                </div>
              </div>
              <div v-else class="text-center">
                Buscando...
              </div>
              <div class="list-item-children">
                <ResultListRow2
                  v-for="child in roomsResult"
                  :key="child.id"
                  :child="child"
                  :roomSelectedToDis="roomSelectedToDis"
                  @listReserve="addToCart"
                  @reserveOne="addOneToCart"
                >
                </ResultListRow2>
              </div>
            </div>
            <div v-else>
              <div
                v-if="roomsResult.length == 0"
                class="text-center gtt-errors mb-2"
              >
                No existe disponibilidad
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  authGetLodging,
  // authGetImage,
  authGetImages,
  authSearchRoomsByLodging,
  authGetRoomPrice,
  authGetLodgingEatingPlanOne,
  hotetecOpenSession,
  hotetecStateSession
} from "../../utils/auth";
import Slick from "vue-slick-carousel";
import GttSelectDate from "../custom-elements/GttSelectDate";
import GttSelect from "../custom-elements/GttSelect";
import GttSelectForm2 from "../custom-elements/GttSelectForm2";
import GttLodgingDetailNewSearchModal from "../custom-elements/GttLodgingDetailNewSearchModal";
import ResultListRow2 from "../result-lodging/ResultListRow2";
import moment from "moment";
import SelectedRoom from "./SelectedRoom";
import { uuid } from "vue-uuid";
import _ from "lodash";
import AdultsKidsIcons from "./AdultsKidsIcons";
import LodgingForm from "./LodgingForm";
import NavBar2 from "../shared/NavBar2";
import LightBox from "vue-image-lightbox";

export default {
  components: {
    Slick,
    GttSelectDate,
    GttSelect,
    GttSelectForm2,
    ResultListRow2,
    SelectedRoom,
    AdultsKidsIcons,
    LodgingForm,
    NavBar2,
    GttLodgingDetailNewSearchModal,
    LightBox,
  },
  watch: {
    '$route.params.id': {
      async handler(newId, oldId) {
        console.log('id changed');
        await this.initializeData();
      },
      immediate: true
    }
  },
  /* async beforeRouteEnter(to, from, next) {
    next(async (vm) => {
      await vm.initializeData();
    });
  }, */
  async beforeRouteUpdate(to, from, next) {
    await this.initializeData();
    next();
  },
  /* async created() {
    await this.initializeData();
  }, */
  data() {
    return {
      item: null,
      clickedItem: "",
      isModalLodgingActive: false,
      isModalGalleryActive: false,
      totalToPay: 0,
      filters: null,
      totalRooms: null,
      roomsOpt: [],
      selectedRoomLayout: [],
      roomsToReserve: [],
      roomsSelecting: false,
      selectingWizardStep: 0,
      inDate: null,
      outDate: null,
      loading: false,
      roomsResult: [],
      roomSelectedToDis: [],
      roomLayout: [
        {
          code: "adults",
          label: "Adultos",
          display: "Adulto(s)",
          default: 1,
        },
        {
          code: "kids",
          label: "Niños",
          display: "Niño(s)",
          default: 0,
        },
      ],
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
/*         {
          name: "car-rent",
          displayName: "renta de autos",
          id: "index-logged-rent-wrapper",
        }, */
/*        {
          name: "transfer",
          displayName: "traslados",
          id: "index-logged-transfer",
        },
        {
          name: "excursions",
          displayName: "Excursiones y actividades",
          id: "index-logged-excursion",
        },*/
      ],
    };
  },
  computed: {
    totalPay: function() {
      return _.sumBy(this.roomsToReserve, (i) => {
        return i.habitacion.PrecioOrden * i.habitacion.CantidadHabitaciones;
      });
    },
    imagesTreated() {
      if (this.item)
        return this.item.images.map((i) => {
          return { src: i, thumb: i };
        });
      return [];
    },
  },
  methods: {
    async initializeData() {
      // this.roomsOpt = this.generateRooms()
      this.totalRooms = {
        value: 1,
        display: "1 habitación",
      };
      let f = JSON.parse(localStorage.getItem("searchLodgingFilters"));
      this.filters = f;

      let a = JSON.parse(localStorage.getItem("searchLodgingAcomodation"));
      this.fillRoomLayout(a);

      this.inDate = new Date(this.filters.Entrada);
      this.outDate = new Date(this.filters.Salida);
      let id = this.$route.params.id;
      let { data } = await authGetLodging(id);
      console.info('dataDetail', data);
      // let img = await authGetImage(id)
      let imgs = await authGetImages(id);
      let imgs_array = imgs.data.map((i) => i.ImageContent);
      this.item = {
        images: imgs_array,
        lodging: data,
      };
      try {
        this.roomsSelecting = true;
        console.log('sR init');
        await this.sR();
        console.log('sR init done');
        if (this.roomsResult.length == 0) {
          this.roomsSelecting = false;
        }
        this.$refs.lodgingForm.desactivateModal();
        this.$emit('searchingFinished',false)
      } catch (e) {
        console.log(e);
      }
    },
    changeClicked(item) {
      this.clickedItem = item;
    },
    openModal() {
      if (this.roomsToReserve.length == 0) this.isModalLodgingActive = true;
    },
    fillRoomLayout(acomodation) {
      let total = _.sumBy(acomodation, (i) => i.cantidad);
      this.totalRooms = {
        value: total,
        display: total > 1 ? `${total} habitaciones` : `${total} habitación`,
      };
      let count = 1;
      let a = [];
      acomodation.forEach((i) => {
        for (let t = 0; t < i.cantidad; t++) {
          a.push({
            room: count,
            layout: [
              {
                code: "adults",
                display: "Adulto(s)",
                label: "Adultos",
                value: i.adults,
              },
              {
                code: "kids",
                display: "Niño(s)",
                label: "Niños",
                value: i.kids,
              },
            ],
          });
          count++;
        }
      });

      if (a.length > 0) {
        this.selectedRoomLayout = a;
      }
    },
    toMoment(date) {
      return moment(date);
    },
    getAdults(item) {
      return item.layout.find((i) => {
        return i.code == "adults";
      }).value;
    },
    getKids(item) {
      return item.layout.find((i) => {
        return i.code == "kids";
      }).value;
    },
    refreshLayout() {
      this.selectedRoomLayout = [];
      this.$set(this.selectedRoomLayout, 0, {
        room: 1,
        layout: [
          {
            code: "adults",
            display: "Adulto(s)",
            label: "Adultos",
            value: 1,
          },
          {
            code: "kids",
            display: "Niño(s)",
            label: "Niños",
            value: 0,
          },
        ],
      });
      this.totalRooms = {
        value: 1,
        display: "1 habitación",
      };
    },
    removeFromToReserve(item) {
      let indexR = this.roomsToReserve.findIndex((i) => {
        return i.id == item.id;
      });
      this.roomsToReserve.splice(indexR, 1);

      let index = this.roomSelectedToDis.findIndex((o) => {
        return o == item.rn;
      });
      this.roomSelectedToDis.splice(index, 1);
    },
    errorSearch() {
      this.roomsResult = [];
      this.roomsSelecting = false;
      this.isModalLodgingActive = false;
    },

    updateResult(r) {
      this.roomsSelecting = true;
      this.roomsResult = r.result;
      this.inDate = r.filters.inDate;
      this.outDate = r.filters.outDate;
      this.selectedRoomLayout = r.filters.selectedRoomLayout;
      this.totalRooms = r.filters.totalRooms;
      this.isModalLodgingActive = false;
    },
    addToGeneralCart() {
      let listado = [];
      this.roomsToReserve.forEach((i) => {console.log('-- romsreserve --', i);
        listado.push({
          precioObjOne: i.habitacion,
          tipoHabitacion: i.habitacion.TipoHabitacion.TipoHabitacionId,
          cantidadMenoresPorHabitacion: i.CantidadMenores,
          planAlimenticio: i.PA.PlanesAlimenticiosId,
          price: {
            value: i.habitacion.PrecioOrden,
          },
          // TODO cantidad
          cantidad: i.habitacion.CantidadHabitaciones,
        });
      });
      let total = _.sumBy(this.roomsToReserve, (j) => {
        return (
          j.habitacion.PrecioOrden *
          this.roomsToReserve[0].habitacion.CantidadHabitaciones
        );
      });
      let l = {
        tipo: "lodging",
        entrada: this.inDate,
        salida: this.outDate,
        name: this.item.lodging.Nombre,
        stars: this.item.lodging.NumeroEstrellas,
        images: this.item.images,
        location: this.item.lodging.Direccion,
        lodging: this.item.lodging,
        roomL: this.selectedRoomLayout,
        reservedRooms: {
          combinacion: {
            listado: listado,
            total: total,
          },
        },
      };

      this.refreshLayout();
      this.$helpers.shoppingCartAdd(l);
      this.$eventCartBus.$emit("updateCart");
      this.roomSelectedToDis = [];
      this.roomsToReserve = [];
      this.roomsResult = [];
    },
    reserve() {
      this.addToGeneralCart();
      this.$router.push({
        name: "reservation",
      });
    },
    addOneToCart(item) {console.info('item5', item);
      this.roomsToReserve.push(item);
      this.roomSelectedToDis.push(item.rn);
    },
    async addToCart(item) {
      console.log('item5', item);
      item.l.forEach((i) => {
        this.roomsToReserve.push(i);
        this.roomSelectedToDis.push(i.rn);
      });
      console.info([this.roomsToReserve, this.roomSelectedToDis]);
      // this.roomsSelecting = false
      // this.refreshLayout()
    },
    async btnSearch() {
      this.roomsSelecting = true;
      this.loading = true;
      // await this.searchRooms(this.selectedRoomLayout[0])
      try {
        await this.sR();
      } catch (e) {
        console.log(e);
      }
    },
    async sR() {
      let currentHotelec = localStorage.getItem("currentHotelecIds");
      let HotelecSessionExpired = false;
      //let PlanesAlimenticiosIds = [];

      if (currentHotelec) {
        const response = await hotetecStateSession(currentHotelec);
        HotelecSessionExpired = !response.data.Infses;
      }
      if (!currentHotelec || HotelecSessionExpired) {
        // await this.$helpers.shoppingCartDeleteAll(true);
        try {
          const response = await hotetecOpenSession();
          if (response && response.data && response.data.Ideses) {
            currentHotelec = response.data.Ideses;
            localStorage.setItem("currentHotelecIds", currentHotelec);
          }
        } catch (error) {
          console.error(
            "Error occurred while fetching or processing data:",
            error.message
          );
        }
      }

      this.roomsResult = [];
      let listaPlanesAlimenticios = this.item.lodging.ListaPlanesAlimenticios;
      let rooms = await authSearchRoomsByLodging(this.item.lodging.ProductoId);
      let active_rooms = rooms.data.filter((i) => {
        return i.IsActiva == true;
      });
      // console.info('allData', [listaPlanesAlimenticios, rooms, active_rooms])
      try {

        await Promise.all(
          active_rooms.map(async (j) => {
            console.log('--- j ---', j);
            await Promise.all(
              listaPlanesAlimenticios.map(async (i) => {
                console.log('--- i ---', i);
                //if (!PlanesAlimenticiosIds.includes(i.PlanesAlimenticiosId)) {
                  let pa = await authGetLodgingEatingPlanOne(
                    i.PlanesAlimenticiosId
                  );
                  let noDisp = false;
                  let c = 0;
                  let temp = [];
                  while (!noDisp && c < this.selectedRoomLayout.length) {
                    let el = this.selectedRoomLayout[c];
                    let ca = el.layout.find((p) => p.code == "adults").value;
                    let cm = el.layout.find((p) => p.code == "kids").value;
                    let so = {
                      Cliente: { ClienteId: localStorage.getItem("cliente") },
                      PlanAlimenticio: {
                        PlanesAlimenticiosId: i.PlanesAlimenticiosId,
                      },
                      Alojamiento: { ProductoId: this.item.lodging.ProductoId },
                      TipoHabitacion: { TipoHabitacionId: ca },
                      CantidadAdultos: ca,
                      CantidadMenores: cm,
                      CantidadInfantes: 0,
                      CantidadHabitaciones: 1,
                      HotetecIdeses: currentHotelec,
                      IsSinContrato: true,
                      Habitacion: { HabitacionId: j.HabitacionId },
                      Entrada: this.inDate,
                      Salida: this.outDate,
                    };
                    try {
                      let precioA = await authGetRoomPrice(so);
                      let data = precioA.data[0];
                      data.TipoHabitacion = so.TipoHabitacion;
                      console.info('precioData', data);
                      if (
                        precioA.data.length != 0 &&
                        // && r.data[0].OrdenAlojamientoId != -1
                        data.PrecioOrden != 0 &&
                        data.HotetecIsAvailable === true
                      ) {
                        temp.push({
                          name: j.Nombre,
                          habitacion: data || -1,
                          CantAdultos: ca,
                          CantidadMenores: cm,
                          PA: pa.data,
                          rn: el.room,
                          id: uuid.v4(),
                        });
                      } else {
                        noDisp = true;
                      }
                    } catch (e) {
                      noDisp = true;
                    }

                    c++;
                  }
                //}

                if (!noDisp) {
                  console.info('roomsResult', [j, pa.data, temp]);
                  this.roomsResult.push({
                    rO: j,
                    pA: pa.data,
                    l: temp,
                  });
                }
              })
            );
          })
        );
      } catch (e) {
        console.log(e);
      }
      this.loading = false;
    },
    async searchRooms(room) {
      this.roomsResult = [];
      let atLeastOne = false;
      let listaPlanesAlimenticios = this.item.lodging.ListaPlanesAlimenticios;
      let ca = room.layout.find((p) => p.code == "adults").value;
      let cm = room.layout.find((p) => p.code == "kids").value;
      let rooms = await authSearchRoomsByLodging(this.item.lodging.ProductoId);
      let active_rooms = rooms.data.filter((i) => {
        return i.IsActiva == true;
      });
      await Promise.all(
        active_rooms.map(async (j) => {
          await Promise.all(
            listaPlanesAlimenticios.map(async (i) => {
              let pa = await authGetLodgingEatingPlanOne(
                i.PlanesAlimenticiosId
              );
              let sf = {
                Cliente: { ClienteId: localStorage.getItem("cliente") },
                PlanAlimenticio: { PlanAlimenticioId: i.PlanesAlimenticiosId },
                Alojamiento: { ProductoId: this.item.lodging.ProductoId },
                TipoHabitacion: { TipoHabitacionId: ca },
                CantidadAdultos: ca,
                CantidadMenores: cm,
                CantidadInfantes: 0,
                CantidadHabitaciones: 1,
                Habitacion: { HabitacionId: j.HabitacionId },
                Entrada: this.inDate,
                Salida: this.outDate,
              };
              try {
                let r = await authGetRoomPrice(sf);
                if (
                  r.data.length != 0 &&
                  // && r.data[0].OrdenAlojamientoId != -1
                  r.data[0].PrecioOrden != 0
                ) {
                  atLeastOne = true;
                  this.roomsResult.push({
                    habitacion: r.data[0],
                    CantAdultos: ca,
                    CantidadMenores: cm,
                    PA: pa.data,
                    id: uuid.v4(),
                  });
                }
              } catch (e) {
                console.log(e);
              }
            })
          );
        })
      );
      if (!atLeastOne) {
        this.roomsSelecting = false;
      }
      this.loading = false;
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
.lodging-detail-wrapper {
  margin-left: 9.375% !important;
}
.lodging-detail-wrapper .left-side-wrapper {
  position: relative;
}
.lodging-detail-wrapper .left-side {
  top: 135px;
}
.check-sp {
  margin-right: 10px;
}
.lic-carousel {
  width: 45.8vw;
  height: 616px;
}
.lic-carousel .result-images-carousel img {
  height: 616px;
}
.lic-carousel .result-images-carousel {
  height: 100%;
  padding: 0;
  position: relative;
}
.bgHolder {
  top: 0;
  background: linear-gradient(
    0deg,
    rgba(68, 68, 71, 0.6334908963585435) 0%,
    rgba(0, 0, 0, 0) 15%,
    rgba(0, 121, 255, 0) 100%
  );
}
.lodging-info-info {
  padding-left: 30px;
  padding-right: 15px;
  padding-top: 15px;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
  background: #f5f5f5;
  padding-bottom: 5px;
  width: 14.2vw;
}
.lodging-info-stars .stars {
  color: #6d6d6d;
}
#pai .verify-step-title {
  background: #fff;
}
#pai .info-box {
  border: 1px solid #6d6d6d;
  width: 60vw;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
  border-bottom-left-radius: 10px;
}
.rooms-disponibility-form {
  padding-top: 5px;
  padding-bottom: 5px;
  background: #f5f5f5;
  height: 60px;
  margin-bottom: 15px;
}
.room-form-item {
  margin-right: 5px;
}
.room-form-item.last {
  margin-right: 60px;
}
.list-item-select {
  text-align: center;
  padding-bottom: 10px;
}
.selected-rooms {
  border: 1px solid #6d6d6d;
  margin-top: 30px;
  min-height: 100px;
  border-radius: 10px;
  padding: 15px;
}
.selected-rooms .selected-rooms-title {
  text-align: center;
  /* padding-top: 15px; */
  padding-bottom: 15px;
  text-transform: uppercase;
}
.selected-rooms .selected-rooms-empty {
  text-align: center;
}
.selected-rooms .selected-rooms-btn {
  font-size: 14px;
  height: 30px;
  margin-right: 5px;
}
.selected-rooms .btn-cart {
  width: 50px;
}
.selected-rooms .selected-rooms-footer {
  margin-top: 30px;
}
.lodging-detail-header {
  background: #f5f5f5;
  margin-bottom: 45px;
  padding: 10px;
}
.star-wrapper {
  position: relative;
}
.header-star .icon {
  color: #bcd01b;
  font-size: 60px;
  line-height: 1;
  /* position: absolute; */
}
.header-star .total-stars {
  color: #212f3d;
  line-height: 1;
  font-size: 30px;
  position: absolute;
  -webkit-transform: translate(0, 50%);
  left: 20px;
}
.headers-buttons {
  margin-top: 30px;
}
.headers-buttons button {
  width: auto;
  background: transparent !important;
}
.headers-buttons button:hover {
  background: #212f3d !important;
  color: #fff !important;
}
.result-text {
  font-size: 18px;
}
.buscando {
  justify-content: center;
  align-items: center;
}
.lodging-info-carousel {
  position: relative;
}
.footer-buttons-carousel {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding-bottom: 5px;
  padding-right: 15px;
  padding-left: 15px;
}
.footer-buttons-carousel i {
  color: white;
  font-size: 28px;
  margin-left: auto;
}
.footer-buttons-carousel i:hover {
  cursor: pointer;
}
</style>
