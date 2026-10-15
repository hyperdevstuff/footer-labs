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
    name: "kinetic-wordmark",
    title: "Kinetic Wordmark",
    description:
      "A full-bleed statement wordmark with a small utility row above it, performing one of four pure-CSS hover gestures. One registry entry with a variant knob — the gestures are not separately installable.",
    dependencies: [],
    meta: {
      category: "kinetic",
      tags: ["wordmark", "typography", "hover", "css-only"],
      tier: "css",
      status: "stable",
      contributor: "hyperdevstuff",
      dateAdded: "2026-10-15",
      credit: { original: true },
      reducedMotion:
        "Degrades to a complete, static wordmark: the entrance animation is disabled and every gesture collapses to its open state — the full word shows unclipped, filled and upright. Nothing is hidden or half-cut.",
      a11y: "The four gestures are pointer-only; touch devices and keyboards always get the complete word, and screen readers hear the plain word once (the per-letter spans are aria-hidden). The entrance animation runs on load, so a footer mounted below the fold has already animated before it is scrolled to. The per-letter stagger is capped at 16 letters — longer words render whole but lose the stagger. Links are small (text-sm); the hover accent tint may fall short of 4.5:1 at some hues, though it is never the only state signal.",
      knobs: [
        {
          kind: "select",
          prop: "variant",
          label: "Gesture",
          options: ["reveal", "wipe", "riffle", "focus"],
          default: "reveal",
        },
        { kind: "text", prop: "word", label: "Word", default: "Meridian" },
        {
          kind: "select",
          prop: "align",
          label: "Align",
          options: ["left", "center", "right"],
          default: "center",
        },
        { kind: "range", prop: "hue", label: "Hue", min: 0, max: 360, step: 1, default: 265 },
        {
          kind: "image",
          prop: "imageSrc",
          label: "Texture (wipe fill)",
          presets: ["/textures/grain.svg", "/textures/topo.svg"],
        },
      ],
    },
  },
];

export const FOOTER_NAMES = FOOTERS.map((footer) => footer.name);
