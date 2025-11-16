// eslint.config.mjs
import tseslint from "typescript-eslint";
import prettier from "eslint-plugin-prettier";

export default [
  // 1) Ignore non-source files so lint only touches your app code.
  {
    ignores: [
      "node_modules/**",
      ".expo/**",
      "dist/**",
      "build/**",
      // ignore all common config files
      "babel.config.*",
      "metro.config.*",
      "tailwind.config.*",
      "eslint.config.*",
      "jest.config.*",
      "tsconfig.*",
      "*.d.ts",
    ],
  },

  // 2) Format-only mode on your source code
  {
    files: ["App.{js,jsx,ts,tsx}", "src/**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      parser: tseslint.parser, // allow TypeScript syntax
      ecmaVersion: 2021,
      sourceType: "module",
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    plugins: { prettier },
    rules: {
      // ✅ Only Prettier formatting
      "prettier/prettier": [
        "warn",
        {
          singleQuote: true,
          semi: true,
          trailingComma: "all",
          printWidth: 80,
          endOfLine: "auto",
        },
      ],

      // 🔕 Turn off common nags while you build
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
];