# Inspiration

The working shortlist — sites whose footers we are actively studying.

This is **not** the credits list. [`CREDITS.md`](./CREDITS.md) records what we
actually took and where it came from. `INSPIRATION.md` is where candidates live
before they earn an entry there.

---

## How this list is used

A footer lands in the library one of two ways, and it has to be one of them:

**Technique study** (the default, and almost always the right one) — take the
craft decision, rebuild the rest. Easing curves, masking approaches, type
scales, and the way reduced motion is handled are ideas and techniques; the
layout, the colours, the type and the words are somebody's work. The result gets
a `meta.credit` pointing here, describing what we took.

**Original** — designed from scratch. Gets `credit: { original: true }`.

**Not a path**: shipping a footer that reproduces another's layout, copy or
brand assets, credit line or no credit line. That is the one thing this repo
does not do, and it is not a legal technicality — it is the difference between
a library that earns its stars and one that gets a takedown email and a
reputation nobody wants.

If a study feels borderline, that is the signal to open an issue *before*
writing it. We would rather talk than clean up.

---

## The shortlist

### [paper.design](https://paper.design)

Design platform for teams shipping with agents. Raised a $34M Series A.

What is worth studying:

- **The mega-menu footer.** Five columns, but the hierarchy is the interesting
  part — brand-level columns (`Paper`, `Tools`, `Resources`) sit alongside
  functional ones (`community`, `legal`), and the legal column is deliberately
  last and deliberately quiet.
- **Print texture as identity.** Papercut PNGs, halftone dot patterns and CMYK
  colour references used as decoration. A footer that inherits the brand's
  material rather than restating the brand in words. Directly relevant to the
  `generative` category, where we are reaching for texture instead of stock
  photography.
- **They run their own shader library** at [shaders.paper.design](https://shaders.paper.design).
  Worth a look for the `webgl` tier, and worth checking alongside
  [shaders.com](https://shaders.com) — two independent implementations of the
  same idea is a useful signal.

> **Corrected 2026-10-15** after reading the shipped markup. Two things here
> were wrong:
>
> - The legal links are **not** "a second, tiny legal row floating below the
>   main footer". `privacy · terms · dpa · subprocessors` is a **fourth
>   column** with its own `h4` heading, in the same row and at the same size as
>   everything else. The separate small row is `© 2026` plus a contact button.
> - The contact address is a **button with a hidden twin span that slides** on
>   hover (`visibility:hidden` span under an absolutely positioned twin). It
>   reads as a plain address but behaves like a control. Needs client JS, so we
>   cannot take it — see [CREDITS.md](./CREDITS.md).

Credits owed: **one technique landed** — legal as a peer column, taken for
`colophon`. The texture idea is still open and is the strongest candidate for a
footer whose subject actually prints something.

---

### [hermes-agent.nousresearch.com](https://hermes-agent.nousresearch.com/)

Nous Research's agent product. MIT licensed.

What is worth studying:

- **Grouped columns with a two-level header.** Each column has a quiet group
  label (`Research`, `Products`, `Resources`) with the sub-brand beneath it set
  **larger in the display face** (`Nous`, `Hermes`, `Community`). It reads like
  a table of contents for a company rather than a list of links, and it scales
  to a genuinely deep site without turning into a wall.
- **The licence as a first-class element.** `MIT License · 2026` is set as
  visible content, not buried. For an open-source product it is the most
  important line in the footer and it gets treated as such. This is the exact
  behaviour `footer-labs` already tries to model with per-footer credits — worth
  studying for how to make that legible rather than bureaucratic.
- **A tagline doing the closing.** `The Internet's Own AI.` sits directly above
  the columns as the last thing written on the page. A one-line statement in the
  footer is an underused move; ours is currently a newsletter prompt, and this
  is a better use of that space.
- **Quiet duplication.** The header columns repeat near the bottom (adding a
  `Platform` group). It is either very deliberate or a build artefact — worth
  deciding which before copying anything.

> **Corrected 2026-10-15** after reading the shipped markup. The two-level
> header is **not** "a small caps label with the sub-brand beneath it in
> italic". It is a **scale jump**: an `opacity-60` monospace label, then the
> sub-brand in the display face at question size, normal case, tracking normal.
> No italics anywhere on the page. The mechanism matters more than the
> description — *scale*, not *style*, is what produces the hierarchy, and it is
> the cheaper move.
>
> The link hover is also not an underline. Every link is a **chip that
> inverts** — `group-hover:bg-[fg] group-hover:text-[primary]
> group-hover:duration-0`, with a negative row margin so a column's links butt
> into one continuous block. This is the most transferable thing here.

Credits owed: **three techniques landed** for `colophon` — the scale-jump
header, the inverting chip, and the licence as a peer of the terms. Full detail
in [CREDITS.md](./CREDITS.md).

---

## Adding to this list

Append a section, and record **what is worth studying**, not just the URL. A
list of links decays into a bookmark file within a month. A list of techniques
is still useful in a year.

When something ships, move the technique into `CREDITS.md` with its
`meta.credit` entry and leave the inspiration note behind.
