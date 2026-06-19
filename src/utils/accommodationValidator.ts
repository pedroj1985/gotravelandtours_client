import type { AccommodationItem, HabType } from "../types/visitor";
import type { Combination } from "../types/api";

export function existenCombinacionesEnHabitacion(
  acomodacion: AccommodationItem[],
  combinaciones: Combination[]
): boolean {
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

function getCapacity(hab: HabType): number {
  if (hab === "Doble") return 2;
  if (hab === "Triple") return 3;
  return 1;
}

export function existeAcomodacion(
  item: AccommodationItem,
  list: Combination[]
): boolean {
  let ca = getCapacity(item.hab);

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

export function isRoomCombinationAvailable(
  adults: number,
  kids: number,
  availableCombos: Combination[]
): boolean {
  return availableCombos.some(
    combo => combo.CantAdult === adults && combo.CantNino === kids
  );
}

export function validateRoomLayout(roomLayout: { adults?: number } | null | undefined): boolean {
  if (!roomLayout) return false;

  const { adults = 0 } = roomLayout;

  return adults > 0;
}

export function canFulfillAccommodations(
  requestedAccommodations: AccommodationItem[],
  availableRooms: AccommodationItem[]
): boolean {
  let availableRoomsCopy = [...availableRooms];

  for (const accommodation of requestedAccommodations) {
    let roomIndex = availableRoomsCopy.findIndex(room => {
      return room.hab === accommodation.hab && room.kids >= accommodation.kids;
    });

    if (roomIndex === -1) {
      return false;
    }

    availableRoomsCopy.splice(roomIndex, 1);
  }

  return true;
}
