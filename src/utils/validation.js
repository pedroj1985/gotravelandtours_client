import { helpers } from "./helpers";
import moment from "moment";
import { ValidationObserver } from "vee-validate";

export function gttIsValid(Validator, vueInstance = null) {

  console.log(Validator);
  console.log(vueInstance);
  if (Validator.length == 8 && vueInstance.$children.length == 4) {
    Validator.pop();
    Validator.pop();
    Validator.pop();
  }


  return Validator.map(element => {

    let passesArray = element.rules.map(item => {


      return passes(item, element.value, element);
    });

    let p = passesArray.filter(item => {
      return item.passes == false;
    });

    if (p.length > 0) {
      let pRequired = p.find(item => {
        return item.ruleName == "required";
      });

      if (pRequired) {
        element["isValid"] = false;
        element["messages"] = [translateMessage("required", element.lang)];
        return element;
      }

      element["isValid"] = false;
      let p_messages = p.map(item => {
        return translateMessage(item.ruleName, element.lang);
      });
      element["messages"] = p_messages;
      return element;
    }

    element["isValid"] = true;
    return element;
  });
}

export function getValid(val) {
  let r = val.find(i => {
    return i.isValid == false;
  });

  return !r;
}

function passes(ruleName, value, vueInstance = null) {
  let result = {};
  let splittedRuleName = ruleName.split(":");
  switch (splittedRuleName[0]) {
    case "required":
      if (typeof value === "object") {
        if (value == null) {
          result = { ruleName: ruleName, passes: false };
          return result;
        }

        if (value.length === undefined) {
          result = { ruleName: ruleName, passes: true };
        }
        else {
          if (value.length === 0) {
            result = { ruleName: ruleName, passes: false };
          } else {
            result = { ruleName: ruleName, passes: true };
          }
        }
      } else {

        if (vueInstance.name == "gttLlegada" || vueInstance.name == "gttSalida") {
          let param = value.split("-")
          if (param[0].length > 1 && param[1].length > 1 && param[2].length > 1) {
            let a = parseInt(param[2], 10)

            if (isNaN(a)) {
              result = { ruleName: ruleName, passes: false };
            }
            else {
              result = { ruleName: ruleName, passes: true };
            }

          }
          else {
            result = { ruleName: ruleName, passes: false };
          }
        }
        else {
          result = { ruleName: ruleName, passes: value ? true : false };
        }

      }

      break;

    case "dateAfter":
      result = {
        ruleName: splittedRuleName[0],
        passes: dateAfter(value, splittedRuleName[1], vueInstance)
      };
      break;
  }
  return result;
}

function translateMessage(ruleName, lang) {
  let result = "";
  let splittedRuleName = ruleName.split(":");

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

export function renderValid(Validator, vueInstance) {

  Validator.forEach(element => {
    let ref = vueInstance.$refs[element.name];

    if (ref == null) {

      vueInstance.$children.forEach(
        child => {
          if (child.$refs[element.name]) ref = child.$refs[element.name]
        }
      )

    }


    const errorsContainer = ref.querySelector(".gtt-errors");
    errorsContainer.textContent = "";
    if (!element.isValid) {
      element.messages.forEach(item => {
        const span = document.createElement("span");
        span.textContent = item;
        errorsContainer.appendChild(span);
        errorsContainer.appendChild(document.createElement("br"));
      });
    }
  });
}

function dateAfter(date, dateToCompare, vueInstance = null) {
  if (vueInstance) {
    let d = vueInstance[dateToCompare];
    return moment(date) > moment(d);
  }

  return true;
}

// export function constructValidator(array){

// }
