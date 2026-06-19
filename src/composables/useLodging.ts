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
  searchPreviousResult
} from "../utils/lodgingSearchService";
import {
  saveSearchResult,
  getSearchResults,
  clearSearchResults,
  deleteDatabase
} from "../utils/searchPersistenceService";
import { visitantesToAcomodation } from "../utils/visitorTransformer";
import type { RoomLayout, RoomBuiltItem, AccommodationItem, VisitorLayout, RoomTypeInfo } from "../types/visitor";
import type { Combination } from "../types/api";

export function useLodging() {
  function roomCombination(adults: number, kids = 0): RoomLayout {
    return calculateRoomCombination(adults, kids, getTotalRooms);
  }

  function recursiveBuildRoom(list: RoomBuiltItem[], kids: number) {
    return distributeKidsToRooms(list, kids);
  }

  function buildComboV2(roomLayout: RoomLayout, helpers: { habitacionPorCantidadPersonas: (i: number, todosTipo: unknown) => RoomTypeInfo | undefined }, todosTipo: unknown) {
    return buildRoomComboV2(roomLayout, (i: number) =>
      helpers.habitacionPorCantidadPersonas(i, todosTipo)
    );
  }

  function buildCombo(roomLayout: RoomLayout, helpers: { habitacionPorCantidadPersonas: (i: number, todosTipo: unknown) => RoomTypeInfo | undefined }, todosTipo: unknown) {
    return buildRoomCombo(roomLayout, (i: number) =>
      helpers.habitacionPorCantidadPersonas(i, todosTipo)
    );
  }

  function buildIdCombo(roomLayout: RoomLayout, helpers: { habitacionPorCantidadPersonas: (i: number, todosTipo: unknown) => RoomTypeInfo | undefined }, todosTipo: unknown) {
    return buildRoomIdCombo(roomLayout, (i: number) =>
      helpers.habitacionPorCantidadPersonas(i, todosTipo)
    );
  }

  function existenCombinaciones(acomodacion: AccommodationItem[], combinaciones: Combination[]) {
    return existenCombinacionesEnHabitacion(acomodacion, combinaciones);
  }

  function existeAcomodacionEnLista(item: AccommodationItem, list: Combination[]) {
    return existeAcomodacion(item, list);
  }

  function validateRoom(adults: number, kids: number, availableCombos: Combination[]) {
    return isRoomCombinationAvailable(adults, kids, availableCombos);
  }

  function validateLayout(roomLayout: { adults?: number } | null | undefined) {
    return validateRoomLayout(roomLayout);
  }

  function canFulfill(requestedAccommodations: AccommodationItem[], availableRooms: AccommodationItem[]) {
    return canFulfillAccommodations(requestedAccommodations, availableRooms);
  }

  async function search(
    searchItem: Record<string, unknown>,
    combination: RoomLayout,
    combinationV2: RoomLayout | null = null,
    todosTipo: unknown,
    helpers: { habitacionPorCantidadPersonas: (i: number, todosTipo: unknown) => RoomTypeInfo | undefined }
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

  async function saveResult(result: unknown) {
    return await saveSearchResult(result);
  }

  async function executeQuery(query: Record<string, unknown>) {
    return await searchResult(query, null, null, null, null as unknown as { habitacionPorCantidadPersonas: (i: number, todosTipo: unknown) => RoomTypeInfo | undefined });
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

  function toAcomodation(visitantes: VisitorLayout[]) {
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
