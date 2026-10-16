import js from "@eslint/js";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import { plugin as shadcn } from "@shadcn/lint";

/**
 * SCOPE IS THE SAFETY MECHANISM, NOT POLISH.
 *
 * `@shadcn/lint` applies to apps/site ONLY. It is deliberately not configured
 * for packages/registry, for concrete reasons:
 *
 *  1. `require-static-classes` structurally cannot fire there — it bails on
 *     plain elements, and a footer is <footer>/<div>/<a>. Keeping it on was
 *     dead config buying zero coverage.
 *  2. `no-unknown-classes` has an untracked bug for `.tsx` files: it ignores
 *     classes declared in a component's own embedded <style> block (its
 *     SFC_RE only matches .svelte/.vue), so it flags legitimate local classes.
 *  3. Every remaining rule (`no-arbitrary-values`, `no-raw-colors`,
 *     `no-inline-styles`) flags the deliberate craft of a self-contained
 *     footer. Those rules are semantically wrong here, not merely noisy.
 *
 * Registry integrity is enforced structurally by
 * packages/registry/scripts/build-registry.ts instead — see CONTRIBUTING.md.
 *
 * @shadcn/lint is pre-1.0 and single-maintainer; patch releases have changed
 * classification semantics. It is pinned exactly on purpose. Do not float it.
 */
export default tseslint.config(
  {
    ignores: [
      "**/node_modules/**",
      "**/.next/**",
      "**/dist/**",
      "**/out/**",
      "**/next-env.d.ts",
      "**/src/generated/**",
      "**/.agents/**",
      "**/.taste-skill/**",
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
   * apps/site — our own UI, and the exact use case this linter exists for.
   * `warn` not `error` for no-unknown-classes: classes can legitimately come
   * from a stylesheet the linter cannot see. Baseline before tightening.
   */
  {
    files: ["apps/site/**/*.{ts,tsx}"],
    plugins: { shadcn },
    settings: {
      shadcn: {
        note: "Gallery chrome follows the footer-labs design system. See CONTRIBUTING.md.",
      },
    },
    rules: {
      "shadcn/no-restyle": ["error", { allow: ["layout"] }],
      "shadcn/no-raw-colors": "error",
      "shadcn/no-arbitrary-values": "error",
      "shadcn/no-unknown-classes": "warn",
      "shadcn/require-static-classes": "error",
      "shadcn/no-inline-styles": "error",
    },
  },

  /**
   * Approved exception. The live knobs write `--fl-*` custom properties, which
   * requires an inline style — it is the sanctioned use and the only one.
   */
  {
    files: ["apps/site/src/components/knobs/**/*.{ts,tsx}"],
    rules: {
      "shadcn/no-inline-styles": "off",
    },
  },

  /**
   * Approved exception. `components/ui` holds shadcn primitives vendored
   * verbatim via the CLI — they are upstream code, not authored chrome, and
   * hand-editing them to satisfy no-arbitrary-values would drift them from
   * the registry they come from.
   */
  {
    files: ["apps/site/src/components/ui/**/*.{ts,tsx}"],
    rules: {
      "shadcn/no-arbitrary-values": "off",
    },
  },
);
