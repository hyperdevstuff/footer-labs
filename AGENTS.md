# AGENTS.md

Operating instructions for agents working in `footer-labs`.

**footer-labs** is a curated, copy-paste-ready library of landing-page footer
components for Next.js + Tailwind. MIT, public, built in public.

> Tasteful footers, because we care about the end.

Read this file before touching anything. It encodes decisions that were argued
and settled — reversing one is a deliberate act, not an accident.

---

## 1. The product in one paragraph

Each footer is **one self-contained `.tsx` file** that a developer can paste
into any project and have it work immediately. That promise — *paste and it
just works* — is the entire product. Every architectural decision below exists
to protect it, and anything that breaks it is a regression even if the code
looks cleaner.

Volume is not the goal. Craft is. A library of forty mediocre footers is worth
less than ten excellent ones, and the curation claim is what makes the repo
worth anything.

---

## 2. Repository layout

```
apps/site/            Next.js 16 gallery — the product surface
packages/registry/    the footers + registry schema — ships as plain source, no build
packages/primitives/  @footer-labs/primitives — reserved, not yet built
skills/               public skill (craft-first footer design)
```

`packages/registry` has **zero build step by design**. The CLI copies source
files verbatim; compiling them would defeat the premise. Only `primitives`, if
it ever ships, gets built.

---

## 3. The footer contract

Full detail in `packages/registry/src/footers/README.md`. The load-bearing rules:

1. **Self-contained.** No imports from `components/ui`. No context, no app
   state. It must render in a bare `create-next-app`.
2. **`kebab-case` filename = registry `name` = npm subpath.** One string, three
   places, never allowed to diverge. No exceptions — one exception breaks grep,
   URL casing, and CLI autocomplete for everyone after you.
3. **Structural colour → shadcn semantic tokens.** `bg-background`,
   `text-muted-foreground`, `border-border`. Re-themes for free in a themed
   project.
4. **Accent colour → `--fl-*` custom properties, read with a fallback.**
   `oklch(.72 .16 var(--fl-hue, 265))`.
   **Never declare `--fl-*` on the same element that reads it** — a declaration
   shadows the inherited value, which breaks both the theme-snippet path and
   the live knobs.
5. **Every class written out in full.** A computed class name is invisible to
   Tailwind's scanner, so the style silently never ships. `pnpm registry:validate`
   catches this with a brace-balanced scanner, not a regex.
6. **Style hooks are `data-*` attributes.** Never an invented class name that
   Tailwind does not know — see §7.
7. **Keyframes live in an embedded `<style>` block.** A consumer must never
   have to edit `globals.css`.
8. **`prefers-reduced-motion` degrades.** Never breaks, never blanks, never
   hides content. Document what happens in `meta.reducedMotion`.
9. **Invented copy only.** No real brand names, no third-party marketing copy.

### Theming, precisely

Three layers, in precedence order:

| Layer | Mechanism | Who uses it |
| --- | --- | --- |
| Explicit | `hue={200}` prop → inline style on the footer root | a caller, or a site knob |
| Theme snippet | `--fl-hue` set on any ancestor | a consumer pasting "theme this footer" |
| Default | the `var()` fallback | nobody does anything |

The site's live knobs drive the **props**, so the slider on the site and the
value in the copied code are the same number. That is the point of this design.

---

## 4. Adding a footer

Footers are designed **one at a time, with deliberate intent**. Do not batch
generate them, and do not invent a dozen to "get ahead".

1. Write `packages/registry/src/footers/<name>.tsx`.
2. Append the entry to `packages/registry/src/footers-meta.ts`.
3. Register the component in `packages/registry/src/catalog.ts`.
4. `pnpm registry:validate` — must pass.
5. `pnpm registry:build` — emits `apps/site/public/r/<name>.json`.

Every footer needs real, honest metadata. `meta.a11y` states **known limits** —
a footer that says "this fails contrast at small sizes" is more useful than one
that claims there are no limits.

### Exceptions are tracked, never silent

A footer may break a checklist rule **only** if `meta.status` is
`"experimental"`, it declares `meta.deviations[]`, the gallery badges it
visibly, **and it does not count toward the library total**.

Hard cap: **≤30% experimental**. Past that the library is marketing itself
dishonestly, which is the exact thing the tagline forbids.

---

## 5. Attribution — non-negotiable

MIT covers **our code only**, and the README says so in plain words.

- Every footer carries a `credit`: a URL plus a **technique** description, or
  `{ original: true }`. It is never empty.
- Credits describe a **technique** — an easing curve, a masking approach, a
  type scale. Never a design, a layout, or copy.
