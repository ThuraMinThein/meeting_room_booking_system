import globals from "globals";
import tseslint from "typescript-eslint";

export default [
  // 1. Global Ignores
  {
    ignores: ["eslint.config.mjs", "dist/**", "node_modules/**"],
  },

  // 2. Main TypeScript Configuration Block
  {
    files: ["src/**/*.ts"],
    // Explicitly define the plugin so ESLint knows how to resolve "@typescript-eslint/*" rules
    plugins: {
      "@typescript-eslint": tseslint.plugin,
    },
    languageOptions: {
      parser: tseslint.parser,
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: "module",
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // Bring in standard recommended rules manually to avoid scope issues
      ...tseslint.plugin.configs.recommended.rules,

      // Your custom rule overrides
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-floating-promises": "off",
      "@typescript-eslint/no-unsafe-argument": "warn",
    },
  },
];