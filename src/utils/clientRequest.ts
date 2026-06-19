import type { ClientData } from "../types/payment";

export class ClientRequest implements ClientData {
  address: string;
  name: string;
  lastName: string;
  email: string;
  phone: string;
  termsAndConditions: string;

  constructor() {
    this.address = "";
    this.name = "";
    this.lastName = "";
    this.email = "";
    this.phone = "";
    this.termsAndConditions = "true";
  }
}
