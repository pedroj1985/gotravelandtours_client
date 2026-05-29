module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: ["plugin:vue/essential", "eslint:recommended", "@vue/prettier"],
  parserOptions: {
    parser: "@babel/eslint-parser",
    requireConfigFile: false, // Necesario para que funcione sin babel.config.js adicional
    babelOptions: {
      presets: ["@vue/cli-plugin-babel/preset"]
    }
  },
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    "vue/multi-word-component-names": "off",
    "vue/no-unused-components": "warn",
    "no-unused-vars": [
      "warn",
      { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }
    ],
    "vue/no-mutating-props": "warn",
    "vue/require-v-for-key": "warn",
    "no-constant-condition": "warn",
    "no-empty": "warn",
    "no-undef": "warn"
  }
};
