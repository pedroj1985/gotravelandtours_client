import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import GttModal from "../../components/shared/GttModal.vue";

describe("GttModal", () => {
  it("should not render when show is false", () => {
    const wrapper = mount(GttModal, {
      props: { show: false }
    });
    expect(wrapper.find(".gtt_modal_overlay").exists()).toBe(false);
  });

  it("should render when show is true", () => {
    const wrapper = mount(GttModal, {
      props: { show: true }
    });
    expect(wrapper.find(".gtt_modal_overlay").exists()).toBe(true);
    expect(wrapper.find(".gtt_modal").exists()).toBe(true);
  });

  it("should display title prop", () => {
    const wrapper = mount(GttModal, {
      props: { show: true, title: "Confirmación" }
    });
    expect(wrapper.text()).toContain("Confirmación");
  });

  it("should have proper ARIA attributes when visible", () => {
    const wrapper = mount(GttModal, {
      props: { show: true, title: "Modal Title" }
    });
    const overlay = wrapper.find(".gtt_modal_overlay");
    expect(overlay.attributes("role")).toBe("dialog");
    expect(overlay.attributes("aria-modal")).toBe("true");
    expect(overlay.attributes("aria-hidden")).toBe("false");
  });

  it("should emit close when overlay background clicked", async () => {
    const wrapper = mount(GttModal, {
      props: { show: true }
    });
    await wrapper.find(".gtt_modal_overlay").trigger("click");
    expect(wrapper.emitted("close")).toBeTruthy();
    expect(wrapper.emitted("close").length).toBe(1);
  });

  it("should emit close when close button clicked", async () => {
    const wrapper = mount(GttModal, {
      props: { show: true }
    });
    await wrapper.find(".gtt_modal_close").trigger("click");
    expect(wrapper.emitted("close")).toBeTruthy();
  });

  it("should render default slot content", () => {
    const wrapper = mount(GttModal, {
      props: { show: true },
      slots: { default: "<p>Modal body content</p>" }
    });
    expect(wrapper.find(".gtt_modal_body").text()).toContain("Modal body content");
  });

  it("should render header slot", () => {
    const wrapper = mount(GttModal, {
      props: { show: true },
      slots: { header: "<h2>Custom Header</h2>" }
    });
    expect(wrapper.find(".gtt_modal_header").text()).toContain("Custom Header");
  });

  it("should render footer slot", () => {
    const wrapper = mount(GttModal, {
      props: { show: true },
      slots: { footer: "<button>Accept</button>" }
    });
    expect(wrapper.find(".gtt_modal_footer button").exists()).toBe(true);
  });

  it("should close on Escape keydown", async () => {
    const wrapper = mount(GttModal, {
      props: { show: true },
      attachTo: document.body
    });
    await wrapper.trigger("keydown", { key: "Escape" });
    // The keydown handler is on document, not on wrapper
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    expect(wrapper.emitted("close")).toBeTruthy();
  });
});
