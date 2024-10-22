/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: ["@repo/eslint-config/next.js"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: true,
  },
  rules: {
    "no-undef": "off",
    "no-unused-vars": "off",
    "@next/next/no-img-element": "off",
  },
};
