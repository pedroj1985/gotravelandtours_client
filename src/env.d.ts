/// <reference types="vite/client" />

declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<object, object, unknown>;
  export default component;
}

declare module "moment" {
  interface MomentObject {
    format(fmt?: string): string;
    diff(other: MomentObject | string | Date, unit?: string): number;
    isBefore(other: MomentObject | string | Date): boolean;
    isAfter(other: MomentObject | string | Date): boolean;
    valueOf(): number;
    add(amount: number, unit?: string): MomentObject;
    subtract(amount: number, unit?: string): MomentObject;
    toDate(): Date;
    locale(locale: string): MomentObject;
    clone(): MomentObject;
    startOf(unit: string): MomentObject;
    endOf(unit: string): MomentObject;
    daysInMonth(): number;
    isValid(): boolean;
  }
  interface MomentStatic {
    (date?: string | Date | MomentObject | number): MomentObject;
    (date: string, format: string): MomentObject;
    locale(locale: string): string;
  }
  const moment: MomentStatic;
  export default moment;
}

declare module "uuid" {
  export function v4(): string;
}
