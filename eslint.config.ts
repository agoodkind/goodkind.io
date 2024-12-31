import eslint from "@eslint/js";
import reactPlugin from "eslint-plugin-react";
import tseslint from "typescript-eslint";
export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.recommended,
  {
    files: ["src/*.{js,jsx,ts,tsx}"],
    ignores: ["dist/**/*", "chrome-debug-profile"],
    plugins: {
      react: reactPlugin
    },
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname
      }
    }
  }
);
// export default [
//   {
//     files: ["src/*.{js,jsx,ts,tsx}"],
//     ignores: ["dist/**/*", "chrome-debug-profile"],
//     plugins: {
//       react: reactPlugin
//     },
//     languageOptions: {
//       parserOptions: {
//         ecmaFeatures: {
//           jsx: true
//         }
//       },
//       globals: {
//         ...globals.browser
//       }
//     },
//     rules: {
//       "no-console": [0]
//     }
//   }
// ] satisfies Linter.Config[];
