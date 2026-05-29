/**
 * Room Building Utility Service
 * Handles all room combination and building logic
 */

import _ from "lodash";

/**
 * Calculate room combination based on number of adults and kids
 * @param {number} adults - Number of adults
 * @param {number} kids - Number of children (default: 0)
 * @param {Array} roomTypes - Available room types (opcional)
 * @returns {Object} Room combination object with dobles, triples, sencillas
 */
export function calculateRoomCombination(adults, kids = 0, getTotalRooms) {
  let result = null;

  if (kids == 0) {
    result = { kids: 0 };
    if (adults / 2 >= 1) {
      if (adults % 2 == 0) {
        result = {
          dobles: Math.floor(adults / 2),
          triples: 0,
          sencillas: 0
        };
      } else if (adults % 2 == 1) {
        result = {
          dobles: Math.floor(adults / 2) - 1,
          triples: 1,
          sencillas: 0
        };
      } else if (adults % 2 == 3) {
        result = {
          dobles: Math.floor(adults / 2),
          triples: 1,
          sencillas: 0
        };
      }
    }

    result = {
      dobles: 0,
      triples: 0,
      sencillas: 1
    };
  } else {
    result = { kids: kids };
    if (kids <= getTotalRooms(result)) {
      return result;
    } else {
      let doblesRest = Math.abs(adults - kids * 2);
      let tDobles = kids - doblesRest;
      let tSencillas = doblesRest;

      result = {
        dobles: tDobles,
        triples: 0,
        sencillas: tSencillas
      };
    }
  }

  return result;
}

/**
 * Get total number of rooms from layout object
 * @param {Object} obj - Room layout object with dobles, triples, sencillas
 * @returns {number} Total number of rooms
 */
export function getTotalRooms(obj) {
  let totalDobles = obj.dobles || 0;
  let totalTriples = obj.triples || 0;
  let totalSencillas = obj.sencillas || 0;

  return totalDobles + totalTriples + totalSencillas;
}

/**
 * Recursively distribute kids across available rooms
 * @param {Array} list - List of room objects
 * @param {number} kids - Number of kids to distribute
 * @returns {boolean} True when distribution is complete
 */
export function distributeKidsToRooms(list, kids) {
  let pos = 0;
  let stop = false;
  let tempKids = kids;

  while (pos < list.length && !stop) {
    let hab = list[pos];
    if (tempKids != 0) {
      hab.kids += 1;
      tempKids--;
      pos++;
    } else {
      stop = true;
    }
  }

  if (tempKids > 0) {
    return distributeKidsToRooms(list, tempKids);
  }

  return true;
}

/**
 * Build room combination with version 2 (simplified)
 * @param {Object} roomLayout - Room layout configuration
 * @param {Function} habitacionPorCantidadPersonas - Helper to get room by capacity
 * @returns {Array} Array of room objects
 */
export function buildRoomComboV2(roomLayout, habitacionPorCantidadPersonas) {
  let result = [];
  let d = habitacionPorCantidadPersonas(2);
  
  for (let i = 0; i < roomLayout.dobles; i++) {
    result.push({
      hab: d.Nombre,
      code: d.Nombre + "-" + 0,
      habId: d.TipoHabitacionId,
      kids: 0,
      adults: 2
    });
  }

  let s = habitacionPorCantidadPersonas(1);
  for (let i = 0; i < roomLayout.sencillas; i++) {
    result.push({
      hab: s.Nombre,
      code: s.Nombre + "-" + 0,
      habId: s.TipoHabitacionId,
      adults: 1,
      kids: 0
    });
  }

  if (roomLayout.kids > 0) {
    let k = roomLayout.kids;
    distributeKidsToRooms(result, k);
  }

  return result;
}

/**
 * Build room combination with full options (all room types)
 * @param {Object} roomLayout - Room layout configuration
 * @param {Function} habitacionPorCantidadPersonas - Helper to get room by capacity
 * @returns {Array} Grouped and processed room array
 */
export function buildRoomCombo(roomLayout, habitacionPorCantidadPersonas) {
  let result = [];
  let d = habitacionPorCantidadPersonas(2);
  
  for (let i = 0; i < roomLayout.dobles; i++) {
    result.push({
      hab: d.Nombre,
      code: d.Nombre + "-" + 0,
      habId: d.TipoHabitacionId,
      kids: 0,
      adults: 2
    });
  }

  let s = habitacionPorCantidadPersonas(1);
  for (let i = 0; i < roomLayout.sencillas; i++) {
    result.push({
      hab: s.Nombre,
      code: s.Nombre + "-" + 0,
      habId: s.TipoHabitacionId,
      adults: 1,
      kids: 0
    });
  }

  let t = habitacionPorCantidadPersonas(3);
  for (let i = 0; i < roomLayout.triples; i++) {
    result.push({
      hab: t.Nombre,
      code: t.Nombre + "-" + 0,
      habId: t.TipoHabitacionId,
      adults: 3,
      kids: 0
    });
  }

  if (roomLayout.kids > 0) {
    if (!roomLayout.kids2Room) {
      for (let i = 0; i < roomLayout.kids; i++) {
        result[i]["kids"] = 1;
        result[i]["code"] = result[i].hab + "-" + 1;
      }
    } else {
      let pos = 0;
      for (pos; pos < roomLayout.totalkids2RoomFill; pos++) {
        result[pos]["kids"] = 2;
        result[pos]["code"] = result[pos].hab + "-" + 2;
      }
      let fill = result.length - roomLayout.totalkids2RoomFill;
      for (pos; pos <= fill; pos++) {
        result[pos]["kids"] = 1;
        result[pos]["code"] = result[pos].hab + "-" + 1;
      }
    }
  }

  // Group by code
  result = _.groupBy(result, function(i) {
    return i.code;
  });

  let temp = [];
  Object.entries(result).forEach(([k, v]) => {
    temp.push({
      hab: v[0].hab,
      code: k,
      habId: v[0].habId,
      kids: v[0].kids,
      adults: v[0].adults,
      cantidad: v.length
    });
  });

  return temp;
}

/**
 * Build room ID combination from layout
 * @param {Object} roomLayout - Room layout configuration
 * @param {Function} habitacionPorCantidadPersonas - Helper to get room by capacity
 * @returns {Array} Array of room ID combinations
 */
export function buildRoomIdCombo(roomLayout, habitacionPorCantidadPersonas) {
  let result = [];

  if (roomLayout.sencillas > 0) {
    let i = habitacionPorCantidadPersonas(1);
    if (i) {
      result.push({
        hab: i.Nombre,
        habId: i.TipoHabitacionId,
        cantidad: roomLayout.sencillas
      });
    }
  }

  if (roomLayout.dobles > 0) {
    let i = habitacionPorCantidadPersonas(2);
    if (i) {
      result.push({
        hab: i.Nombre,
        habId: i.TipoHabitacionId,
        cantidad: roomLayout.dobles
      });
    }
  }

  if (roomLayout.triples > 0) {
    let i = habitacionPorCantidadPersonas(3);
    if (i) {
      result.push({
        hab: i.Nombre,
        habId: i.TipoHabitacionId,
        cantidad: roomLayout.triples
      });
    }
  }

  return result;
}
