import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import GttErrorState from "../../components/shared/GttErrorState.vue";

describe("GttErrorState", () => {
  it("should render default error content", () => {
    const wrapper = mount(GttErrorState);
    expect(wrapper.text()).toContain("Error de conexión");
    expect(wrapper.text()).toContain("No se pudieron cargar los datos");
  });

  it("should render custom title via slot", () => {
    const wrapper = mount(GttErrorState, {
      slots: { title: "Custom Error" }
    });
    expect(wrapper.text()).toContain("Custom Error");
  });

  it("should NOT show retry button when retryable is false", () => {
    const wrapper = mount(GttErrorState);
    expect(wrapper.find("button").exists()).toBe(false);
  });

  it("should show retry button when retryable is true", () => {
    const wrapper = mount(GttErrorState, {
      props: { retryable: true }
    });
    expect(wrapper.find("button").exists()).toBe(true);
    expect(wrapper.text()).toContain("Reintentar");
  });

  it("should emit retry when retry button clicked", async () => {
    const wrapper = mount(GttErrorState, {
      props: { retryable: true }
    });
    await wrapper.find("button").trigger("click");
    expect(wrapper.emitted("retry")).toBeTruthy();
    expect(wrapper.emitted("retry").length).toBe(1);
  });

  it("should have gtt-error-state class", () => {
    const wrapper = mount(GttErrorState);
    expect(wrapper.classes()).toContain("gtt-error-state");
  });
});
