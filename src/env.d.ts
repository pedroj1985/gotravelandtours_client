/// <reference types="vite/client" />

declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<object, object, unknown>;
  export default component;
}

declare module "moment" {
  interface MomentObject {
    format(fmt: string): string;
    diff(other: MomentObject | string | Date, unit?: string): number;
    isBefore(other: MomentObject | string | Date): boolean;
    isAfter(other: MomentObject | string | Date): boolean;
    valueOf(): number;
  }
  const moment: {
    (date?: string | Date | MomentObject): MomentObject;
  };
  export default moment;
}

declare module "uuid" {
  export function v4(): string;
}
