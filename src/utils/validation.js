import { helpers } from "./helpers";
import moment from "moment";

export function gttIsValid(Validator, vueInstance = null) {
  return Validator.map(element => {
    let passesArray = element.rules.map(item => {
      return passes(item, element.value, vueInstance);
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

  return !r > 0;
}

function passes(ruleName, value, vueInstance = null) {
  let result = {};
  let splittedRuleName = ruleName.split(":");

  switch (splittedRuleName[0]) {
    case "required":
      result = { ruleName: ruleName, passes: value?true:false };
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
      result = "Esta fecha debe ser anterior a la fecha de recogida";
      break;
  }

  return result;
}

export function renderValid(Validator, vueInstance) {
  Validator.forEach(element => {
    let ref = vueInstance.$refs[element.name];
    console.log(ref)
    ref.querySelector(".gtt-errors").innerHTML = "";
    element.messages.forEach(item => {
      let div = ref.querySelector(".gtt-errors");
      div.innerHTML += item + "<br>";
    });
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