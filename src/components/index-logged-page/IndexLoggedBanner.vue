<template>
  <div id="home-logged-banner">
    <div class="home-logged-img">
      <img src="img/homelogin_img_form_alojamiento.jpg" alt />
    </div>
    <div class="navs-wrapper">
      <NavBar2 :menuLinks="menuLinks"></NavBar2>
    </div>
    <GttModalSearch v-if="isModalActive" @searchingFinished="desactivateModal">
      <div slot="image">
        <img src="img/icopaq_alojamiento_color.svg" alt />
      </div>
      <div slot="searching-text" class="searching-text">
        <span class="antonio-light">Buscando disponibilidad de</span>
        <span class="antonio-bold text-highlight pl-1">alojamientos</span>
        <span class="antonio-light">
          en
          <span v-if="selectedLodgingDestinyValue">{{
              selectedLodgingDestinyValue.nombre
            }}</span>
          <span v-else>cualquier lugar</span>
        </span>
      </div>
      <div slot="searching-fields" class="searching-fields">
        <div v-if="selectedStartDate && selectedEndDate">
          entre el {{ constructDate(selectedStartDate) }} y el
          {{ constructDate(selectedEndDate) }} ({{
            calculateNights(selectedStartDate, selectedEndDate)
          }}
          noches)
        </div>
        <div v-if="selectedRoomLayout">
          para
          <span class="pl-1">{{ constructDisplay(selectedRoomLayout) }}</span>
        </div>
      </div>
    </GttModalSearch>
    <div class="lodging-text-form custom-margin">
      <div class="lodging-text antonio-light">
        <span class="bannerText">Tenemos los mejores</span>
        <span class="yellow-words antonio-bold">alojamientos</span>
        <span class="bannerText">para usted y su familia</span>
      </div>
      <div class="lodging-form">
        <div ref="gttDestinyLodging" class="cleft" style="width: 100%;">
          <gtt-select
            :openedLodging.sync="lodgingOpened"
            @click.native="loadDestinies"
            v-model="selectedLodgingDestinyValue"
            :options="destinies"
          >
            <i slot="iconSelectedValue" class="mdi mdi-map-marker"></i>
            <span slot="placeholder" class="required-field"
            >Destino o Alojamiento</span
            >
            <span slot="selectedPlaceholder">¿Dónde desea alojarse?</span>
            <template v-slot:option="option">
              {{ option.option.nombre }}
            </template>
            <template v-slot:selectedValue="selectedValue">
              {{ selectedValue.selectedValue.nombre }}
            </template>
            <span slot="error" class="gtt-errors"></span>
          </gtt-select>
        </div>
        <div class="selects-inline">
          <div ref="gttStartDate" class="w-100 cleft">
            <gtt-select-date
              v-model="selectedStartDate"
              :mode="'single'"
              :min-date="minStartDate">
              <span slot="placeholder" class="required-field">
                Fecha de entrada
              </span>
              <i slot="iconSelectedValue" class="mdi mdi-calendar-today"></i>
              <span slot="error" class="gtt-errors"></span>
            </gtt-select-date>
          </div>
          <div ref="gttEndDate" class="w-100 cleft">
            <gtt-select-date
              v-model="selectedEndDate"
              :min-date="minEndDate"
              :mode="'single'">
              <span slot="placeholder" class="required-field"
              >Fecha de salida</span
              >
              <i slot="iconSelectedValue" class="mdi mdi-calendar-today"></i>
              <span slot="error" class="gtt-errors"></span>
            </gtt-select-date>
          </div>
          <div class="w-100">
            <gtt-select
              v-model="selectedNights"
              :options="[
                3,
                4,
                5,
                6,
                7,
                8,
                9,
                10,
                11,
                12,
                13,
                14,
                15,
                16,
                17,
                18,
                19,
                20,
                21,
                22,
                23,
                24,
                25,
                26,
                27,
                28,
                29,
                30
              ]"
              :search="false"
            >
              <span slot="placeholder">Noches</span>
              <span slot="selectedPlaceholder">¿Cuántas noches?</span>
              <template v-slot:option="option">
                {{ constructDisplayNights(option.option) }}
              </template>
              <template v-slot:selectedValue="selectedValue">
                {{ constructDisplayNights(selectedValue.selectedValue) }}
              </template>
            </gtt-select>
          </div>
        </div>
        <div class="selects-inline">
          <gtt-select-form
            :options="roomLayout"
            class="cleft"
            v-model="selectedRoomLayout"
          >
            <span slot="iconSelectedValue">
              <i class="mdi mdi-account"></i>
            </span>
            <span slot="placeholder" class="required-field">Visitantes</span>
          </gtt-select-form>
          <!--          <gtt-select
                      :options="countries"
                      v-model="selectedNationality"
                      class="select-countries"
                    >
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
                    </gtt-select>-->
        </div>
        <div class="form-actions text-right">
          <button
            type="submit"
            @click="activateModal"
            class="lodging-searchButton antonio-regular"
          >
            Buscar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NavBar2 from "../shared/NavBar2";
