export class PaymentLinkRequest {
  constructor() {
    this.access_token = null;
    this.amount = 0;
    this.concept = '';
    this.currency = '';
    this.TipoOrden = '';
    this.OrdenProductoId = '';
    this.EnviarLinkDePago = false;
    this.description = '';
    this.directPayment = false;
    this.expirationDays = 1;
    this.client = null;
    this.favorite = true;
    this.lang = 'es';
    this.paymentMethods = [];
    this.reasonId = 0;
    this.reference = '';
    this.serviceDate = '';
    this.singleUse = true;
    this.urlNotification = '';
    this.urlSuccess = '';
    this.urlFailed = '';
  }
}