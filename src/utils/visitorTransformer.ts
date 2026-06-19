import _ from "lodash";
import type {
  VisitorLayout,
  VisitorAccommodation,
  VisitorAccommodationGrouped,
  VisitorCounts,
  VisitorValidation
} from "../types/visitor";

export function visitantesToAcomodation(
  visitantes: VisitorLayout[]
): VisitorAccommodationGrouped[] {
  let result: VisitorAccommodation[] = [];

  visitantes.forEach(i => {
    let a = i.layout.find(j => {
      return j.code == "adults";
    });
    let k = i.layout.find(j => {
      return j.code == "kids";
    });

    let tipoHab: string = "";
    switch (a!.value) {
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

    let obj: VisitorAccommodation = {
      adults: a!.value,
      kids: k!.value,
      habId: a!.value,
      hab: tipoHab as VisitorAccommodation["hab"],
      code: `${tipoHab}-${k!.value}`
    };
    result.push(obj);
  });

  let grouped = _.groupBy(result, function(i: VisitorAccommodation) {
    return i.code;
  });

  let temp: VisitorAccommodationGrouped[] = [];
  Object.entries(grouped).forEach(([k, v]) => {
    if (!v) return;
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

export function extractVisitorCounts(visitantes: VisitorLayout[]): VisitorCounts {
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

export function getVisitorSummary(visitantes: VisitorLayout[]): string {
  const { totalAdults, totalKids } = extractVisitorCounts(visitantes);
  return `${totalAdults} adultos · ${totalKids} niños`;
}

export function validateVisitorConfiguration(
  visitantes: VisitorLayout[] | null | undefined
): VisitorValidation {
  const errors: string[] = [];

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

export function mergeVisitorConfigs(
  ...configs: (VisitorLayout[] | null | undefined)[]
): VisitorLayout[] {
  return configs.flat().filter(Boolean) as VisitorLayout[];
}

export function createDefaultVisitorLayout(
  adults: number = 1,
  kids: number = 0
): VisitorLayout {
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
