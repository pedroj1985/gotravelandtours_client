import { defineStore } from "pinia";
import { storageService } from "../utils/storageService";

interface CartState {
  count: number;
  items: unknown[];
}

export const useCartStore = defineStore("cart", {
  state: (): CartState => ({
    count: 0,
    items: [],
  }),
  actions: {
    refresh() {
      const cart = storageService.getCart();
      this.items = cart;
      this.count = cart.length;
    },
    update() {
      this.count++;
    },
    reset() {
      this.count = 0;
      this.items = [];
    },
  },
});
