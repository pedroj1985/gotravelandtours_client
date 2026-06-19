import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import GttEmptyState from "../../components/shared/GttEmptyState.vue";

describe("GttEmptyState", () => {
  it("should render default slots", () => {
    const wrapper = mount(GttEmptyState);
    expect(wrapper.text()).toContain("Sin resultados");
    expect(wrapper.text()).toContain("No se encontraron datos para mostrar.");
  });

  it("should render custom title via slot", () => {
    const wrapper = mount(GttEmptyState, {
      slots: { title: "Vacío" }
    });
    expect(wrapper.text()).toContain("Vacío");
    expect(wrapper.find(".gtt-empty-state-title").exists()).toBe(true);
  });

  it("should render custom description via default slot", () => {
    const wrapper = mount(GttEmptyState, {
      slots: { default: "No hay elementos disponibles" }
    });
    expect(wrapper.text()).toContain("No hay elementos disponibles");
  });

  it("should have gtt-empty-state class", () => {
    const wrapper = mount(GttEmptyState);
    expect(wrapper.classes()).toContain("gtt-empty-state");
  });

  it("should render icon slot", () => {
    const wrapper = mount(GttEmptyState, {
      slots: { icon: '<span class="custom-icon">📭</span>' }
    });
    expect(wrapper.find(".custom-icon").exists()).toBe(true);
  });
});
