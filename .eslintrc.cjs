module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:n/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:css-modules/recommended",
    "prettier",
  ],
  plugins: ["react", "css-modules"],
  overrides: [
    {
      env: {
        node: true,
      },
      files: [".eslintrc.{js,cjs}"],
      parserOptions: {
        sourceType: "script",
      },
    },
  ],

  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    project: "tsconfig.json",
  },
  ignorePatterns: ["*.css"],
  rules: { "n/no-missing-import": "warn" },
};
