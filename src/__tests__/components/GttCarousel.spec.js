import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import GttCarousel from "../../components/custom-elements/GttCarousel.vue";

describe("GttCarousel", () => {
  it("should render without slides", () => {
    const wrapper = mount(GttCarousel);
    expect(wrapper.classes()).toContain("gtt-carousel");
  });

  it("should render slides array", () => {
    const wrapper = mount(GttCarousel, {
      props: {
        slides: ["img1.jpg", "img2.jpg", "img3.jpg"]
      }
    });
    const slides = wrapper.findAll(".gtt-carousel-slide");
    expect(slides).toHaveLength(3);
  });

  it("should show first slide by default", () => {
    const wrapper = mount(GttCarousel, {
      props: {
        slides: ["img1.jpg", "img2.jpg"]
      }
    });
    const slides = wrapper.findAll(".gtt-carousel-slide");
    expect(slides[0].element.style.display).not.toBe("none");
    expect(slides[1].element.style.display).toBe("none");
  });

  it("should show dots when dots prop is true", () => {
    const wrapper = mount(GttCarousel, {
      props: {
        slides: ["a.jpg", "b.jpg"],
        dots: true
      }
    });
    expect(wrapper.find(".gtt-carousel-dots").exists()).toBe(true);
    expect(wrapper.findAll(".gtt-carousel-dot")).toHaveLength(2);
  });

  it("should NOT show dots when dots prop is false", () => {
    const wrapper = mount(GttCarousel, {
      props: {
        slides: ["a.jpg", "b.jpg"],
        dots: false
      }
    });
    expect(wrapper.find(".gtt-carousel-dots").exists()).toBe(false);
  });

  it("should go to slide when dot is clicked", async () => {
    const wrapper = mount(GttCarousel, {
      props: {
        slides: ["a.jpg", "b.jpg"],
        dots: true
      }
    });
    const dots = wrapper.findAll(".gtt-carousel-dot");
    await dots[1].trigger("click");
    const slides = wrapper.findAll(".gtt-carousel-slide");
    expect(slides[0].element.style.display).toBe("none");
    expect(slides[1].element.style.display).not.toBe("none");
  });

  it("should highlight active dot", async () => {
    const wrapper = mount(GttCarousel, {
      props: {
        slides: ["a.jpg", "b.jpg", "c.jpg"],
        dots: true
      }
    });
    const dots = wrapper.findAll(".gtt-carousel-dot");
    expect(dots[0].classes()).toContain("active");
    await dots[2].trigger("click");
    expect(dots[0].classes()).not.toContain("active");
    expect(dots[2].classes()).toContain("active");
  });
});
