import { reactive } from "vue";
import { storageService } from "../utils/storageService";

const state = reactive({
  user: null,
  isLoggedIn: !!storageService.getToken()
});

export const authStore = {
  get user() {
    return state.user;
  },
  set user(val) {
    state.user = val;
  },
  get isLoggedIn() {
    return !!storageService.getToken();
  },
  login(user) {
    state.user = user;
  },
  logout() {
    state.user = null;
  }
};
