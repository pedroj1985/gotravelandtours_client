import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import App from "../App.vue";

describe("App", () => {
  it("should mount without errors", () => {
    const wrapper = mount(App, {
      global: {
        stubs: {
          NavBar1: true,
          Footer1: true,
          RouterView: true
        },
        mocks: {
          $helpers: {
            getCartItems: () => 0
          }
        }
      }
    });
    expect(wrapper.exists()).toBe(true);
  });
});
