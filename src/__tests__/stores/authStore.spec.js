import { describe, it, expect, beforeEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useAuthStore } from "../../stores/authStore";

describe("authStore", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    useAuthStore().logout();
    localStorage.clear();
  });

  it("should start logged out", () => {
    expect(useAuthStore().isLoggedIn).toBe(false);
    expect(useAuthStore().user).toBeNull();
  });

  it("should login user", () => {
    const user = { id: 1, name: "Test User", email: "test@test.com" };
    useAuthStore().login(user);
    expect(useAuthStore().user).toEqual(user);
    expect(useAuthStore().isLoggedIn).toBe(true);
  });

  it("should logout user", () => {
    useAuthStore().login({ id: 1, name: "Test" });
    useAuthStore().logout();
    expect(useAuthStore().user).toBeNull();
    expect(useAuthStore().isLoggedIn).toBe(false);
  });
});
