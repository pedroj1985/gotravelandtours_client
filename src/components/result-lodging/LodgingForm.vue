<template>
  <div id="lodging-form">
    <GttModalSearch v-if="isModalActive" @searchingFinished="desactivateModal">
      <template #image>
        <img src="/img/icopaq_alojamiento_color.svg" alt="" />
      </template>
      <template #searching-text>
        <div class="searching-text">
          <span class="antonio-light">Buscando disponibilidad de</span>
          <span class="antonio-bold text-highlight pl-1">alojamientos</span>
          <span class="antonio-light">
            en
            <span v-if="hotel">
              {{ hotel.nombre }}
            </span>
            <span v-else>cualquier lugar</span>
          </span>
        </div>
      </template>
      <template #searching-fields>
        <div class="searching-fields">
        <div>
          entre el {{ constructDate(checkin) }} y el
          {{ constructDate(checkout) }} ({{ nights }} noches)
        </div>
        <div v-if="adults || children">
          para {{ visitorsDisplay }}
        </div>
        </div>
      </template>
    </GttModalSearch>
    <div ref="gttDestinyLodging">
      <gtt-select
        v-model:openedLodging="lodgingOpened"
        :model-value="hotel"
        @update:model-value="setHotel"
        :options="destinies"
        :alignLeft="true"
      >
        <template #iconSelectedValue>
          <i class="mdi mdi-map-marker"></i>
        </template>
        <template #placeholder>
          <span class="required-field">Destino</span>
        </template>
        <template #selectedPlaceholder>¿Dónde desea alojarse?</template>
        <template #option="option">{{ option.option.nombre }}</template>
        <template #selectedValue="selectedValue">{{
          selectedValue.selectedValue.nombre
        }}</template>
        <template #error><span class="gtt-errors"></span></template>
      </gtt-select>
    </div>
    <div ref="gttStartDate">
      <gtt-select-date
        :model-value="checkin"
        @update:model-value="setCheckin"
        :min-date="minArriveDate"
        :mode="'single'"
      >
        <template #iconSelectedValue>
          <i class="mdi mdi-calendar-today"></i>
        </template>
        <template #placeholder>
          <span class="required-field">Fecha de entrada</span>
        </template>
        <template #error><span class="gtt-errors"></span></template>
      </gtt-select-date>
    </div>
    <div ref="gttEndDate">
      <gtt-select-date
        :model-value="checkout"
        @update:model-value="setCheckout"
        :min-date="minDepartureDate"
        :mode="'single'"
      >
        <template #iconSelectedValue>
          <i class="mdi mdi-calendar-today"></i>
        </template>
        <template #placeholder>
          <span class="required-field">Fecha de salida</span>
        </template>
        <template #error><span class="gtt-errors"></span></template>
      </gtt-select-date>
    </div>
    <gtt-select-form
      :options="roomLayout"
      :model-value="visitorsLayout"
      @update:model-value="applyVisitors"
    >
      <template #iconSelectedValue>
        <span><i class="mdi mdi-account"></i></span>
      </template>
      <template #placeholder>
        <span class="required-field">Visitantes</span>
      </template>
    </gtt-select-form>
    <!-- <gtt-select-form :options="rooms" v-model="selectedRooms">
            <span slot="iconSelectedValue"><i class="mdi mdi-bunk-bed"></i></span>
            <span slot="placeholder">Habitaciones</span>
    </gtt-select-form>-->
    <!-- <gtt-select :options="countries" v-model="selectedNationality">
      <i slot="iconSelectedValue" class="mdi mdi-earth"></i>
      <span slot="placeholder">Nacionalidad</span>
      <template v-slot:selectedValue="selectedValue">
        <img
          :src="defaultFlagImgPath + selectedValue.selectedValue.flag"
          :alt="selectedValue.selectedValue.nombre + 'flag'"
          class="select-flag"
        />
        {{ selectedValue.selectedValue.nombre }}
      </template>
      <template v-slot:option="option">
        <img
          :src="defaultFlagImgPath + option.option.flag"
          :alt="option.option.nombre + 'flag'"
          class="select-flag"
        />
        {{ option.option.nombre }}
      </template>
      <template slot="selectedPlaceholder">
        <img
          :src="defaultFlagImgPath + selectedNationality.flag"
          :alt="selectedNationality.nombre + 'flag'"
          class="select-flag"
        />
        {{ selectedNationality.nombre }}
      </template>
    </gtt-select> -->
    <div class="form-actions lodging-form-search-btn">
      <button
        v-if="hasSearchResults"
        type="submit"
        class="antonio-regular regresar"
        @click="returnToPreviousSearch"
      >
        Regresar
      </button>
      <button type="submit" class="antonio-regular" @click="activateModal">
        Buscar
      </button>
    </div>
  </div>
