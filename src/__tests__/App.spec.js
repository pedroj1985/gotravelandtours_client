import { describe, it, expect, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import App from "../App.vue";

describe("App", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("should mount without errors", () => {
    const wrapper = mount(App, {
      global: {
        plugins: [createPinia()],
        stubs: {
          NavBar1: true,
          Footer1: true,
          RouterView: true
        }
      }
    });
    expect(wrapper.exists()).toBe(true);
  });
});
