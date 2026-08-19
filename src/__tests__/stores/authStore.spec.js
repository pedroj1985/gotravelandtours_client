import { describe, it, expect, beforeEach, vi } from "vitest";
import { authStore } from "../../stores/authStore";

describe("authStore", () => {
  beforeEach(() => {
    authStore.logout();
    localStorage.clear();
  });

  it("should start logged out", () => {
    expect(authStore.isLoggedIn).toBe(false);
    expect(authStore.user).toBeNull();
  });

  it("should login user", () => {
    const user = { id: 1, name: "Test User", email: "test@test.com" };
    authStore.login(user);
    expect(authStore.user).toEqual(user);
  });

  it("should logout user", () => {
    authStore.login({ id: 1, name: "Test" });
    authStore.logout();
    expect(authStore.user).toBeNull();
  });

  it("should reflect login status via token", () => {
    expect(authStore.isLoggedIn).toBe(false);
    localStorage.setItem("token", "some-token");
    expect(authStore.isLoggedIn).toBe(true);
  });

  it("should restore persisted user on boot when token exists", async () => {
    localStorage.setItem("token", "some-token");
    localStorage.setItem(
      "usuarioObjeto",
      JSON.stringify({ name: "PEDRO", clienteNombre: "AGENCIA TEST" })
    );
    vi.resetModules();
    const { authStore: freshStore } = await import("../../stores/authStore");
    expect(freshStore.user).toEqual({
      name: "PEDRO",
      clienteNombre: "AGENCIA TEST"
    });
  });

  it("should not restore persisted user without a token", async () => {
    localStorage.setItem(
      "usuarioObjeto",
      JSON.stringify({ name: "PEDRO", clienteNombre: "AGENCIA TEST" })
    );
    vi.resetModules();
    const { authStore: freshStore } = await import("../../stores/authStore");
    expect(freshStore.user).toBeNull();
  });
});
