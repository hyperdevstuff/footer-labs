# Typography

Three families, three jobs. Defined once in `apps/site/src/app/fonts.ts` and
exposed as `font-sans`, `font-display` and `font-mono`.

| Family | Role | Why |
| --- | --- | --- |
| **Inter** | `font-sans` — body, UI, defaults | Tight, neutral, holds up at 14px where footers live. |
| **Geist** | `font-display` — wordmarks, headings | A little more character than Inter at large sizes, which is exactly where a footer has room to have one. |
| **Paper Mono** | `font-mono` — badges, code, metadata | Self-hosted variable file. All eight weights in 52KB. |

## The mono pairing is not arbitrary

Paper Mono is **derived from Geist Mono** — its licence file says so in the
first line. They share a skeleton, so mono set next to Geist looks deliberate
rather than assembled. Worth knowing before swapping either one.

Paper Mono: Copyright (c) 2025 Lost Coast Labs, Inc. (Paper Design). Designed by
Guido Ferreyra and Vladyslav Moroz. **SIL Open Font License 1.1** —
[paper-design/paper-mono](https://github.com/paper-design/paper-mono).

## Loading

- **Inter, Geist** — `next/font/google`. Fetched at build time and self-hosted.
  No third-party request at runtime.
- **Paper Mono** — `next/font/local`, one variable `woff2`, self-hosted from
  `src/fonts/`. The OFL licence travels with the file at
  `src/fonts/PaperMono-OFL.txt` and must not be separated from it.

## The rule that matters

> **A footer never loads, bundles, or hardcodes a font.**

Footers use the consumer's `font-sans` / `font-mono` from their Tailwind theme.
Three reasons:

1. A 52KB binary riding along inside copy-paste code breaks the entire
   self-contained promise for something the consumer has already solved.
2. Hardcoding `font-family: "Paper Mono"` in a pasted file produces a silently
   different result from what the preview showed.
3. Font choice is a **consumer decision**, and a footer library has no business
   making it for them.

Typography is therefore a *site* concern, plus a documented *type pairing* on
each footer page — "this one wants a display face with tight tracking, this one
wants mono at 11px for metadata" — never a bundled asset.

Our own earlier rule was "never commit a `.woff2`", written for footers. The
site is the opposite case: it is our own typography, and OFL explicitly permits
bundling, embedding and redistribution provided the font files themselves stay
OFL. That distinction is recorded in `AGENTS.md`.
