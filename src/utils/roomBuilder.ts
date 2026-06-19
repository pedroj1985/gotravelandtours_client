import _ from "lodash";
import type { RoomLayout, RoomBuiltItem, RoomGroupedItem, RoomIdComboItem, RoomTypeInfo } from "../types/visitor";

export type GetTotalRoomsFn = (layout: RoomLayout) => number;
export type HabitacionPorCantidadPersonasFn = (capacity: number) => RoomTypeInfo | undefined;

export function calculateRoomCombination(
  adults: number,
  kids: number = 0,
  getTotalRooms: GetTotalRoomsFn
): RoomLayout {
  let result: RoomLayout | null = null;

  if (kids == 0) {
    result = { kids: 0, dobles: 0, triples: 0, sencillas: 0 };
    if (adults / 2 >= 1) {
      if (adults % 2 == 0) {
        result = {
          dobles: Math.floor(adults / 2),
          triples: 0,
          sencillas: 0
        };
      } else {
        result = {
          dobles: Math.floor(adults / 2) - 1,
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
    result = { kids: kids, dobles: 0, triples: 0, sencillas: 0 };
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

export function getTotalRooms(obj: { dobles?: number; triples?: number; sencillas?: number }): number {
  let totalDobles = obj.dobles || 0;
  let totalTriples = obj.triples || 0;
  let totalSencillas = obj.sencillas || 0;

  return totalDobles + totalTriples + totalSencillas;
}

export function distributeKidsToRooms(list: RoomBuiltItem[], kids: number): boolean {
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

export function buildRoomComboV2(
  roomLayout: RoomLayout,
  habitacionPorCantidadPersonas: HabitacionPorCantidadPersonasFn
): RoomBuiltItem[] {
  let result: RoomBuiltItem[] = [];
  let d = habitacionPorCantidadPersonas(2);

  if (d) {
    for (let i = 0; i < roomLayout.dobles; i++) {
      result.push({
        hab: d.Nombre,
        code: d.Nombre + "-" + 0,
        habId: d.TipoHabitacionId,
        kids: 0,
        adults: 2
      });
    }
  }

  let s = habitacionPorCantidadPersonas(1);
  if (s) {
    for (let i = 0; i < roomLayout.sencillas; i++) {
      result.push({
        hab: s.Nombre,
        code: s.Nombre + "-" + 0,
        habId: s.TipoHabitacionId,
        adults: 1,
        kids: 0
      });
    }
  }

  if (roomLayout.kids && roomLayout.kids > 0) {
    let k = roomLayout.kids;
    distributeKidsToRooms(result, k);
  }

  return result;
}

export function buildRoomCombo(
  roomLayout: RoomLayout,
  habitacionPorCantidadPersonas: HabitacionPorCantidadPersonasFn
): RoomGroupedItem[] {
  let result: RoomBuiltItem[] = [];

  let d = habitacionPorCantidadPersonas(2);
  if (d) {
    for (let i = 0; i < roomLayout.dobles; i++) {
      result.push({
        hab: d.Nombre,
        code: d.Nombre + "-" + 0,
        habId: d.TipoHabitacionId,
        kids: 0,
        adults: 2
      });
    }
  }

  let s = habitacionPorCantidadPersonas(1);
  if (s) {
    for (let i = 0; i < roomLayout.sencillas; i++) {
      result.push({
        hab: s.Nombre,
        code: s.Nombre + "-" + 0,
        habId: s.TipoHabitacionId,
        adults: 1,
        kids: 0
      });
    }
  }

  let t = habitacionPorCantidadPersonas(3);
  if (t) {
    for (let i = 0; i < roomLayout.triples; i++) {
      result.push({
        hab: t.Nombre,
        code: t.Nombre + "-" + 0,
        habId: t.TipoHabitacionId,
        adults: 3,
        kids: 0
      });
    }
  }

  if (roomLayout.kids && roomLayout.kids > 0) {
    if (!roomLayout.kids2Room) {
      for (let i = 0; i < roomLayout.kids; i++) {
        result[i]["kids"] = 1;
        result[i]["code"] = result[i].hab + "-" + 1;
      }
    } else {
      let pos = 0;
      for (pos; pos < (roomLayout.totalkids2RoomFill ?? 0); pos++) {
        result[pos]["kids"] = 2;
        result[pos]["code"] = result[pos].hab + "-" + 2;
      }
      let fill = result.length - (roomLayout.totalkids2RoomFill ?? 0);
      for (pos; pos <= fill; pos++) {
        result[pos]["kids"] = 1;
        result[pos]["code"] = result[pos].hab + "-" + 1;
      }
    }
  }

  let grouped = _.groupBy(result, function(i: RoomBuiltItem) {
    return i.code;
  });

  let temp: RoomGroupedItem[] = [];
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

export function buildRoomIdCombo(
  roomLayout: RoomLayout,
  habitacionPorCantidadPersonas: HabitacionPorCantidadPersonasFn
): RoomIdComboItem[] {
  let result: RoomIdComboItem[] = [];

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
