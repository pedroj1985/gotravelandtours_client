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

export function useLodging() {
  function roomCombination(adults, kids = 0) {
    return calculateRoomCombination(adults, kids, getTotalRooms);
  }

  function recursiveBuildRoom(list, kids) {
    return distributeKidsToRooms(list, kids);
  }

  function buildComboV2(roomLayout, helpers, todosTipo) {
    return buildRoomComboV2(roomLayout, i =>
      helpers.habitacionPorCantidadPersonas(i, todosTipo)
    );
  }

  function buildCombo(roomLayout, helpers, todosTipo) {
    return buildRoomCombo(roomLayout, i =>
      helpers.habitacionPorCantidadPersonas(i, todosTipo)
    );
  }

  function buildIdCombo(roomLayout, helpers, todosTipo) {
    return buildRoomIdCombo(roomLayout, i =>
      helpers.habitacionPorCantidadPersonas(i, todosTipo)
    );
  }

  function existenCombinaciones(acomodacion, combinaciones) {
    return existenCombinacionesEnHabitacion(acomodacion, combinaciones);
  }

  function existeAcomodacionEnLista(item, list) {
    return existeAcomodacion(item, list);
  }

  function validateRoom(adults, kids, availableCombos) {
    return isRoomCombinationAvailable(adults, kids, availableCombos);
  }

  function validateLayout(roomLayout) {
    return validateRoomLayout(roomLayout);
  }

  function canFulfill(requestedAccommodations, availableRooms) {
    return canFulfillAccommodations(requestedAccommodations, availableRooms);
  }

  async function search(
    searchItem,
    combination,
    combinationV2 = null,
    todosTipo,
    helpers
  ) {
    return await searchResult(
      searchItem,
      combination,
      combinationV2,
      todosTipo,
      helpers
    );
  }

  async function searchPrev() {
    return await searchPreviousResult();
  }

  async function saveResult(result) {
    return await saveSearchResult(result);
  }

  async function executeQuery(query) {
    return await performSearch(query);
  }

  async function getResults() {
    return await getSearchResults();
  }

  async function clearResults() {
    return await clearSearchResults();
  }

  async function deleteDB() {
    return await deleteDatabase();
  }

  function toAcomodation(visitantes) {
    return visitantesToAcomodation(visitantes);
  }

  return {
    roomCombination,
    getTotalRooms,
    recursiveBuildRoom,
    buildComboV2,
    buildCombo,
    buildIdCombo,
    existenCombinaciones,
    existeAcomodacionEnLista,
    validateRoom,
    validateLayout,
    canFulfill,
    search,
    searchPrev,
    saveResult,
    executeQuery,
    getResults,
    clearResults,
    deleteDB,
    toAcomodation
  };
}
