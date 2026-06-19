module.exports = {
  root: true,
  env: {
    node: true
  },
  globals: {
    describe: "readonly",
    it: "readonly",
    expect: "readonly",
    beforeEach: "readonly",
    afterEach: "readonly",
    vi: "readonly"
  },
  extends: ["plugin:vue/essential", "eslint:recommended", "@vue/prettier"],
  parserOptions: {
    parser: "@babel/eslint-parser",
    requireConfigFile: false
  },
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-unused-vars": "warn",
    "no-empty": "warn",
    "no-constant-condition": "warn",
    "no-undef": "warn",
    "vue/multi-word-component-names": "warn",
    "vue/no-unused-components": "warn",
    "vue/no-mutating-props": "warn",
    "vue/no-reserved-component-names": "off",
    "vue/require-v-for-key": "warn"
  }
};
