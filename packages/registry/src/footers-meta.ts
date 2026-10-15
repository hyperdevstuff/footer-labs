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
] as const;

export const FOOTER_NAMES = FOOTERS.map((footer) => footer.name);