</template>

<script>
import GttSelect from "../custom-elements/GttSelect";
import GttSelectDate from "../custom-elements/GttSelectDate";
import GttSelectForm from "../custom-elements/GttSelectForm";
import GttModalSearch from "../custom-elements/GttModalSearch";
import {
  authSearchRegions,
  authGetRoomTypes,
  authGetLodgingsAll,
  authGetHotelList
} from "../../utils/auth";
import {
  constructDate
} from "../../utils/utils";
import { lodgingUtilsMixin } from "../../mixins/lodgingUtilsMixin";
import { gttIsValid, renderValid, getValid } from "../../utils/validation";
import moment from "moment";
import { useBooking } from "../../composables/useBooking";

export default {
  mixins: [lodgingUtilsMixin],
  components: {
    GttSelect,
    GttSelectDate,
    GttSelectForm,
    GttModalSearch
  },
  computed: {
    minArriveDate() {
      return moment()
        .add(4, "days")
        .format("YYYY-MM-DD");
    },
    minDepartureDate() {
      let minDepartureDate = moment()
        .add(7, "days")
        .format("YYYY-MM-DD");
      if (this.checkin) {
        minDepartureDate = moment(this.checkin)
          .add(this.nights, "days")
          .format("YYYY-MM-DD");
      }
      return minDepartureDate;
    },
    visitorsLayout() {
      return {
        adults: {
          code: "adults",
          label: "Adultos",
          display: "Adulto(s)",
          value: this.adults
        },
        kids: {
          code: "kids",
          label: "Niños",
          display: "Niño(s)",
          value: this.children
        }
      };
    },
    visitorsDisplay() {
      return `${this.adults} Adulto(s) · ${this.children} Niño(s)`;
    }
  },
  watch: {
    lodgingOpened(val) {
      if (val) this.loadDestinies();
    },
    propNationality: function(sn) {
      this.selectedNationality = sn;
    },
    propArriveDate(i) {
      this.setCheckin(i);
    },
    propDepartureDate(i) {
      this.setCheckout(i);
    },
    propLodgingDestinyValue(i) {
      this.setHotel(i);
    }
  },
  setup(props) {
    let adults = 1;
    let children = 0;
    if (props.propRoomLayout) {
      if (props.propRoomLayout.adults) {
        adults = props.propRoomLayout.adults.value || 1;
      }
      if (props.propRoomLayout.kids) {
        children = props.propRoomLayout.kids.value || 0;
      }
    }
    return useBooking({
      hotel: props.propLodgingDestinyValue,
      checkin: moment(props.propArriveDate).toDate(),
      checkout: moment(props.propDepartureDate).toDate(),
      adults,
      children
    });
  },
  async created() {
    let t = await authGetRoomTypes();
    this.todosTipo = t.data;
    this.getSearchResults().then(res => {
      console.log("getSearchResults", res);
      if (
        Array.isArray(res) &&
        res.length > 0 &&
        this.$route.name === "lodging-detail"
      ) {
        this.hasSearchResults = true;
      }
    });
  },
  methods: {
    constructDate,
    goToDetail(f, a, id) {
      const currentRoute = this.$route;

      localStorage.setItem("searchLodgingFilters", JSON.stringify(f));

      localStorage.setItem("searchLodgingAcomodation", JSON.stringify(a));

      if (currentRoute.params.id != parseInt(id)) {
        this.$router.push({
          name: "lodging-detail",
          params: {
            id: id
          }
        });
      } else {
        this.$router.go(0);
        this.$router.push({
          name: "lodging-detail",
          params: {
            id: id
          }
        });
      }
    },
    gttValidate() {
      let validator = [
        {
          rules: ["required"],
          name: "gttDestinyLodging",
          value: this.hotel,
          lang: "es"
        },
        {
          rules: ["required", "dateAfter:checkin"],
          name: "gttEndDate",
          value: this.checkout,
          lang: "es"
        },
        {
          rules: ["required"],
          name: "gttStartDate",
          value: this.checkin,
          lang: "es"
        }
      ];

      return validator;
    },
    async returnToPreviousSearch() {
      let searchFilters = {
        Destiny: this.hotel,
        Region: {
          RegionId: this.hotel.id,
          RegionNombre: this.hotel.nombre
        },
        Cliente: { ClienteId: localStorage.getItem("cliente") },
        Entrada: this.checkin,
        Salida: this.checkout,
        Visitantes: this.visitorsLayout,
        Nacionalidad: this.selectedNationality
      };

      let resultList = await this.searchPreviousResult();
      localStorage.setItem(
        "searchLodgingFilters",
        JSON.stringify(searchFilters)
      );
      console.log("desactivateModal");
      this.desactivateModal();
      this.$router.push({
        name: "lodgingResultHolder",
        params: {
          searchResult: resultList
        }
      });
    },
    async activateModal() {
      let iv = gttIsValid(this.gttValidate(), this);
      if (getValid(iv)) {
        this.isModalActive = true;
        await this.clearResults();
        if (this.hotel.type == "RGN") {
          console.info("RGN", this);
          let region = { RegionId: this.hotel.id };
          let cliente = { ClienteId: localStorage.getItem("cliente") };
          let searchItem = {
            Entrada: this.checkin,
            Salida: this.checkout,
            Region: region,
            Cliente: cliente
          };
          let searchFilters = {
            Destiny: this.hotel,
            Region: {
              RegionId: this.hotel.id,
              RegionNombre: this.hotel.nombre
            },
            Cliente: { ClienteId: localStorage.getItem("cliente") },
            Entrada: this.checkin,
            Salida: this.checkout,
            Visitantes: this.visitorsLayout,
            Nacionalidad: this.selectedNationality
          };
          let resultList = [];
          try {
            if (
              searchFilters.Visitantes.adults.value >=
              searchFilters.Visitantes.kids.value
            ) {
              this.roomComb = this.$helpers.roomCombination(
                searchFilters.Visitantes.adults.value,
                searchFilters.Visitantes.kids.value || 0
              );
            } else {
              this.roomComb = this.$helpers.roomCombination2kids(
                searchFilters.Visitantes.adults.value,
                searchFilters.Visitantes.kids.value || 0
              );
            }
            let roomComb2 = this.$helpers.roomCombinationV2(
              searchFilters.Visitantes.adults.value,
              searchFilters.Visitantes.kids.value || 0
            );
            if (this.roomComb != "ERROR") {
              resultList = await this.searchResult(
                searchItem,
                this.roomComb,
                roomComb2
              );
              localStorage.setItem(
                "searchLodgingFilters",
                JSON.stringify(searchFilters)
              );
              console.log("desactivateModal");
              this.desactivateModal();
              this.$router.push({
                name: "lodgingResultHolder",
                params: {
                  searchResult: resultList
                }
              });
            } else {
              this.desactivateModal();
              this.$toasted.show("Demasiados niños", {
                type: "error"
              });
            }
          } catch (error) {
            this.desactivateModal();
            this.$toasted.show(
              "El servicio no está disponible en estos momentos",
              {
                type: "error"
              }
            );
          }
        } else if (this.hotel.type == "HTL") {
          let searchFilters = {
            Destiny: this.hotel,
            NombreHotel: this.hotel.nombre,
            Cliente: { ClienteId: localStorage.getItem("cliente") },
            Entrada: this.checkin,
            Salida: this.checkout,
            Visitantes: this.visitorsLayout,
            Nacionalidad: this.selectedNationality
          };
          try {
            if (
              searchFilters.Visitantes.adults.value >=
              searchFilters.Visitantes.kids.value
            ) {
              this.roomComb = this.$helpers.roomCombination(
                searchFilters.Visitantes.adults.value,
                searchFilters.Visitantes.kids.value || 0
              );
            } else {
              this.roomComb = this.$helpers.roomCombination2kids(
                searchFilters.Visitantes.adults.value,
                searchFilters.Visitantes.kids.value || 0
              );
            }
            if (this.roomComb != "ERROR") {
              this.goToDetail(
                searchFilters,
                this.buildRoomCombo(this.roomComb),
                this.hotel.id
              );
            } else {
              this.desactivateModal();
              this.$toasted.show("Demasiados niños", {
                type: "error"
              });
            }
          } catch (error) {
            console.log(error);
            this.desactivateModal();
            this.$toasted.show(
              "El servicio no está disponible en estos momentos",
              {
                type: "error"
              }
            );
          }
        }
      } else {
        renderValid(iv, this);
      }
    },
    desactivateModal() {
      this.isModalActive = false;
    },
    applyVisitors(layout) {
      if (layout && layout.adults) {
        this.setAdults(layout.adults.value);
      }
      if (layout && layout.kids) {
        this.setChildren(layout.kids.value);
      }
    },
    async loadDestinies() {
      if (this.lodgingOpened == true) {
        //let { data } = await authSearchRegions();
        let totalResult = [];
        /* data.forEach(item => {
          totalResult = totalResult.concat({
            nombre: item.Nombre,
            regionid: item.RegionId,
            type: "region"
          });
        }); */
        /* let l = await authGetLodgingsAll();
        l.data.forEach(i => {
          totalResult = totalResult.concat({
            nombre: i.Nombre,
            id: i.ProductoId,
            type: "alojamiento"
          });
        }); */
        let l = await authGetHotelList();
        l.data.forEach(i => {
          totalResult = totalResult.concat({
            nombre: i.Nombre,
            id: i.IdObjeto,
            type: i.TipoObjeto
          });
        });
        this.destinies = totalResult;
      }
    },
    searchCountriesPlaceholder() {
      let usa = this.countries.find(el => {
        return el.value == "Estados Unidos";
      });

      if (usa) {
        return usa;
      } else {
        return this.countries[0];
      }
    }
  },
  props: {
    propLodgingDestinyValue: {
      default: null
    },
    propArriveDate: {
      default: function() {
        return moment();
      }
    },
    propDepartureDate: {
      default: function() {
        return moment().add(3, "days");
      }
    },
    propRoomLayout: {
      default: null
    },
    propNationality: {
      default: function() {
        return {
          nombre: "Estados Unidos",
          flag: "flag_estadosunidos.jpg"
        };
      }
    }
  },
  data() {
    return {
      selectedNationality: this.propNationality,
      roomComb: null,
      todosTipo: [],
      hasSearchResults: false,
      isModalActive: false,
      lodgingOpened: false,
      destinies: [],
      defaultFlagImgPath: "img/flags/",
      countries: [
        {
          nombre: "Afganistán",
          flag: "flag_afganistan.jpg"
        },
        {
          nombre: "Albania",
          flag: "flag_albania.jpg"
        },
        {
          nombre: "Alemania",
          flag: "flag_alemania.jpg"
        },
        {
          nombre: "Estados Unidos",
          flag: "flag_estadosunidos.jpg"
        }
      ],
      roomLayout: [
        {
          code: "adults",
          label: "Adultos",
          display: "Adulto(s)",
          default: 1
        },
        {
          code: "kids",
          label: "Niños",
          display: "Niño(s)",
          default: 0
        }
      ]
    };
  }
};
</script>

<style scoped>
#lodging-form {
  width: 100%;
  /* height: 100%; */
  padding: 15px;
  background-color: #bcd01b;
  border-radius: 10px;
}
.lodging-form-search-btn {
  text-align: right;
}
#lodging-form .gtt__toggle {
  margin-bottom: 15px;
}
.antonio-regular.regresar {
  margin-right: 14px;
}
</style>
