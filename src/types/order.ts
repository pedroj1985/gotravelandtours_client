import type { VehicleOrder } from "./rent";

export interface CartItem {
  uID?: string;
  tipo: "lodging" | "rent" | "activity" | "service" | "transportation";
  orderVehiculo?: VehicleOrder;
  reservedRooms?: unknown;
  entrada?: string;
  salida?: string;
  [key: string]: unknown;
}

export interface Passenger {
  Id: number;
  Fecnac: string;
}

export interface PassengerList {
  Adl: Passenger[];
  Nin: Passenger[];
}

export interface OrderStatusList {
  open: "Open";
  confirmed: "Confirmed";
  accepted: "Accepted";
  rejected: "Rejected";
  autorized: "Autorized";
  close: "Close";
  closed: "Closed";
  pending: "Pending";
  cancel: "Cancel";
  cm: "CM";
}
