// DEPRECATED: Use composables/useCleanup.js instead
import { cleanVO } from "../composables/useCleanup";

export const cleanVoMixin = {
  methods: {
    cleanVO(order, pickUpPlace, DeliveryPlace) {
      cleanVO(
        order,
        pickUpPlace || this.selectedPickUpPlace,
        DeliveryPlace || this.selectedDeliveryPlace
      );
    }
  }
};
