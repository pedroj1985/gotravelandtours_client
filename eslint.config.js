import js from "@eslint/js";
import pluginVue from "eslint-plugin-vue";
import pluginPrettier from "eslint-plugin-prettier/recommended";
import globals from "globals";

export default [
  js.configs.recommended,
  ...pluginVue.configs["flat/essential"],
  pluginPrettier,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        describe: "readonly",
        it: "readonly",
        expect: "readonly",
        beforeEach: "readonly",
        afterEach: "readonly",
        vi: "readonly"
      }
    },
    rules: {
      "no-console": "warn",
      "no-debugger": "warn",
      "no-unused-vars": "warn",
      "no-empty": "warn",
      "no-constant-condition": "warn",
      "no-undef": "warn",
      "vue/multi-word-component-names": "warn",
      "vue/no-unused-components": "warn",
      "vue/no-mutating-props": "warn",
      "vue/no-reserved-component-names": "off",
      "vue/require-v-for-key": "warn",
      "prettier/prettier": ["warn", { endOfLine: "auto" }],
      "vue/no-deprecated-destroyed-lifecycle": "warn",
      "vue/no-deprecated-v-bind-sync": "warn",
      "vue/no-deprecated-v-on-native-modifier": "warn",
      "vue/no-deprecated-slot-attribute": "warn"
    }
  }
];
