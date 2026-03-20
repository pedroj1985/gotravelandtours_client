<template>
  <div id="lodging-form">
    <GttModalSearch v-if="isModalActive" @searchingFinished="desactivateModal">
      <div slot="image">
        <img src="img/icopaq_alojamiento_color.svg" alt />
      </div>
      <div slot="searching-text" class="searching-text">
        <span class="antonio-light">Buscando disponibilidad de</span>
        <span class="antonio-bold text-highlight pl-1">alojamientos</span>
        <span class="antonio-light">
          en
          <span v-if="selectedLodgingDestinyValue">
            {{
            selectedLodgingDestinyValue.nombre
            }}
          </span>
          <span v-else>cualquier lugar</span>
        </span>
      </div>
      <div slot="searching-fields" class="searching-fields">
        <div>
          entre el {{ constructDate(selectedArriveDate) }} y el
          {{ constructDate(selectedDepartureDate) }} ({{
          calculateNights(selectedArriveDate, selectedDepartureDate)
          }}
          noches)
        </div>
        <div v-if="selectedRoomLayout">para {{ constructDisplay(selectedRoomLayout) }}</div>
      </div>
    </GttModalSearch>
    <div ref="gttDestinyLodging">
      <gtt-select
        :openedLodging.sync="lodgingOpened"
        @click.native="loadDestinies"
        v-model="selectedLodgingDestinyValue"
        :options="destinies"
      >
        <i slot="iconSelectedValue" class="mdi mdi-map-marker"></i>
        <span slot="placeholder" class="required-field">Destino</span>
        <span slot="selectedPlaceholder">¿Dónde desea alojarse?</span>
        <template v-slot:option="option">{{ option.option.nombre }}</template>
        <template v-slot:selectedValue="selectedValue">{{ selectedValue.selectedValue.nombre }}</template>
        <span slot="error" class="gtt-errors"></span>
      </gtt-select>
    </div>
    <div ref="gttStartDate">
      <gtt-select-date
        v-model="selectedArriveDate"
        :min-date="minArriveDate"
        :mode="'single'">
        <i slot="iconSelectedValue" class="mdi mdi-calendar-today"></i>
        <span slot="placeholder" class="required-field">Fecha de entrada</span>
        <span slot="error" class="gtt-errors"></span>
      </gtt-select-date>
    </div>
    <div ref="gttEndDate">
      <gtt-select-date
        v-model="selectedDepartureDate"
        :min-date="minDepartureDate"
        :mode="'single'">
        <i slot="iconSelectedValue" class="mdi mdi-calendar-today"></i>
        <span slot="placeholder" class="required-field">Fecha de salida</span>
        <span slot="error" class="gtt-errors"></span>
      </gtt-select-date>
    </div>
    <gtt-select-form :options="roomLayout" v-model="selectedRoomLayout">
      <span slot="iconSelectedValue">
        <i class="mdi mdi-account"></i>
      </span>
      <span slot="placeholder" class="required-field">Visitantes</span>
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
        @click="returnToPreviousSearch">
        Regresar
      </button>
      <button
        type="submit"
        class="antonio-regular"
        @click="activateModal">
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
import { constructDate, calculateNights, constructDisplay } from "../../utils/utils";
import { lodgingUtilsMixin } from "../../mixins/lodgingUtilsMixin";
import { useModal } from "../../composables/useModal";
import { gttIsValid, renderValid, getValid } from "../../utils/validation";
import moment from "moment";

