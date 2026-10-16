# Credits

footer-labs exists because people made beautiful footers first. This page is
our reading list — every technique here was learned from someone else's work,
and we think you should go look at it.

Each footer in the library carries its own credit in its metadata. This page is
the collected list.

---

## How we credit

We credit **techniques**, not designs. A technique is a reusable craft
decision — an easing curve, a masking approach, a type scale, a way of
handling reduced motion. Layouts and structures are not copyrightable;
specific illustrations, photographs, logos, fonts and written marketing copy
are, and none of those are reproduced here.

When we were still working out what to do about this, the question we kept
returning to was: what would the people who built the best examples actually
want us to do? The answer, consistently, was *credit them and link to it*.

The MIT license covers **the code in this repository**. It does not license
photographs, generated imagery, or fonts, and no such asset is committed to the
source tree.

---

## Tools we learned from

- **[shadcn/ui](https://ui.shadcn.com)** — MIT. The registry distribution model
  this library is built on. Every footer here installs with `npx shadcn add`.
- **[Hairline](https://hairline.lucasmarkes.com)** — MIT, © Lucas Marques.
  Isometric line figures that answer the pointer. We use its skill to generate
  original figures rather than copying its drawings.
- **[Anatomy](https://skills.wheresryan.sh/anatomy)** — MIT, © Ryan. Isometric
  figures in SVG, WebGL and 3D, and a build-then-verify-with-screenshots loop we
  borrow wholesale.
- **Motion**, **Tailwind CSS**, **Radix / Base UI** — the substrate.

---

## The reading list

### [hermes-agent.nousresearch.com](https://hermes-agent.nousresearch.com) → `colophon`

Nous Research's agent product. MIT licensed, which is why we are comfortable
studying it closely.

**Taken: a two-level column header built as a scale jump rather than a style
change.** The pattern is a quiet label, then the sub-brand set larger in the
same family — hierarchy produced by scale rather than by switching from one
typeface to another. We had been reaching for a typeface change to mark a
column heading, which is the more expensive move and the more generic one.

`colophon` uses it on all four columns, with the second-level line carrying the
real distinction between them (Build / Open source / Documentation / The small
print) rather than repeating the product name.

**Taken: the link hover as a filled chip that inverts, at zero colour
duration.** The link's background fills and its text flips to the inverse at
`duration-0`, so the state snaps rather than fades. The rows are butted together
by a negative vertical margin on the list, so a column's links read as one
continuous block instead of four separate items.

We took the mechanism and changed the surface: our inversion runs on the
structural tokens rather than a brand blue, and — the part we think is ours —
**the focus-visible state is the same inversion**, so a keyboard user gets
exactly the affordance a pointer user gets rather than a ring bolted on beside
it.

**Taken: the licence set as a peer of the terms it governs.** `MIT License ·
2026` sits at the same size and weight as the legal links beside it, on the
same baseline. For an open-source product that is the most important line in
the footer and treating it as fine print is a mistake. We went further and made
it a control that reveals the licence's first line — the sentence a reader
actually needs.

### [paper.design](https://paper.design) → `colophon`

**Taken: legal as a peer column, not a strip.** `privacy · terms · dpa ·
subprocessors` is a fourth column with its own heading, holding the documents
that only matter to companies, sitting in the same row at the same size as
everything else.

Worth recording what we did **not** take: paper's footer texture (papercut,
halftone, CMYK plates) is print material used as identity. It is the right idea
for them and the wrong one for a library footer, where the texture would be
decoration with no subject to decorate. That idea is held for a footer whose
subject actually prints something.

**Also observed and deliberately not taken:** the contact address is a button
with a hidden twin span that slides on hover. It needs client JavaScript, which
the self-contained contract here forbids. Recorded so the omission is a
decision rather than an oversight.

When an entry lands it records the site, the technique taken, and what we did
with it. If your footer taught us something and is not on this list, that is a
bug — please open an issue.

Sites we are **studying** — not yet credited — live in
[INSPIRATION.md](./INSPIRATION.md).
