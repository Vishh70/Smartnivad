import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  {
    ignores: [
      ".next/**",
      "artifacts/**",
      "out/**",
      "build/**",
      "coverage/**",
      "next-env.d.ts",
      "node_modules/**",
      "reports/**",
      "refactor_theme.js",
      "public/sw.js",
      "public/sw.js.map",
      "public/sw-*.js",
      "public/swe-worker-*.js",
      "public/workbox-*.js",
    ],
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];

export default eslintConfig;
