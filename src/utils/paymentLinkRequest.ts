import type { PaymentRequest, ClientData } from "../types/payment";

export class PaymentLinkRequest implements PaymentRequest {
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

  constructor() {
    this.access_token = null;
    this.amount = 0;
    this.concept = "";
    this.currency = "";
    this.TipoOrden = "";
    this.OrdenProductoId = "";
    this.EnviarLinkDePago = false;
    this.description = "";
    this.directPayment = false;
    this.expirationDays = 1;
    this.client = null;
    this.favorite = true;
    this.lang = "es";
    this.paymentMethods = [];
    this.reasonId = 0;
    this.reference = "";
    this.serviceDate = "";
    this.singleUse = true;
    this.urlNotification = "";
    this.urlSuccess = "";
    this.urlFailed = "";
  }
}
