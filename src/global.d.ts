import type { ComponentCustomProperties } from "vue";

declare module "vue" {
  interface ComponentCustomProperties {
    $helpers: typeof import("./utils/helpers").helpers;
  }
}
