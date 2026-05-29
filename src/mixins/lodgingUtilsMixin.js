import {
  calculateRoomCombination,
  getTotalRooms,
  distributeKidsToRooms,
  buildRoomComboV2,
  buildRoomCombo,
  buildRoomIdCombo
} from "../utils/roomBuilder";
import {
  existenCombinacionesEnHabitacion,
  existeAcomodacion,
  isRoomCombinationAvailable,
  validateRoomLayout,
  canFulfillAccommodations
} from "../utils/accommodationValidator";
import {
  searchResult,
  searchPreviousResult,
  saveSearchResult,
  performSearch,
  getSearchResults,
  clearSearchResults,
  deleteDatabase
} from "../utils/lodgingSearchService";
import { visitantesToAcomodation } from "../utils/visitorTransformer";
import { hotelecSessionService } from "../utils/hotelecSessionService";


export const lodgingUtilsMixin = {
  data() {
    return {
      // Mixin is now a thin delegation layer for utility services
      // original stateful fields removed to avoid duplication
      // you can still add local state here if needed by components

      // cross-component/etc.
    };
  },
  methods: {
    roomCombination(adults, kids = 0) {
      return calculateRoomCombination(adults, kids, getTotalRooms);
    },
    getTotalRooms(obj) {
      return getTotalRooms(obj);
    },
    recursiveBuildRoom(list, kids) {
      return distributeKidsToRooms(list, kids);
    },
    buildRoomComboV2(roomLayout) {
      return buildRoomComboV2(roomLayout, i => this.$helpers.habitacionPorCantidadPersonas(i, this.todosTipo));
    },
    buildRoomCombo(roomLayout) {
      return buildRoomCombo(roomLayout, i => this.$helpers.habitacionPorCantidadPersonas(i, this.todosTipo));
    },
    buildRoomIdCombo(roomLayout) {
      return buildRoomIdCombo(roomLayout, i => this.$helpers.habitacionPorCantidadPersonas(i, this.todosTipo));
    },
    existenCombinacionesEnHabitacion(acomodacion, combinaciones) {
      return existenCombinacionesEnHabitacion(acomodacion, combinaciones);
    },
    existeAcomodacion(item, list) {
      return existeAcomodacion(item, list);
    },
    isRoomCombinationAvailable(adults, kids, availableCombos) {
      return isRoomCombinationAvailable(adults, kids, availableCombos);
    },
    validateRoomLayout(roomLayout) {
      return validateRoomLayout(roomLayout);
    },
    canFulfillAccommodations(requestedAccommodations, availableRooms) {
      return canFulfillAccommodations(requestedAccommodations, availableRooms);
    },
    async searchResult(searchItem, combination, combinationV2 = null) {
      return await searchResult(searchItem, combination, combinationV2, this.todosTipo, this.$helpers);
    },
    async searchPreviousResult() {
      return await searchPreviousResult();
    },
    async saveSearchResult(result) {
      return await saveSearchResult(result);
    },
    async performSearch(query) {
      const res = await performSearch(query);
      this.searchResult = res;
      return res;
    },
    async getSearchResults() {
      return await getSearchResults();
    },
    async clearSerchResults() {
      return await clearSearchResults();
    },
    async deleteDataBase() {
      return await deleteDatabase();
    },
    visitantesToAcomodation(visitantes) {
      return visitantesToAcomodation(visitantes);
    }
  }
};
