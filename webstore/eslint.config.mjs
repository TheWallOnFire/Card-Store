import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "prefer-const": "error",
      "no-var": "error",
      "eqeqeq": ["error", "always"],
      "curly": ["error", "all"],
      "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
      "@typescript-eslint/naming-convention": [
        "error",
        { "selector": "interface", "format": ["PascalCase"], "prefix": ["I"] },
        { "selector": "typeAlias", "format": ["PascalCase"] }
      ],
      "max-lines-per-function": ["warn", { "max": 50, "skipBlankLines": true, "skipComments": true }],
      "max-depth": ["error", 4],
      "complexity": ["warn", 10],
    }
  },
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
