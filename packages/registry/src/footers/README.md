# `src/footers/`

One file per footer, named in `kebab-case`. The filename, the registry `name`
and the npm subpath are the **same string** — they must never diverge, because
`npx shadcn add @footer-labs/<name>` resolves all three at once.

## The contract

Every file here is a **single self-contained component**. It must render
correctly when pasted into a bare `create-next-app` with nothing else from this
repo. Concretely:

| Rule | Why |
| --- | --- |
| No imports from `components/ui` | The consumer may not have shadcn. |
| No app state, no context, no props beyond knobs | A footer is the bottom of a page, not an app. |
| Structural colour uses shadcn semantic tokens | `bg-background`, `text-muted-foreground`, `border-border` — so it re-themes for free in a themed project. |
| Accent colour uses `--fl-*` custom properties | Read with a fallback: `oklch(.72 .16 var(--fl-hue, 265))`. Never declare `--fl-*` on the element that reads it, or an inherited value from a theme snippet will be shadowed. |
| Every class written out in full | `className={`bg-${color}`}` is caught by `pnpm registry:validate` — Tailwind's scanner cannot see computed classes, so the style would never ship. Passing a consumer's `className` through a slot (`` `bg-background ${className}` ``) is fine. |
| Style hooks use `data-*` attributes, not invented classes | A class the project's Tailwind does not know generates no CSS. `data-fl-marquee` + an embedded `<style>` block keeps the file self-contained. |
| Keyframes live in an embedded `<style>` | A consumer should not have to touch `globals.css`. |
| `prefers-reduced-motion` degrades | Never breaks, never blanks. Say what happens in `meta.reducedMotion`. |
| Copy is invented | No real brand names, no third-party marketing copy. |
| Accessibility stated honestly | `meta.a11y` records known limits rather than claiming there are none. |
| Never loads a font | Use the consumer's `font-sans` / `font-mono`. Bundling a font file inside pasted code breaks the self-contained promise. See `TYPOGRAPHY.md`. |

## Adding one

1. Create `src/footers/<name>.tsx`.
2. Append a matching entry to `src/footers-meta.ts`.
3. Register the component in `src/catalog.ts` (`COMPONENTS`).
4. `pnpm registry:validate` — must pass.
5. `pnpm registry:build` — emits `apps/site/public/r/<name>.json`.

Footers are designed **one at a time, deliberately**. Volume is not the goal;
`quiet-minimal` sets the bar and everything else is measured against it.
