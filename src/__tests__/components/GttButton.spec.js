import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import GttButton from "../../components/shared/GttButton.vue";

describe("GttButton", () => {
  it("should render default slot content", () => {
    const wrapper = mount(GttButton, {
      slots: { default: "Click me" }
    });
    expect(wrapper.text()).toContain("Click me");
  });

  it("should have default type 'button'", () => {
    const wrapper = mount(GttButton);
    expect(wrapper.attributes("type")).toBe("button");
  });

  it("should set type from prop", () => {
    const wrapper = mount(GttButton, {
      props: { type: "submit" }
    });
    expect(wrapper.attributes("type")).toBe("submit");
  });

  it("should disable button when disabled prop is true", () => {
    const wrapper = mount(GttButton, {
      props: { disabled: true }
    });
    expect(wrapper.attributes("disabled")).toBeDefined();
  });

  it("should emit click event when clicked", async () => {
    const wrapper = mount(GttButton, {
      slots: { default: "Click" }
    });
    await wrapper.trigger("click");
    expect(wrapper.emitted("click")).toBeTruthy();
    expect(wrapper.emitted("click").length).toBe(1);
  });

  it("should NOT emit click when disabled", async () => {
    const wrapper = mount(GttButton, {
      props: { disabled: true },
      slots: { default: "Disabled" }
    });
    await wrapper.trigger("click");
    expect(wrapper.emitted("click")).toBeFalsy();
  });

  it("should have gtt_btn class", () => {
    const wrapper = mount(GttButton);
    expect(wrapper.classes()).toContain("gtt_btn");
  });
});
