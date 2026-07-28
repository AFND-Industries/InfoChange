import js from "@eslint/js";
import globals from "globals";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist", "android", "public", "node_modules"] },
  js.configs.recommended,
  // La capa de datos (cliente de API, hooks y utilidades) esta en TypeScript,
  // asi que ESLint necesita su parser: sin esto los .ts fallaban al analizarse
  // y en la practica no se revisaban.
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: { ...globals.browser, ...globals.es2021 },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    settings: { react: { version: "detect" } },
    plugins: {
      react,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...react.configs.flat.recommended.rules,
      ...react.configs.flat["jsx-runtime"].rules,
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      // Los contratos de datos viven en los ficheros .ts de src/lib, no en
      // PropTypes.
      "react/prop-types": "off",
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      // Un console.log olvidado imprimia el volcado completo del panel de
      // administracion en la consola del navegador cada diez segundos.
      "no-console": ["warn", { allow: ["warn", "error"] }],
    },
  },
  {
    files: ["**/*.d.ts"],
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
    },
  },
  {
    files: ["vite.config.js", "eslint.config.js"],
    languageOptions: {
      globals: { ...globals.node },
    },
  },
);
