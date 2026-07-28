import js from "@eslint/js";
import tsParser from "@typescript-eslint/parser";
import { defineConfig, globalIgnores } from "eslint/config";
import importX from "eslint-plugin-import-x";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parser: tsParser,
    },
    plugins: {
      "import-x": importX,
    },
    settings: {
      "import-x/resolver": {
        typescript: true, // Resolves @/* path aliases from tsconfig
      },
    },
    rules: {
      "import-x/order": [
        "error",
        {
          groups: [
            "builtin", // Node built-ins: fs, path, etc.
            "external", // npm packages: react, lucide-react, etc.
            "internal", // Path aliases: @/components, @/lib, etc.
            ["parent", "sibling", "index"], // Relative imports: ../, ./
            "object",
            "type", // Type imports: import type { ... }
          ],
          "newlines-between": "always", // Adds an empty line between groups
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
        },
      ],
    },
  },
]);
