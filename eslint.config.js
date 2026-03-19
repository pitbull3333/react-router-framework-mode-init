import fs from "node:fs";
import path from "node:path";

import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import i18nJsonPlugin from "eslint-plugin-i18n-json";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import { globalIgnores } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.defineConfig([
  globalIgnores(["dist", ".yarn", "coverage", ".yalc"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      react.configs.flat.recommended,
      react.configs.flat["jsx-runtime"],
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
      eslintConfigPrettier,
    ],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: globals.browser,
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      "no-restricted-imports": [
        "warn",
        {
          patterns: [
            {
              group: ["../*", "./../*"],
              message:
                "Évite les imports relatifs remontants. Utilise des aliases ou restructure ton code.",
            },
          ],
        },
      ],

      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          args: "all",
          argsIgnorePattern: "^_",
          caughtErrors: "all",
          caughtErrorsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],

      "react/self-closing-comp": "warn",

      "react-refresh/only-export-components": [
        "warn",
        {
          allowExportNames: [
            "loader",
            "action",
            "clientAction",
            "ErrorBoundary",
            "shouldRevalidate",
            "middleware",
            "id",
          ],
        },
      ],
    },
  },

  {
    files: ["app/i18n/locales/**/*.json"],
    plugins: {
      "i18n-json": i18nJsonPlugin,
    },
    processor: {
      meta: { name: ".json" },
      ...i18nJsonPlugin.processors[".json"],
    },
    rules: {
      "i18n-json/valid-json": "error",
      "i18n-json/identical-keys": [
        "error",
        {
          filePath: Object.fromEntries(
            fs
              .readdirSync(path.resolve(process.cwd(), "app/i18n/locales/fr"))
              .filter((f) => f.endsWith(".json"))
              .map((f) => [f, path.resolve(process.cwd(), "app/i18n/locales/fr", f)]),
          ),
        },
      ],
      "i18n-json/sorted-keys": "error",
    },
  },
]);