export default {
  mixins: [lodgingUtilsMixin],
  components: {
    GttSelect,
    GttSelectDate,
    GttSelectForm,
    GttModalSearch
  },
  beforeCreate() {
    this.modal = useModal(this);
  },
  computed: {
    minArriveDate() {
      return moment().add(4, "days").format("YYYY-MM-DD");
    },
    minDepartureDate() {
      let minDepartureDate = moment().add(7, "days").format("YYYY-MM-DD");
      if (this.selectedArriveDate) {
        minDepartureDate = moment(this.selectedArriveDate).add(this.selectedNights, "days").format("YYYY-MM-DD");
      }
      return minDepartureDate;
    },
  },
  watch: {
    propNationality: function(sn) {
      this.selectedNationality = sn;
    },
    propArriveDate(i) {
      this.selectedArriveDate = new Date(i);
    },
    propDepartureDate(i) {
      this.selectedDepartureDate = new Date(i);
    },
    propLodgingDestinyValue(i) {
      this.selectedLodgingDestinyValue = i;
    },
    selectedArriveDate(i) {
      if (moment(i).isAfter(this.selectedDepartureDate)) {
        this.selectedNights = 3;
        this.selectedDepartureDate = moment(i).add(this.selectedNights, "days").toDate();
        let n = moment(this.selectedDepartureDate).diff(this.selectedArriveDate, "days");
        this.selectedNights = n;
      }
    },
    selectedDepartureDate(i) {
      let n = moment(this.selectedDepartureDate).diff(
          this.selectedArriveDate,
          "days"
        );

        this.selectedNights = n;

      //return new Date(i);
    },
    selectedNights(i) {
      this.selectedDepartureDate = new Date(
        moment(this.selectedArriveDate).add(i, "days")
      );
    },
    selectedLodgingDestinyValue(i) {
      console.info('watch', i);
      return i;
    }
  },
  async created() {
    let t = await authGetRoomTypes();
    this.todosTipo = t.data;
    this.selectedRoomLayout = this.propRoomLayout;
    this.getSearchResults().then(res => {console.log('getSearchResults', res);
      if (Array.isArray(res) && res.length > 0 && this.$route.name === 'lodging-detail') {
        this.hasSearchResults = true;
      }
    });
  },
  methods: {
    constructDate,
    calculateNights,
    constructDisplay,
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
          value: this.selectedLodgingDestinyValue,
          lang: "es"
        },
        {
          rules: ["required", "dateAfter:selectedArriveDate"],
          name: "gttEndDate",
          value: this.selectedDepartureDate,
          lang: "es"
        },
        {
          rules: ["required"],
          name: "gttStartDate",
          value: this.selectedArriveDate,
          lang: "es"
        }
      ];

      return validator;
    },
    async returnToPreviousSearch() {
      let searchFilters = {
        Destiny: this.selectedLodgingDestinyValue,
        Region: {
          RegionId: this.selectedLodgingDestinyValue.id,
          RegionNombre: this.selectedLodgingDestinyValue.nombre
        },
        Cliente: { ClienteId: localStorage.getItem("cliente") },
        Entrada: this.selectedArriveDate,
        Salida: this.selectedDepartureDate,
        Visitantes: this.selectedRoomLayout,
        Nacionalidad: this.selectedNationality
      };

      let resultList = await this.searchPreviousResult();
      localStorage.setItem(
        "searchLodgingFilters",
        JSON.stringify(searchFilters)
      );
      console.log('desactivateModal');
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
        this.modal.open();
        await this.clearSerchResults();
        if (this.selectedLodgingDestinyValue.type == "RGN") {
          console.info('RGN', this);
          let region = { RegionId: this.selectedLodgingDestinyValue.id };
          let cliente = { ClienteId: localStorage.getItem("cliente") };
          let searchItem = {
            Entrada: this.selectedArriveDate,
            Salida: this.selectedDepartureDate,
            Region: region,
            Cliente: cliente
          };
          let searchFilters = {
            Destiny: this.selectedLodgingDestinyValue,
            Region: {
              RegionId: this.selectedLodgingDestinyValue.id,
              RegionNombre: this.selectedLodgingDestinyValue.nombre
            },
            Cliente: { ClienteId: localStorage.getItem("cliente") },
            Entrada: this.selectedArriveDate,
            Salida: this.selectedDepartureDate,
            Visitantes: this.selectedRoomLayout,
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
              console.log('desactivateModal');
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
        } else if (this.selectedLodgingDestinyValue.type == "HTL") {
          let searchFilters = {
            Destiny: this.selectedLodgingDestinyValue,
            NombreHotel: this.selectedLodgingDestinyValue.nombre,
            Cliente: { ClienteId: localStorage.getItem("cliente") },
            Entrada: this.selectedArriveDate,
            Salida: this.selectedDepartureDate,
            Visitantes: this.selectedRoomLayout,
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
                this.selectedLodgingDestinyValue.id
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
      this.modal.close();
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
      selectedLodgingDestinyValue:  this.propLodgingDestinyValue,
      selectedArriveDate: new Date(moment(this.propArriveDate)),
      selectedDepartureDate: new Date(moment(this.propDepartureDate)),
      selectedRoomLayout: null,
      selectedNationality: this.propNationality,
      selectedNights: 3,
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