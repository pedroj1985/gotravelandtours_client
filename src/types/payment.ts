export interface PaymentRequest {
  access_token: string | null;
  amount: number;
  concept: string;
  currency: string;
  TipoOrden: string;
  OrdenProductoId: string;
  EnviarLinkDePago: boolean;
  description: string;
  directPayment: boolean;
  expirationDays: number;
  client: ClientData | null;
  favorite: boolean;
  lang: string;
  paymentMethods: unknown[];
  reasonId: number;
  reference: string;
  serviceDate: string;
  singleUse: boolean;
  urlNotification: string;
  urlSuccess: string;
  urlFailed: string;
}

export interface ClientData {
  address: string;
  name: string;
  lastName: string;
  email: string;
  phone: string;
  termsAndConditions: string;
}

export interface TropiPayResponse {
  [key: string]: unknown;
}

export interface PaymentMethod {
  EXT: "EXT";
  TROPIPAY: "Tropipay";
}

export interface CurrencyOption {
  code: "USD" | "CUP" | "EUR";
  label: string;
}

export interface ProductTypeFilter {
  id: "AL" | "RE" | "AC" | "SE" | "TR" | "EX";
  value: "lodging" | "rent" | "activity" | "service" | "transportation" | "EXT";
  label: string;
}
