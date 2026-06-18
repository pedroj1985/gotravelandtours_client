import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import GttSkeleton from "../../components/shared/GttSkeleton.vue";

describe("GttSkeleton", () => {
  it("should render with default props", () => {
    const wrapper = mount(GttSkeleton);
    expect(wrapper.classes()).toContain("gtt-skeleton");
    expect(wrapper.classes()).toContain("text");
    expect(wrapper.classes()).toContain("w-100");
  });

  it("should apply custom type class", () => {
    const wrapper = mount(GttSkeleton, {
      props: { type: "circle" }
    });
    expect(wrapper.classes()).toContain("circle");
  });

  it("should apply rect type class", () => {
    const wrapper = mount(GttSkeleton, {
      props: { type: "rect" }
    });
    expect(wrapper.classes()).toContain("rect");
  });

  it("should apply custom width class", () => {
    const wrapper = mount(GttSkeleton, {
      props: { width: 50 }
    });
    expect(wrapper.classes()).toContain("w-50");
  });

  it("should set custom height style", () => {
    const wrapper = mount(GttSkeleton, {
      props: { height: "2.5rem" }
    });
    expect(wrapper.attributes("style")).toContain("height: 2.5rem");
  });

  it("should render pulse animation div", () => {
    const wrapper = mount(GttSkeleton);
    expect(wrapper.find(".gtt-skeleton-pulse").exists()).toBe(true);
  });
});
