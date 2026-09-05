import { describe, it, expect, beforeAll } from "vitest";
import { mount } from "@vue/test-utils";
import { Calendar as VCalendar, DatePicker as VDatePicker } from "v-calendar";
import GttSelectDate from "../../components/custom-elements/GttSelectDate.vue";

beforeAll(() => {
  if (typeof global.ResizeObserver === "undefined") {
    global.ResizeObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    };
  }
  if (typeof global.matchMedia === "undefined") {
    global.matchMedia = () => ({
      matches: false,
      addListener() {},
      removeListener() {},
      addEventListener() {},
      removeEventListener() {},
    });
  }
});

const directives = {
  "click-outside": {
    mounted() {},
    unmounted() {},
  },
};

const mountDate = (props) =>
  mount(GttSelectDate, {
    props,
    global: {
      directives,
      components: { VDatePicker, VCalendar },
    },
  });

describe("GttSelectDate", () => {
  it("renders an inline VDatePicker calendar for single mode", () => {
    const wrapper = mountDate({ mode: "single", opened: true });
    expect(wrapper.find(".gtt__list_area_wrapper").exists()).toBe(true);
    expect(wrapper.find(".vc-container").exists()).toBe(true);
    expect(wrapper.findComponent(VDatePicker).props("masks")).toMatchObject({
      weekdays: "WWW",
      title: "MMMM",
    });
  });

  it("renders two calendar columns in range mode", async () => {
    const wrapper = mountDate({ mode: "range", opened: true });
    await new Promise((r) => setTimeout(r, 50));
    const paneLayout = wrapper.find(".vc-pane-layout");
    expect(paneLayout.exists()).toBe(true);
    expect(wrapper.find('.gtt__date_picker[data-mode="range"]').exists()).toBe(true);
    const style = paneLayout.attributes("style") || "";
    expect(style).toMatch(/repeat\(2, 1fr\)/);
    expect(wrapper.findAll(".vc-pane").length).toBe(2);
  });

  it("emits a { start, end } range after picking two days", async () => {
    const wrapper = mountDate({ mode: "range", opened: true });
    await new Promise((r) => setTimeout(r, 50));
    const days = wrapper.findAll(".vc-day-content");
    await days[2].trigger("click");
    await days[7].trigger("click");
    await new Promise((r) => setTimeout(r, 50));
    const emitted = wrapper.emitted("update:modelValue");
    const last = emitted[emitted.length - 1][0];
    expect(last).toBeTruthy();
    expect(Array.isArray(last)).toBe(false);
    expect(last.start).toBeInstanceOf(Date);
    expect(last.end).toBeInstanceOf(Date);
  });
});