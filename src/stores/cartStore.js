import { reactive } from "vue";
import { storageService } from "../utils/storageService";

const state = reactive({
  count: 0,
  items: []
});

export const cartStore = {
  get count() {
    return state.count;
  },
  set count(val) {
    state.count = val;
  },
  get items() {
    return state.items;
  },
  set items(val) {
    state.items = val;
  },
  refresh() {
    const cart = storageService.getCart();
    state.items = cart;
    state.count = cart.length;
  },
  update() {
    state.count++;
  },
  reset() {
    state.count = 0;
    state.items = [];
  }
};
