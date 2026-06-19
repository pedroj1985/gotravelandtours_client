import type { RoomGroupedItem } from "./visitor";
import type { HotelecData } from "./api";

export interface LodgingSearchItem {
  Region: string;
  Cliente: string;
  Entrada: string;
  Salida: string;
}

export interface RoomCombination {
  dobles: number;
  triples: number;
  sencillas: number;
  kids: number;
}

export interface RoomPriceLine {
  cantidad: number;
  precioObjOne: unknown;
  price: { value: number; currency: string };
  tipoHabitacion: number | string;
  tipoHabitacionNombre: string;
  cantidadMenoresPorHabitacion: number;
  planAlimenticio: number | string;
}

export interface RoomPriceInfo {
  name: string;
  habitacion: unknown;
  planAlimenticioCodigo: string;
  planAlimenticioNombre: string;
  planAlimenticio: number | string;
  hotelecData: HotelecData | null;
  IsSinContrato: boolean;
  combinacion: {
    total: number;
    display: string;
    listado: RoomPriceLine[];
  };
}

export interface SearchResultItem {
  tipo: "lodging";
  entrada: string;
  salida: string;
  name: string;
  stars: number;
  location: string;
  images: string[];
  acomodation: RoomGroupedItem[];
  habitaciones: RoomPriceInfo[];
  planesAlimenticios: MealPlan[];
  lodging: unknown;
}

export interface MealPlan {
  [key: string]: unknown;
}

export interface LodgingSite {
  images: string[];
  name: string;
  stars: number;
  location: string;
  mapLink: string;
  price: { value: number; currency: string };
  items: Array<{
    name: string;
    price: { value: number; currency: string };
    info: string;
    roomLayout?: string;
  }>;
}
