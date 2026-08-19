import { helpers } from "./helpers";
import moment from "moment";

interface ValidatorElement {
  rules: string[];
  value: unknown;
  name: string;
  lang: string;
  isValid?: boolean;
  messages?: string[];
}

interface PassResult {
  ruleName: string;
  passes: boolean;
}

export function gttIsValid(Validator: ValidatorElement[], vueInstance: Record<string, unknown> | null = null): ValidatorElement[] {
  if (import.meta.env.DEV) { console.log(Validator); }
  if (import.meta.env.DEV) { console.log(vueInstance); }
  if (Validator.length == 8 && (vueInstance as Record<string, unknown>)["$children"] && ((vueInstance as Record<string, unknown>)["$children"] as unknown[]).length == 4) {
    Validator.pop();
    Validator.pop();
    Validator.pop();
  }

  return Validator.map(element => {
    const passesArray = element.rules.map(item => {
      return passes(item, element.value, element);
    });

    const p = passesArray.filter(item => {
      return item.passes == false;
    });

    if (p.length > 0) {
      const pRequired = p.find(item => {
        return item.ruleName == "required";
      });

      if (pRequired) {
        element["isValid"] = false;
        element["messages"] = [translateMessage("required", element.lang)];
        return element;
      }

      element["isValid"] = false;
      const p_messages = p.map(item => {
        return translateMessage(item.ruleName, element.lang);
      });
      element["messages"] = p_messages;
      return element;
    }

    element["isValid"] = true;
    return element;
  });
}

export function getValid(val: ValidatorElement[]): boolean {
  const r = val.find(i => {
    return i.isValid == false;
  });

  return !r;
}

function passes(ruleName: string, value: unknown, vueInstance: ValidatorElement | null = null): PassResult {
  let result: PassResult;
  const splittedRuleName = ruleName.split(":");
  switch (splittedRuleName[0]) {
    case "required":
      if (typeof value === "object") {
        if (value == null) {
          result = { ruleName: ruleName, passes: false };
          return result;
        }

        if ((value as unknown[]).length === undefined) {
          result = { ruleName: ruleName, passes: true };
        } else {
          if ((value as unknown[]).length === 0) {
            result = { ruleName: ruleName, passes: false };
          } else {
            result = { ruleName: ruleName, passes: true };
          }
        }
      } else {
        if (
          (vueInstance as unknown as Record<string, unknown>)?.name == "gttLlegada" ||
          (vueInstance as unknown as Record<string, unknown>)?.name == "gttSalida"
        ) {
          const param = (value as string).split("-");
          if (
            param[0].length > 1 &&
            param[1].length > 1 &&
            param[2].length > 1
          ) {
            const a = parseInt(param[2], 10);

            if (isNaN(a)) {
              result = { ruleName: ruleName, passes: false };
            } else {
              result = { ruleName: ruleName, passes: true };
            }
          } else {
            result = { ruleName: ruleName, passes: false };
          }
        } else {
          result = { ruleName: ruleName, passes: value ? true : false };
        }
      }

      break;

    case "dateAfter":
      result = {
        ruleName: splittedRuleName[0],
        passes: dateAfter(value as string, splittedRuleName[1] as string, vueInstance as unknown as Record<string, unknown> | null)
      };
      break;
    default:
      result = { ruleName: ruleName, passes: true };
      break;
  }
  return result;
}

function translateMessage(ruleName: string, lang: string): string {
  let result = "";
  const splittedRuleName = ruleName.split(":");

  switch (splittedRuleName[0]) {
    case "required":
      result = helpers.traducir("ValidationRequired", lang);
      break;
    case "dateAfter":
      result = "Esta fecha debe ser posterior a la fecha de recogida";
      break;
  }

  return result;
}

export function renderValid(Validator: ValidatorElement[], vueInstance: { $refs: Record<string, HTMLElement>; $children: Array<{ $refs: Record<string, HTMLElement> }> }) {
  Validator.forEach(element => {
    let ref = vueInstance.$refs[element.name];

    if (ref == null) {
      vueInstance.$children.forEach(child => {
        if (child.$refs[element.name]) ref = child.$refs[element.name];
      });
    }

    const errorsEl = ref?.querySelector(".gtt-errors");
    if (errorsEl) {
      errorsEl.textContent = "";
    }
    if (!element.isValid) {
      element.messages?.forEach(item => {
        if (errorsEl) {
          errorsEl.textContent += item + "\n";
        }
      });
    }
  });
}

function dateAfter(date: string, dateToCompare: string, vueInstance: Record<string, unknown> | null = null): boolean {
  if (vueInstance) {
    const d = vueInstance[dateToCompare] as string;
    return moment(date) > moment(d);
  }

  return true;
}
