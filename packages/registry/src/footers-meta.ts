/**
 * Footer metadata.
 *
 * Deliberately free of JSX so that both the site (which needs the components)
 * and `scripts/build-registry.ts` (which only needs the metadata) can import
 * this file. Node strips the types; it cannot strip JSX.
 *
 * TO ADD A FOOTER: write `src/footers/<name>.tsx`, then append an entry here.
 * `pnpm registry:validate` fails if the two ever disagree, so you cannot
 * forget one half or ship a file that never reaches the registry.
 */

import type { FooterMeta } from "./schema";

export type FooterMetaEntry = {
  readonly name: string;
  readonly title: string;
  readonly description: string;
  readonly dependencies: readonly string[];
  readonly meta: FooterMeta;
};

export const FOOTERS: readonly FooterMetaEntry[] = [
  {
    name: "quiet-minimal",
    title: "Quiet Minimal",
    description:
      "The taste bar. No newsletter capture, no social row, no motion, no client JavaScript — just proportion, a hairline and restrained type.",
    dependencies: [],
    meta: {
      category: "minimal",
      tags: ["wordmark", "link-index", "hairline", "dark-first"],
      tier: "css",
      status: "stable",
      contributor: "hyperdevstuff",
      dateAdded: "2026-10-11",
      credit: { original: true },
      props: [
        {
          name: "hue",
          type: "number",
          default: "24",
          description:
            "Accent hue, 0–360. Writes the --fl-hue custom property the footer reads. The only knob.",
        },
        {
          name: "className",
          type: "string",
          description: "Merged onto the <footer> element, after the footer's own classes.",
        },
      ],
      knobs: [
        {
          kind: "range",
          prop: "hue",
          label: "Accent hue",
          min: 0,
          max: 360,
          step: 1,
          default: 24,
        },
      ],
      reducedMotion: "Nothing animates. There is nothing to degrade.",
      a11y: "Real <footer> and <nav> landmarks, labelled navigation, real links, visible focus rings with a background offset so they survive on the hairline borders.",
    },
  },
  {
    name: "colophon",
    title: "Colophon",
    description:
      "The footer as the last leaf of a book: a contents page that doubles as its own specification. Grouped columns with a scale-jump header, links that invert as one continuous block, and the version, runtime and licence stated as real data.",
    dependencies: [],
    meta: {
      category: "editorial",
      tags: ["grouped-index", "specification", "licence", "link-index", "two-level-header"],
      tier: "css",
      status: "stable",
      contributor: "hyperdevstuff",
      dateAdded: "2026-10-15",
      credit: {
        url: "https://hermes-agent.nousresearch.com",
        technique:
          "A two-level column header built as a scale jump rather than a style change, and a link hover that is a filled chip which inverts at zero colour duration, with rows butted together by a negative margin so a column's links read as one continuous block.",
        note: "A licence set at the same size as the legal links beside it. The legal column itself follows paper.design.",
      },
      props: [
        {
          name: "hue",
          type: "number",
          default: "265",
          description:
            "Accent hue, 0–360. Writes the --fl-hue custom property the footer reads. The only knob.",
        },
        {
          name: "className",
          type: "string",
          description: "Merged onto the <footer> element, after the footer's own classes.",
        },
      ],
      knobs: [
        {
          kind: "range",
          prop: "hue",
          label: "Accent hue",
          min: 0,
          max: 360,
          step: 1,
          default: 265,
        },
      ],
      reducedMotion:
        "Nothing animates except link colour on hover and focus, which is a 150ms colour transition and holds completely still under prefers-reduced-motion because it moves nothing. There is no motion to degrade.",
      a11y: "Real <footer> and labelled <nav> landmarks, real links, real buttons, and a <dl> for the metadata rather than a div soup. The inverting hover is duplicated exactly as the focus-visible state, so a keyboard user gets the same affordance a pointer user does. Known limits: the licence toggle needs script to open, so without it the licence's first line is unreachable — the footer is still complete, it just says less.",
    },
  },
] as const;

export const FOOTER_NAMES = FOOTERS.map((footer) => footer.name);
