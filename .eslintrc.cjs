/* eslint-env node */
require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
  "root": true,
  "extends": [
    "plugin:vue/vue3-essential",
    "eslint:recommended",
    "@vue/eslint-config-typescript/recommended",
  ],
  "env": {
    "vue/setup-compiler-macros": true,
  },
  "rules": {
    "arrow-parens": [ "error", "always" ],
    "arrow-spacing": [ "error", { "before": true, "after": true }],
    "block-spacing": "error",
    "brace-style": "error",
    "comma-dangle": [ "error", "always-multiline" ],
    "comma-spacing": [ "error", { "before": false, "after": true }],
    "comma-style": [ "error", "last" ],
    "dot-location": [ "error", "property" ],
    "eol-last": "error",
    "func-call-spacing": "error",
    "indent": [ "error", 2 ],
    "key-spacing": [ "error", { "beforeColon": false, "afterColon": true }],
    "keyword-spacing": [ "error", { "before": true, "after": true }],
    "no-multi-spaces": "error",
    "no-multiple-empty-lines": "error",
    "no-tabs": "error",
    "no-trailing-spaces": "error",
    "quotes": [ "error", "single" ],
    "semi": [ "error", "never" ],
  },
}