- No third-party brand assets, logos, or real marketing copy, ever.
- **Imagery never enters the MIT source tree.** Preview assets live in
  `apps/site/public/`. Nothing over ~50KB gets committed; no video is committed.
- **Fonts: footers never load one.** A footer uses the consumer's `font-sans` /
  `font-mono`. Bundling a 52KB binary inside copy-paste code breaks the
  self-contained promise and silently overrides a decision the consumer already
  made. Typography is a site concern — see `TYPOGRAPHY.md` — plus a documented
  type pairing on each footer page, never a bundled asset. The site itself may
  self-host: Paper Mono is OFL, and its licence must stay beside the file.
- `CREDITS.md` becomes a curated reading list of the footers that inspired us.
  Crediting costs nothing and sends readers to the people who did it first.

If you are unsure whether a technique study is too close, it is too close.

Sites under active study are listed in `INSPIRATION.md` — read it before
starting a footer, and add to it when you find one worth studying.

---

## 6. Toolchain — and why each pin exists

| Choice | Why not the alternative |
| --- | --- |
| **Next.js 16** App Router, Turbopack | — |
| **React 19.2** | — |
| **Tailwind v4** (CSS-first `@theme`) | v3 is the past. v4 needs the `@source` lines in `globals.css` — see §8. |
| **Base UI** (shadcn default since July 2026) | Radix is supported but not recommended for new projects. Footers import no primitives, so this affects only `apps/site`. |
| **TypeScript 5.9** | TS 7.0 shipped Aug 2026 and is ~10× faster, but it has **no stable programmatic API** — typescript-eslint cannot use it yet. Do not upgrade until the ecosystem catches up. |
| **pnpm 10**, pinned via Corepack | Bun is faster on cold installs but skips lifecycle scripts (needs `trustedDependencies` for `@swc/core`), honours fewer `.npmrc` directives, and is weakest on cross-platform lockfiles — and we develop on Windows locally and Linux in Codespaces. |
| **Biome** for formatting only | Replaces Prettier, ~25× faster, also handles CSS/JSON. Linter stays off — Biome cannot run `@shadcn/lint`. |
| **ESLint 9 + `@shadcn/lint` pinned exact** | See §7. Pre-1.0, single maintainer; patch releases have changed classification semantics. **Do not float this version.** |
| **Actions for all heavy work** | Actions is free and unlimited on public repos. Never burn Codespaces quota on browser tests or builds. |

---

## 7. The lint contract

`@shadcn/lint` applies to **`apps/site` only**. It is deliberately absent from
`packages/registry`. This is not a compromise — it is the safety mechanism:

- `require-static-classes` **cannot fire** on registry files. It bails on plain
  elements, and a footer is `<footer>`/`<div>`/`<a>`.
- `no-unknown-classes` has an **untracked bug for `.tsx`**: it ignores classes
  declared in a component's own embedded `<style>` block (its SFC detection
  only matches `.svelte`/`.vue`), so it flags legitimate local classes. This is
  why §3.6 mandates `data-*` hooks.
- The remaining rules flag the deliberate craft of a self-contained footer. They
  are semantically wrong there, not merely noisy.

**Registry integrity is enforced structurally** by
`packages/registry/scripts/build-registry.ts`. That is the real gate.

### Known escapes — the linter will not catch these

Agents working under this linter will reach for these instead of fixing the
design. Review for them by hand:

| Escape | Symptom |
| --- | --- |
| Minting a theme token | a new `--color-*` in `globals.css` makes `no-raw-colors` pass without fixing anything |
| Moving CSS to a stylesheet | plain `.css` is entirely outside the rules |
| Parent-selector bypass | `[&_button]:bg-primary` reaches a child component the rules do not track |

**Never silence a `shadcn/*` finding by any of those three.** Fix the
component, or leave the finding failing and say why. A passing lint result does
not approve the design.

---

## 8. Traps in this repo — read before debugging from scratch

These are real. Each one cost time during setup.

1. **Tailwind does not scan `packages/registry`.** Tailwind v4 auto-detects
   sources from the app directory only. Without the `@source` lines in
   `apps/site/src/app/globals.css`, every footer renders **completely
   unstyled** and nothing errors. That file is at `apps/site/src/app/`, so the
   registry is **four** levels up: `@source "../../../../packages/registry/src"`.
   If you move a package, update it.
2. **`next lint` was removed in Next 16 and `next build` no longer lints.** The
   lint gate is an explicit `pnpm lint` step in CI. Do not assume the build
   catches lint errors.
3. **Biome needs `"css": { "parser": { "tailwindDirectives": true } }`** or it
   rejects `@source`, `@theme` and `@custom-variant`.
