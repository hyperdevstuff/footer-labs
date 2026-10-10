import js from "@eslint/js";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import { plugin as shadcn } from "@shadcn/lint";

const REGISTRY_NOTE =
  "Footer source is the wild — arbitrary values, custom utilities and bespoke colors are the craft. See CONTRIBUTING.md.";

const SITE_NOTE =
  "Gallery chrome follows the footer-labs design system. See CONTRIBUTING.md for approved exceptions.";

export default tseslint.config(
  {
    ignores: [
      "**/node_modules/**",
      "**/.next/**",
      "**/dist/**",
      "**/out/**",
      "**/next-env.d.ts",
      "pnpm-lock.yaml",
    ],
  },

  js.configs.recommended,
  ...tseslint.configs.recommended,

  {
    files: ["**/*.{ts,tsx}"],
    plugins: { "react-hooks": reactHooks },
    rules: {
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
    },
  },

  /**
   * apps/site — our own UI. The full design-system contract applies.
   */
  {
    files: ["apps/site/**/*.{ts,tsx}"],
    plugins: { shadcn },
    settings: { shadcn: { note: SITE_NOTE } },
    rules: {
      "shadcn/no-restyle": ["error", { allow: ["layout"] }],
      "shadcn/no-raw-colors": "error",
      "shadcn/no-arbitrary-values": "error",
      "shadcn/no-unknown-classes": "error",
      "shadcn/require-static-classes": "error",
      "shadcn/no-inline-styles": "error",
    },
  },

  /**
   * Approved exception: the live knobs set CSS custom properties.
   * That is the sanctioned use of an inline style in this repo — it is how a
   * draggable control writes a `--fl-*` variable. Everything else stays linted.
   */
  {
    files: ["apps/site/components/knobs/**/*.{ts,tsx}"],
    rules: {
      "shadcn/no-inline-styles": "off",
    },
  },

  /**
   * packages/registry — the footers themselves.
   *
   * Every footer is a single self-contained file that must render correctly in
   * a bare `create-next-app`. That requires arbitrary values, custom CSS
   * utilities and hardcoded colors — exactly what these four rules forbid.
   * They are therefore switched off here, ON PURPOSE, and the two rules that
   * still protect the library's own integrity stay on:
   *
   *   no-unknown-classes     — catches typos and Tailwind v3 names that would
   *                            silently render as nothing in a v4 project.
   *   require-static-classes — catches `bg-${color}` template literals, which
   *                            Tailwind's scanner cannot see.
   */
  {
    files: ["packages/registry/**/*.{ts,tsx}"],
    plugins: { shadcn },
    settings: { shadcn: { note: REGISTRY_NOTE } },
    rules: {
      "shadcn/no-restyle": "off",
      "shadcn/no-raw-colors": "off",
      "shadcn/no-arbitrary-values": "off",
      "shadcn/no-inline-styles": "off",
      "shadcn/no-unknown-classes": "error",
      "shadcn/require-static-classes": "error",
    },
  },
);
