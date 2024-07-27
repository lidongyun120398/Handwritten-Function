module.exports = {
  root: true,
  extends: [
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
    // 基础规则
    "ts-ruleset",
    // 严格规则
    "ts-ruleset/strict",
  ],
  parser: "@typescript-eslint/parser",
  plugins: ["react", "@typescript-eslint"],
  rules: {
    "react/react-in-jsx-scope": "off",
    indent: "off",
    "@typescript-eslint/indent": ["error", 2],
    quotes: "off",
    "@typescript-eslint/quotes": ["error", "single"],
    semi: "off",
    "@typescript-eslint/semi": ["error"],
    "@typescript-eslint/naming-convention": [
      "error",
      {
        selector: "interface",
        format: ["PascalCase"],
        custom: {
          regex: "^I[A-Z]",
          match: false,
        },
      },
    ],
  },
  settings: {
    react: {
      version: "detect",
    },
  },
};
