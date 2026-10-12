import type { Metadata } from "next";
import { Suspense } from "react";

import { FOOTERS } from "@footer-labs/registry";
import { Browse, type BrowseFooter } from "@/components/browse/browse";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Footers — footer-labs",
  description:
    "Browse every footer in the library by category and dependency tier. One self-contained file each.",
};

export default function BlocksPage() {
  /*
   * Only the fields the grid draws. The `Component` from the catalog is a
   * function and cannot cross the server/client boundary — and the browse page
   * does not want it anyway, because a live preview belongs on the showcase.
   */
  const footers: readonly BrowseFooter[] = FOOTERS.map((footer) => ({
    name: footer.name,
    title: footer.title,
    description: footer.description,
    dependencies: footer.dependencies,
    category: footer.meta.category,
    tier: footer.meta.tier,
    status: footer.meta.status,
  }));

  return (
    <>
      <SiteHeader />
      {/* `useSearchParams` opts a subtree out of prerendering, so the shell has
          to be able to render before the query string is known. */}
      <Suspense fallback={<BrowseShell footers={footers} />}>
        <Browse footers={footers} />
      </Suspense>
    </>
  );
}

/** Same layout, no filters applied. Only ever seen for a frame or two. */
function BrowseShell({ footers }: { footers: readonly BrowseFooter[] }) {
  return (
    <div className="grid lg:grid-doc">
      <div aria-hidden className="hidden lg:block lg:border-r lg:border-border" />
      <div className="px-6 py-10 sm:px-10">
        <div className="max-w-3xl">
          <h1 className="font-display text-3xl tracking-tight">Footers</h1>
          <p className="mt-3 font-mono text-xs text-muted-foreground tabular-nums">
            {footers.length} blocks
          </p>
        </div>
      </div>
    </div>
  );
}
