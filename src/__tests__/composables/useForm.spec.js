import { describe, it, expect } from "vitest";
import { useForm } from "../../composables/useForm";

describe("useForm", () => {
  it("should return initial state", () => {
    const form = useForm();
    expect(form.errors.value).toEqual({});
    expect(form.loading.value).toBe(false);
  });

  it("should set a field error", () => {
    const form = useForm();
    form.setFieldError("email", "Email is required");
    expect(form.errors.value.email).toBe("Email is required");
  });

  it("should set multiple errors", () => {
    const form = useForm();
    form.setErrors({ email: "Invalid", password: "Too short" });
    expect(form.errors.value).toEqual({
      email: "Invalid",
      password: "Too short"
    });
  });

  it("should clear a single field error", () => {
    const form = useForm();
    form.setFieldError("email", "Required");
    form.clearFieldError("email");
    expect(form.errors.value.email).toBeUndefined();
  });

  it("should clear all errors", () => {
    const form = useForm();
    form.setErrors({ a: "err1", b: "err2" });
    form.clearAllErrors();
    expect(form.errors.value).toEqual({});
  });

  it("should set loading state", () => {
    const form = useForm();
    form.setLoading(true);
    expect(form.loading.value).toBe(true);
    form.setLoading(false);
    expect(form.loading.value).toBe(false);
  });
});
