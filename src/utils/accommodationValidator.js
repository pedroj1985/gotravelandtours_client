/**
 * Accommodation Validation Service
 * Validates and checks room availability and combinations
 */

/**
 * Check if accommodations exist in available room combinations
 * @param {Array} acomodacion - List of requested accommodations
 * @param {Array} combinaciones - List of available combinations
 * @returns {boolean} True if all accommodations can be fit
 */
export function existenCombinacionesEnHabitacion(acomodacion, combinaciones) {
  let existe = true;
  let pos = 0;
  let tam = acomodacion.length;

  while (existe && pos < tam) {
    let acomodacionExiste = existeAcomodacion(acomodacion[pos], combinaciones);
    if (!acomodacionExiste) {
      existe = false;
    }
    pos++;
  }

  return existe;
}

/**
 * Check if a specific accommodation exists in available combinations
 * @param {Object} item - Accommodation object with hab (room type) and kids
 * @param {Array} list - Available combinations
 * @returns {boolean} True if accommodation exists
 */
export function existeAcomodacion(item, list) {
  let ca = 1;
  if (item.hab == "Doble") ca = 2;
  if (item.hab == "Triple") ca = 3;

  let porHabitacion = list.filter(i => {
    return i.CantAdult == ca;
  });

  if (porHabitacion.length > 0) {
    let porNinos = porHabitacion.filter(i => {
      return i.CantNino == item.kids;
    });

    if (porNinos.length > 0) {
      return true;
    }
  }

  return false;
}

/**
 * Check if a specific room-kids combination is available
 * @param {number} adults - Number of adults
 * @param {number} kids - Number of kids
 * @param {Array} availableCombos - Available combinations
 * @returns {boolean} True if combination is available
 */
export function isRoomCombinationAvailable(adults, kids, availableCombos) {
  return availableCombos.some(combo => 
    combo.CantAdult === adults && combo.CantNino === kids
  );
}

/**
 * Validate room layout against required occupancy
 * @param {Object} roomLayout - Room layout with adults, kids, etc.
 * @returns {boolean} True if layout is valid
 */
export function validateRoomLayout(roomLayout) {
  if (!roomLayout) return false;
  
  const { adults = 0, kids = 0 } = roomLayout;
  
  // Must have at least one adult
  return adults > 0;
}

/**
 * Check if accommodations can be fulfilled by available rooms
 * @param {Array} requestedAccommodations - Requested accommodations
 * @param {Array} availableRooms - Available room types
 * @returns {boolean} True if all requested accommodations can be fulfilled
 */
export function canFulfillAccommodations(requestedAccommodations, availableRooms) {
  let availableRoomsCopy = [...availableRooms];

  for (const accommodation of requestedAccommodations) {
    let roomIndex = availableRoomsCopy.findIndex(room => {
      return room.hab === accommodation.hab && 
             room.kids >= accommodation.kids;
    });

    if (roomIndex === -1) {
      return false;
    }

    // Mark room as used
    availableRoomsCopy.splice(roomIndex, 1);
  }

  return true;
}
