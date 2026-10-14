import fs from "node:fs";
import path from "node:path";

import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import i18nJsonPlugin from "eslint-plugin-i18n-json";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

const I18N_REFERENCE_DIR = path.resolve(import.meta.dirname, "app/i18n/locales/fr");

export default defineConfig([
  globalIgnores(["build", ".react-router", "generated", "coverage", "node_modules"]),

  {
    files: ["**/*.{js,ts,tsx}"],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      react.configs.flat.recommended,
      react.configs.flat["jsx-runtime"],
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
      eslintConfigPrettier,
    ],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: { ...globals.browser, ...globals.node },
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
      "@typescript-eslint/consistent-type-imports": ["error", { fixStyle: "inline-type-imports" }],

      "react/self-closing-comp": "warn",
      "react/prop-types": "off",

      "react-refresh/only-export-components": [
        "warn",
        {
          allowExportNames: [
            "meta",
            "links",
            "headers",
            "handle",
            "loader",
            "clientLoader",
            "action",
            "clientAction",
            "shouldRevalidate",
            "middleware",
            "clientMiddleware",
            "unstable_middleware",
            "unstable_clientMiddleware",
            "Layout",
            "ErrorBoundary",
            "HydrateFallback",
          ],
        },
      ],
    },
  },

  {
    files: ["app/root.tsx", "app/routes/**/*.tsx"],
    rules: {
      "no-empty-pattern": "off",
    },
  },

  {
    files: ["*.config.{js,ts}"],
    languageOptions: {
      globals: globals.node,
    },
    rules: {
      "react-refresh/only-export-components": "off",
    },
  },

  ...(fs.existsSync(I18N_REFERENCE_DIR)
    ? [
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
                    .readdirSync(I18N_REFERENCE_DIR)
                    .filter((f) => f.endsWith(".json"))
                    .map((f) => [f, path.join(I18N_REFERENCE_DIR, f)]),
                ),
              },
            ],
            "i18n-json/sorted-keys": "error",
          },
        },
      ]
    : []),
]);
