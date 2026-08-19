import { defineRule, configure } from "vee-validate";
import { required, email, min, max, confirmed } from "@vee-validate/rules";

export function setupVeeValidate() {
  defineRule("required", required);
  defineRule("email", email);
  defineRule("min", min);
  defineRule("max", max);
  defineRule("confirmed", confirmed);

  configure({
    generateMessage: (context) => {
      const messages: Record<string, string> = {
        required: "Este campo es obligatorio",
        email: "Este campo debe ser un correo válido",
        min: `Este campo debe tener al menos ${context.rule?.params?.[0]} caracteres`,
        max: `Este campo debe tener como máximo ${context.rule?.params?.[0]} caracteres`,
        confirmed: "Las contraseñas no coinciden"
      };
      return messages[context.rule?.name ?? ""] || "El campo no es válido";
    }
  });
}
