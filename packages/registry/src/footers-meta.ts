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

export const FOOTERS: readonly FooterMetaEntry[] = [];

export const FOOTER_NAMES = FOOTERS.map((footer) => footer.name);
