export interface RentSearchItem {
  FechaRecogida: string;
  FechaEntrega: string;
  LugarRecogida: string;
  LugarEntrega: string;
  Categoria: string;
  Transmision: string;
  Nacionalidad: string;
}

export interface VehicleOrder {
  FechaRecogida: string;
  FechaEntrega: string;
}

export interface Place {
  [key: string]: unknown;
}
