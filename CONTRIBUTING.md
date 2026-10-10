# Contributing

Thanks for wanting to contribute. Read this before writing code — the quality
bar *is* the product, and a large library of inconsistent footers would be
worse than a small one.

**Footers are added one at a time, deliberately.** Open an issue describing the
footer you want to add before you write it, so we can talk about whether it
belongs.

---

## The bar

A footer merges only when every line is true.

**Correctness**
- [ ] One self-contained file. No imports from `components/ui`, no context, no app state.
- [ ] **Copy-paste test**: it renders correctly in a fresh `create-next-app` with nothing from this repo.
- [ ] Typecheck and lint clean. Zero console warnings, zero hydration mismatch.
- [ ] All content is real DOM — nothing important is animation-only.

**Responsive**
- [ ] Correct at 320, 768, 1280 and 1920. No horizontal scroll, no overlapping text.

**Theme**
- [ ] Legible in dark **and** light with no configuration toggle.
- [ ] Accent colour reads `--fl-*` with a fallback. Never declared on the element that reads it.

**Accessibility**
- [ ] `prefers-reduced-motion` degrades to a complete, static footer — never breaks, never blanks.
- [ ] Real `<footer>` landmark, `<nav aria-label>`, real `<a href>`.
- [ ] Focus visible on every interactive element.
- [ ] Body text ≥ 4.5:1 contrast.
- [ ] Duplicated decorative markup is `aria-hidden`.

**Honesty**
- [ ] `meta.a11y` records known limitations, not "none".
- [ ] `meta.reducedMotion` describes what actually happens.
- [ ] `meta.credit` is a technique credit, or `{ original: true }`. Never empty.

**Mechanical**
- [ ] `pnpm registry:validate` passes.
- [ ] `pnpm lint && pnpm typecheck && pnpm build` pass.
- [ ] **One footer per PR.** A PR with eight footers is unreviewable and uncreditable.

---

## Breaking the rules

Sometimes a footer must break a rule — a WebGL shader genuinely cannot honour
"works with JS disabled". That is fine. Silent breakage is not.

To break a rule, all of the following must be true:

1. `meta.status` is `"experimental"`
2. `meta.deviations[]` names the specific rules being broken
3. The gallery badges it visibly with those deviations listed
4. Its footer page states what it cannot do, plainly
5. **It does not count toward the library total**

The library keeps a hard cap of **≤30% experimental** footers. Past that it is
marketing itself dishonestly, which is the one thing the tagline rules out.

---

## Inspiration and attribution

This is the part people get wrong, so please be careful.

- **Take the technique, never the expression.** Layouts and structures are not
  copyrightable; specific illustrations, photographs, logos, fonts and written
  marketing copy are. Rebuild everything in your own layout, colours, type and
  words.
- **Credit the technique, not the design.** Write *"Technique study — masked
  marquee easing adapted from [site]"*, not *"Based on [site]'s footer"*. The
  second one implies copying, and it is the thing that causes real problems.
- **Never use real brand assets or real marketing copy.** Invented company
  names and neutral placeholder copy only.
- **Imagery does not go in the source tree.** Preview assets live in
  `apps/site/public/`. MIT covers our code; it does not license photographs,
  generated images, or fonts. Nothing over ~50KB gets committed, no video is
  committed, and fonts always come from `next/font` or Google Fonts.

If you are unsure whether a study is too close to the original, it is too
close. Ask in the issue before you write it.

---

## Technical constraints

- **Every Tailwind class must be written out in full.** A computed class name
  is invisible to Tailwind's scanner, so the style silently never ships. The
  registry validator catches this. Passing a consumer's `className` through a
  slot (`` className={`bg-background ${className}`} ``) is fine.
- **Style hooks use `data-*` attributes**, never invented class names. A class
  Tailwind does not know generates no CSS at all.
- **Keyframes live in an embedded `<style>` block** in the component. A
  consumer must never need to edit `globals.css`.
- **`kebab-case` filename = registry name = npm subpath.** One string, three
  places.
- **Tailwind v4** is the target. If you need a v3 fallback, say so in the
  footer page — do not make the code carry both.

---

## What we will decline

- A footer that is a copy of another site's footer, regardless of credit.
- Anything that cannot render as a single file.
- Bulk PRs. One footer, one PR, one credit.
- A footer with real brand names or third-party marketing copy in it.

---

## Adding one

1. Open an issue first.
2. Copy `packages/registry/src/footers/README.md` — it is the contract.
3. Write `packages/registry/src/footers/<name>.tsx`.
4. Append to `packages/registry/src/footers-meta.ts`.
5. Register the component in `packages/registry/src/catalog.ts`.
6. `pnpm registry:validate`
7. Open the PR with a screenshot at desktop **and** mobile.

There is more in [AGENTS.md](./AGENTS.md) about how this repository is
structured and why.
