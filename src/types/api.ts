export interface ApiResponse<T = unknown> {
  data: T;
  status: number;
  statusText: string;
  headers?: Record<string, string>;
}

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  data?: unknown;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface PriceSearchObj {
  Cliente: { ClienteId: string | null };
  PlanAlimenticio: { PlanesAlimenticiosId: number | string };
  Alojamiento: { ProductoId: number | string };
  TipoHabitacion: { TipoHabitacionId: number | string };
  CantidadAdultos: number;
  CantidadMenores: number;
  CantidadInfantes: number;
  CantidadHabitaciones: number;
  HotetecIdeses: string | null;
  Habitacion: { HabitacionId: number | string };
  Entrada: string;
  IsSinContrato: boolean;
  Salida: string;
}

export interface HotelecData {
  HotetecInfoHabId: string | number;
  HotetecInfoHotelId: string | number;
  HotetecIdeses: string;
  HotetecIsAvailable: boolean;
}

export interface Combination {
  CantAdult: number;
  CantNino: number;
}
