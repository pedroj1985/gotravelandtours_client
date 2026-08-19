import { defineStore } from "pinia";
import { storageService } from "../utils/storageService";

interface AuthState {
  user: Record<string, unknown> | null;
}

export const useAuthStore = defineStore("auth", {
  state: (): AuthState => ({
    user: null,
  }),
  getters: {
    isLoggedIn: (state): boolean => !!state.user,
  },
  actions: {
    login(user: Record<string, unknown>) {
      this.user = user;
    },
    logout() {
      this.user = null;
      storageService.removeItem("token");
      storageService.removeItem("usuarioObjeto");
      storageService.removeItem("nombre");
      storageService.removeItem("userid");
      storageService.removeItem("cliente");
      storageService.removeItem("fecha_exp");
    },
  },
});
