/**
 * Visitor Data Transformation Service
 * Handles conversion between visitor formats and room layouts
 */

import _ from "lodash";

/**
 * Convert visitor layout to accommodation format
 * Transforms multiple visitor layouts into room accommodation objects
 * @param {Array} visitantes - Array of visitor layouts with layout property
 * @returns {Array} Array of accommodation objects grouped by room type
 */
export function visitantesToAcomodation(visitantes) {
  let result = [];

  visitantes.forEach(i => {
    let a = i.layout.find(j => {
      return j.code == "adults";
    });
    let k = i.layout.find(j => {
      return j.code == "kids";
    });

    let tipoHab = "";
    switch (a.value) {
      case 1:
        tipoHab = "Sencilla";
        break;
      case 2:
        tipoHab = "Doble";
        break;
      default:
        tipoHab = "Triple";
        break;
    }

    let obj = {
      adults: a.value,
      kids: k.value,
      habId: a.value,
      hab: tipoHab,
      code: `${tipoHab}-${k.value}`
    };
    result.push(obj);
  });

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
 * Extract adults and kids count from visitor layout
 * @param {Array} visitantes - Array of visitor layouts
 * @returns {Object} Object with totalAdults and totalKids properties
 */
export function extractVisitorCounts(visitantes) {
  let totalAdults = 0;
  let totalKids = 0;

  visitantes.forEach(v => {
    let adultsObj = v.layout.find(l => l.code === "adults");
    let kidsObj = v.layout.find(l => l.code === "kids");

    if (adultsObj) totalAdults += adultsObj.value;
    if (kidsObj) totalKids += kidsObj.value;
  });

  return {
    totalAdults,
    totalKids,
    totalVisitors: totalAdults + totalKids
  };
}

/**
 * Get summary string for visitor counts
 * @param {Array} visitantes - Array of visitor layouts
 * @returns {string} Human readable visitor summary (e.g., "2 adultos · 1 niño")
 */
export function getVisitorSummary(visitantes) {
  const { totalAdults, totalKids } = extractVisitorCounts(visitantes);
  return `${totalAdults} adultos · ${totalKids} niños`;
}

/**
 * Validate visitor configuration
 * @param {Array} visitantes - Array of visitor layouts
 * @returns {Object} Validation result with isValid and errors array
 */
export function validateVisitorConfiguration(visitantes) {
  const errors = [];

  if (!visitantes || visitantes.length === 0) {
    errors.push("Debe seleccionar al menos una habitación");
    return { isValid: false, errors };
  }

  visitantes.forEach((v, index) => {
    if (!v.layout) {
      errors.push(`Habitación ${index + 1} sin configuración`);
    }

    const adultsItem = v.layout?.find(l => l.code === "adults");
    if (!adultsItem || adultsItem.value === 0) {
      errors.push(`Habitación ${index + 1} debe tener al menos 1 adulto`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Merge visitor configurations
 * Combines multiple visitor configurations into one
 * @param {Array} configs - Array of visitor configurations
 * @returns {Array} Merged visitor configuration
 */
export function mergeVisitorConfigs(...configs) {
  return configs.flat().filter(Boolean);
}

/**
 * Create default visitor layout
 * Creates a basic visitor layout with specified adults and kids
 * @param {number} adults - Number of adults (default: 1)
 * @param {number} kids - Number of kids (default: 0)
 * @returns {Object} Default visitor layout object
 */
export function createDefaultVisitorLayout(adults = 1, kids = 0) {
  return {
    room: 1,
    layout: [
      {
        code: "adults",
        label: "Adultos",
        display: "adultos",
        value: adults
      },
      {
        code: "kids",
        label: "Menores",
        display: "menores",
        value: kids
      }
    ]
  };
}