4. **Next 16 requires `await params`** in every dynamic route.
5. **React Compiler** is enabled in `next.config.ts` and requires
   `babel-plugin-react-compiler` to be installed, or the build fails with an
   unhelpful resolver error.
6. **A registry entry must match a file on disk, both ways.** The validator
   fails if you add a `.tsx` without metadata (it would never ship) or metadata
   without a file.

---

## 9. Codespaces discipline

Development is Codespaces-only, on a **personal account** (org plans include
**zero** free Codespaces quota).

- **120 core-hours/month** — about 60 hours on the 2-core default machine.
  That is the entire budget. It is for *designing*, not for running tests.
- **Never install Playwright/Chromium in the devcontainer.** ~1GB, and browser
  testing belongs in Actions where it is free. Use the built-in preview.
- **`next dev` resets the idle timer.** Terminal I/O counts as activity, so an
  unattended dev server prevents the 30-minute auto-stop and drains the entire
  monthly quota silently. Stop it when you step away.
- **No prebuilds** — a snapshot is 8–15GB against a 15GB-month budget, and
  exhausting storage *disables* prebuilds. Devcontainer uses the default image
  with the Node feature, so base storage stays free.
- **GPU does not exist in Codespaces** (deprecated 2025-08-29). WebGL renders
  through SwiftShader and needs `--enable-unsafe-swiftshader`. WebGPU cannot
  be verified here at all — see §11.
- Short-lived: retention 0–1 day. Storage bills whether the machine runs or not.

---

## 10. Accessibility

Hard requirement, not a nice-to-have:

- Real `<footer>`, `<nav aria-label>`, `<a href>`. Focus visible on everything.
- Body text ≥ 4.5:1 contrast in **both** schemes, without a config toggle.
- `prefers-reduced-motion` degrades to a static, complete, correct footer.
- Duplicated decorative markup (marquee tracks, repeated columns) is
  `aria-hidden` so assistive tech hears it once.
- The reduced-motion fallback is the **OS setting only**. There is no site-level
  override: a switch that contradicts what the visitor's own system says costs
  more than the demo is worth. Verify a footer's fallback by changing the OS
  setting.

---

## 11. Tiering

Tier describes **dependency cost**, not complexity.

| Tier | Meaning | Share |
| --- | --- | --- |
| `css` | Tailwind and CSS only. Zero npm dependencies. | ~70% |
| `motion` | depends on `motion` | ~20% |
| `webgl` | needs WebGL (SwiftShader-verifiable) or `shaders` | ~10% |

- **WebGPU is unverifiable in Codespaces and in free CI.** If a WebGPU footer
  ships, it is manually verified, badged `experimental`, and its footer page
  must say plainly that no automated visual coverage exists.
- `shaders` (shaders.com) is a legitimate Tier-3 dependency for WebGPU
  footers. A footer using it breaks the self-contained contract and **must** be
  badged with its dependency — confirm its license before shipping.
- Every footer card shows its tier badge. That is the filter people need when
  they want to paste without changing their build.

---

## 12. Definition of done

A footer merges when all of this is true:

- [ ] `pnpm registry:validate` passes
- [ ] `pnpm lint`, `pnpm typecheck`, `pnpm build` pass
- [ ] Pastes into a **fresh** `create-next-app` and renders correctly
- [ ] Correct at 320 / 768 / 1280 / 1920, no horizontal scroll
- [ ] Dark **and** light legible with no config
- [ ] `prefers-reduced-motion` degrades to something complete
- [ ] Real landmarks, visible focus, ≥4.5:1 body contrast
- [ ] No console warnings, no hydration mismatch
- [ ] Metadata complete; `credit` is a URL or `{ original: true }`, never empty

The copy-paste test is the one that proves the promise. Everything else is craft.

---

## 13. Skills

`skills/footer-design` is **craft-first**. It teaches footer craft and points at
this library as the fast path — it is not an advertisement, and it reads the
live registry rather than hardcoding names, so it cannot go stale.

Skills that shape footer work in this repo: `emil-design-eng`, `shadcn`,
`frontend-design`, `better-ui` / `make-interfaces-feel-better`,
`fixing-accessibility`, `web-design-guidelines`, `hairline` (**skill only** —
use `hairline-create` to generate original isometric figures, and credit it;
never vendor or copy its drawings).

---

## 14. Commands

```bash
pnpm dev               # gallery at localhost:3000
pnpm lint              # ESLint + @shadcn/lint (apps/site only)
pnpm lint:fix
pnpm format            # Biome
pnpm format:check
pnpm typecheck
pnpm registry:validate # gate — run after every footer edit
pnpm registry:build    # emits apps/site/public/r/*.json
pnpm build
```
