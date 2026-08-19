import { reactive } from "vue";
import { storageService } from "../utils/storageService";

/**
 * Restore the user from localStorage on app boot so the navbar
 * (user menu, shopping cart) renders correctly after a page refresh
 * or direct navigation with an active session. Only restore when a
 * token exists, to stay in sync with isLoggedIn.
 */
function restoreUser() {
  if (!storageService.getToken()) {
    return null;
  }
  const user = storageService.getUser();
  return user && typeof user === "object" ? user : null;
}

const state = reactive({
  user: restoreUser(),
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
