export interface VisitorLayoutItem {
  code: "adults" | "kids";
  label: string;
  display: string;
  value: number;
}

export interface VisitorLayout {
  room: number;
  layout: [VisitorLayoutItem, VisitorLayoutItem];
}

export interface VisitorCounts {
  totalAdults: number;
  totalKids: number;
  totalVisitors: number;
}

export interface VisitorValidation {
  isValid: boolean;
  errors: string[];
}

export interface RoomLayout {
  dobles: number;
  triples: number;
  sencillas: number;
  kids?: number;
  kids2Room?: boolean;
  totalkids2RoomFill?: number;
}

export type HabType = "Sencilla" | "Doble" | "Triple" | "Familiar";

export interface AccommodationItem {
  hab: HabType;
  kids: number;
}

export interface RoomBuiltItem {
  hab: string;
  code: string;
  habId: number | string;
  kids: number;
  adults: number;
}

export interface RoomGroupedItem extends RoomBuiltItem {
  cantidad: number;
}

export interface RoomIdComboItem {
  hab: string;
  habId: number | string;
  cantidad: number;
}

export interface RoomTypeInfo {
  Nombre: HabType;
  TipoHabitacionId: number | string;
}

export interface VisitorAccommodation {
  adults: number;
  kids: number;
  habId: number;
  hab: HabType;
  code: string;
}

export interface VisitorAccommodationGrouped extends VisitorAccommodation {
  cantidad: number;
}
