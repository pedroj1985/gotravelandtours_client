import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import GttInput from "../../components/shared/GttInput.vue";

describe("GttInput", () => {
  it("should render input element", () => {
    const wrapper = mount(GttInput);
    expect(wrapper.find("input").exists()).toBe(true);
  });

  it("should have default type 'text'", () => {
    const wrapper = mount(GttInput);
    expect(wrapper.find("input").attributes("type")).toBe("text");
  });

  it("should set custom type", () => {
    const wrapper = mount(GttInput, {
      props: { type: "email" }
    });
    expect(wrapper.find("input").attributes("type")).toBe("email");
  });

  it("should display label when provided", () => {
    const wrapper = mount(GttInput, {
      props: { label: "Email", id: "email-input" }
    });
    expect(wrapper.find("label").text()).toBe("Email");
    expect(wrapper.find("label").attributes("for")).toBe("email-input");
  });

  it("should not render label when not provided", () => {
    const wrapper = mount(GttInput);
    expect(wrapper.find("label").exists()).toBe(false);
  });

  it("should set placeholder", () => {
    const wrapper = mount(GttInput, {
      props: { placeholder: "Enter text..." }
    });
    expect(wrapper.find("input").attributes("placeholder")).toBe("Enter text...");
  });

  it("should set value from modelValue prop", () => {
    const wrapper = mount(GttInput, {
      props: { modelValue: "test value" }
    });
    expect(wrapper.find("input").element.value).toBe("test value");
  });

  it("should emit update:modelValue on input", async () => {
    const wrapper = mount(GttInput);
    const input = wrapper.find("input");
    await input.setValue("new value");
    expect(wrapper.emitted("update:modelValue")).toBeTruthy();
    expect(wrapper.emitted("update:modelValue")[0][0]).toBe("new value");
  });

  it("should disable input when disabled prop is true", () => {
    const wrapper = mount(GttInput, {
      props: { disabled: true }
    });
    expect(wrapper.find("input").attributes("disabled")).toBeDefined();
  });

  it("should show error message when error prop is set", () => {
    const wrapper = mount(GttInput, {
      props: { error: "Campo requerido" }
    });
    const errorSmall = wrapper.find(".gtt_input_error");
    expect(errorSmall.exists()).toBe(true);
    expect(errorSmall.text()).toBe("Campo requerido");
  });

  it("should not show error when no error prop", () => {
    const wrapper = mount(GttInput);
    expect(wrapper.find(".gtt_input_error").exists()).toBe(false);
  });
});