import GttSelect from "../custom-elements/GttSelect";
import GttSelectForm from "../custom-elements/GttSelectForm";
import GttSelectDate from "../custom-elements/GttSelectDate";
import GttModalSearch from "../custom-elements/GttModalSearch";
import moment from "moment";
import { eventBus } from "../../main";
import {
  authSearchRegions,
  authGetRoomTypes,
  authGetLodgingsAll
} from "../../utils/auth";
import { lodgingUtilsMixin } from "../../mixins/lodgingUtilsMixin";
import { gttIsValid, renderValid, getValid } from "../../utils/validation";

export default {
  components: {
    NavBar2,
    GttSelect,
    GttSelectForm,
    GttSelectDate,
    GttModalSearch
  },
  mixins: [lodgingUtilsMixin],
  async created() {
    this.searchCountriesPlaceholder();
    window.addEventListener("scroll", this.handleScroll);
    let t = await authGetRoomTypes();
    this.todosTipo = t.data;
  },
  destroyed() {
    window.removeEventListener("scroll", this.handleScroll);
  },
  computed: {
    minStartDate() {
      return moment().add(4, "days").format("YYYY-MM-DD");
    },
    minEndDate() {
      let minEndDate = moment().add(7, "days").format("YYYY-MM-DD");
      if (this.selectedStartDate) {
        minEndDate = moment(this.selectedStartDate).add(4, "days").format("YYYY-MM-DD");
      }
      return minEndDate;
    }
  },
  watch: {
    selectedEndDate(item) {
      let n = moment(this.selectedEndDate).diff(
        this.selectedStartDate,
        "days"
      );

      this.selectedNights = n;
    },
    selectedStartDate(item) {
      this.selectedEndDate = moment(item).add(4, "days").toDate();
      let n = moment(this.selectedEndDate).diff(this.selectedStartDate, "days");
      this.selectedNights = 3;
    },
    selectedNights(item) {
      this.selectedEndDate = new Date(
        moment(this.selectedStartDate).add(item, "days")
      );
    }
  },
  methods: {
    gttValidate() {
      let validator = [
        {
          rules: ["required"],
          name: "gttDestinyLodging",
          value: this.selectedLodgingDestinyValue,
          lang: "es"
        },
        {
          rules: ["required", "dateAfter:selectedStartDate"],
          name: "gttEndDate",
          value: this.selectedEndDate,
          lang: "es"
        },
        {
          rules: ["required"],
          name: "gttStartDate",
          value: this.selectedStartDate,
          lang: "es"
        }
      ];

      return validator;
    },
    async loadDestinies() {
      if (this.lodgingOpened == true) {
        let { data } = await authSearchRegions();
        let totalResult = [];
        data.forEach(item => {
          totalResult = totalResult.concat({
            nombre: item.Nombre,
            regionid: item.RegionId,
            type: "region"
          });
        });
        let l = await authGetLodgingsAll();
        l.data.forEach(i => {
          totalResult = totalResult.concat({
            nombre: i.Nombre,
            id: i.ProductoId,
            type: "alojamiento"
          });
        });
        this.destinies = totalResult;
      }
    },
    handleLodgingClose() {
      this.lodgingOpened = false;
    },
    handleScroll() {
      let height = window.innerHeight;
      if (
        height * 0.25 > this.$el.getBoundingClientRect().top &&
        height * 0 < this.$el.getBoundingClientRect().top
      ) {
        eventBus.$emit("componentScrolled", "lodging");
      }
    },
    async activateModal() {
      let iv = gttIsValid(this.gttValidate(), this);
      if (getValid(iv)) {
        this.isModalActive = true;
        if (this.selectedLodgingDestinyValue.type == "region") {
          let region = {
            RegionId: this.selectedLodgingDestinyValue.regionid
          };
          let cliente = { ClienteId: localStorage.getItem("cliente") };
          let searchItem = {
            Entrada: this.selectedStartDate,
            Salida: this.selectedEndDate,
            Region: region,
            Cliente: cliente
          };
          let searchFilters = {
            Destiny: this.selectedLodgingDestinyValue,
            Region: {
              RegionId: this.selectedLodgingDestinyValue.regionid,
              RegionNombre: this.selectedLodgingDestinyValue.nombre
            },
            Cliente: { ClienteId: localStorage.getItem("cliente") },
            Entrada: this.selectedStartDate,
            Salida: this.selectedEndDate,
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
              this.desactivateModal();
              this.$router.push({
                name: "resultLodging",
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
            console.log(error);
            this.desactivateModal();
            this.$toasted.show(
              "El servicio no está disponible en estos momentos",
              {
                type: "error"
              }
            );
          }
        } else if (this.selectedLodgingDestinyValue.type == "alojamiento") {
          let searchFilters = {
            Destiny: this.selectedLodgingDestinyValue,
            NombreHotel: this.selectedLodgingDestinyValue.nombre,
            Cliente: { ClienteId: localStorage.getItem("cliente") },
            Entrada: this.selectedStartDate,
            Salida: this.selectedEndDate,
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
    goToDetail(f, a, id) {
      localStorage.setItem("searchLodgingFilters", JSON.stringify(f));

      localStorage.setItem("searchLodgingAcomodation", JSON.stringify(a));

      this.$router.push({
        name: "lodging-detail",
        params: {
          id: id
        }
      });
    },
    desactivateModal() {
      this.isModalActive = false;
    },
    constructDate(date) {
      return moment(date)
        .locale("es")
        .format("DD MMM YYYY");
    },
    calculateNights(min, max) {
      return moment(min).diff(moment(max), "days") * -1;
    },
    constructDisplay(d) {
      let s = "";
      Object.keys(d).forEach(element => {
        s = s + " · " + d[element].value + " " + d[element].display;
      });

      return s.substring(2);
    },
    constructDisplayNights(n) {
      if (n == 1) {
        return `1 noche`;
      }
      return `${n} noches`;
    },
    searchCountriesPlaceholder() {
      let usa = this.countries.find(el => {
        return el.nombre == "Estados Unidos";
      });

      if (usa) {
        this.selectedNationality = usa;
      } else {
        this.selectedNationality = this.countries[0];
      }
    }
  },
  data() {
    return {
      menuLinks: [
        {
          name: "index",
          displayName: "Inicio",
          id: "home-logged-banner"
        },
        {
          name: "lodging",
          displayName: "alojamientos",
          id: "home-logged-banner"
        }
        /* {
           name: "car-rent",
           displayName: "renta de autos",
           id: "index-logged-rent-wrapper"
         },*/
      ],
      isModalActive: false,
      lodgingOpened: false,
      defaultFlagImgPath: "img/flags/",
      todosTipo: [],
      selectedLodgingDestinyValue: "",
      selectedRoomLayout: null,
      selectedStartDate: new Date(moment().add(4, "days")),
      selectedEndDate: new Date(moment().add(7, "days")),
      selectedNationality: null,
      destinies: [],
      selectedNights: 3,
      roomComb: null,
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
      ],
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
      ]
    };
  }
};
</script>

<style scoped>
#home-logged-banner {
  margin-top: 60px;
  width: 100%;
  height: 750px;
  position: relative;
}

#home-logged-banner img {
  width: 100%;
  height: 100%;
}

.lodging-text-form {
  position: absolute;
  display: flex;
  top: 26%;
  padding-left: 8vw;
}

.lodging-form {
  width: 39.06vw;
  height: 350px;
  background-color: #ffffff;
  box-shadow: 0.5px 2px 15px rgba(0, 0, 0, 15%);
  border-radius: 10px;
  padding: 1.5625vw;
}

.lodging-text {
  font-size: 48px;
  color: #ffffff;
  margin-top: 70px;
  height: auto;
  margin-right: 1.5625vw;
  line-height: 1.2;
  text-align: right;
  width: 24.74vw;
}

.lodging-form .lodging-form-select {
  border-radius: 5px;
  margin-bottom: 30px;
  height: 50px;
  font-size: 18px !important;
}

.lodging-form-big {
  width: 100%;
}

.lodging-form-small {
  width: 49.5%;
}

.left {
  margin-right: 1%;
}

.selects-inline {
  display: flex;
}

#home-logged-banner .select-flag {
  width: 30px;
  height: 20px;
  margin-right: 5px;
}

@media (max-width: 1440px) {
  #home-logged-banner {
    width: 100%;
    height: 100%;
  }

  .lodging-text-form {
    position: absolute;
    display: flex;
    top: 26%;
    padding-left: 8vw;
  }

  .lodging-form {
    height: 230px;
    width: 45.06vw;
  }

  .lodging-text {
    font-size: 36px;
  }

  #home-logged-banner .select-flag {
    width: 25px;
    height: 15px;
  }
}
</style>
