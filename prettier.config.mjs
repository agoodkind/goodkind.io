/**
 * Prettier configuration
 * @type {import("prettier").Config}
 */
export default {
  // Line length (matching your style rules: <90 preferred)
  printWidth: 88,

  // Indentation
  tabWidth: 2,
  useTabs: false,

  // Strings
  singleQuote: false,
  quoteProps: "as-needed",

  // Trailing commas (ES5 = objects/arrays, not function params)
  trailingComma: "es5",

  // Semicolons
  semi: true,

  // Brackets
  bracketSpacing: true,
  bracketSameLine: false,
  arrowParens: "always",

  // End of line
  endOfLine: "lf",

  // Embedded languages
  embeddedLanguageFormatting: "auto",
};
