"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import {
  LibrarySidebar,
  MobileBar,
  SidebarColumn,
  TierDot,
  type SidebarCategory,
  type SidebarFooter,
} from "@/components/library-sidebar";

export type { SidebarCategory, SidebarFooter } from "@/components/library-sidebar";

/**
 * Library view.
 *
 * The browse index: the same sidebar column the showcase uses, and a list of
 * what the library contains. It used to carry a navbar of its own — a second
 * bar across the top with the search field in it — which meant the two library
 * pages presented the same column at different widths, with the wordmark on one
 * and not the other.
 *
 * Owns the search query and hands it down, which is what lets the field live in
 * the sidebar while still filtering the cards beside it.
 *
 * The cards are text, not live previews. A footer component is a function and
 * cannot cross the server/client boundary into this tree, and re-rendering
 * every footer live on the index would put a dozen animated components on the
 * page at once — the showcase is where a preview belongs, one at a time, where
 * it can be restarted, resized and read.
 */
export function LibraryView({
  categories,
  footers,
}: {
  categories: readonly SidebarCategory[];
  footers: readonly SidebarFooter[];
}) {
  const [query, setQuery] = useState("");

  const visible = useMemo(() => {
    if (!query) return footers;
    const q = query.toLowerCase();
    return footers.filter(
      (f) =>
        f.title.toLowerCase().includes(q) ||
        f.name.includes(q) ||
        f.category.includes(q) ||
        f.tier.includes(q),
    );
  }, [footers, query]);

  return (
    <div className="min-h-dvh bg-background">
      <MobileBar />

      <div className="grid lg:grid-doc">
        <SidebarColumn>
          <LibrarySidebar
            categories={categories}
            footers={footers}
            query={query}
            onQueryChange={setQuery}
          />
        </SidebarColumn>

        <div className="min-w-0">
          {/* The content keeps its own measure and padding rather than
              inheriting the page's. Same as the showcase: the column decides
              its gutter, so the two pages are inset identically. */}
          <div className="px-6 py-10 sm:px-10">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <h1 className="font-display text-3xl tracking-tight">Footers</h1>
              <p className="font-mono text-xs text-muted-foreground tabular-nums">
                {visible.length} of {footers.length}
              </p>
            </div>

            {visible.length > 0 ? (
              /* Rows, not cards.

               This was a two-column card grid, and it was wrong twice over.
               The container painted `bg-border` and drew its hairlines from the
               gaps, so a card that was not there left a solid grey slab across
               half the row. Removing that left the actual problem visible: a
               600×120px box holding three lines of text, most of its width
               empty.

               A card needs something to look at. A footer preview is a whole
               route — `/footers/[name]` — and rendering thirty of them here
               would put thirty animated components on one page. So there is no
               image to put in the box, and a box with no image in it is just a
               rectangle.

               Rows are what this page was always supposed to be; the page's own
               note says it must "be read as a list of what the library
               contains". It is the same hairline `border-b` vocabulary as the
               landing page's Categories table, for the same reason: at forty
               footers a list scans and a grid becomes a wall. */
              <ul className="mt-6 border-t border-border">
                {visible.map((footer) => (
                  <li key={footer.name} className="border-b border-border">
                    <Link
                      href={`/footers/${footer.name}`}
                      className="group flex items-baseline gap-x-4 gap-y-1 py-4 transition-colors duration-150 hover:bg-secondary/40 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset focus-visible:outline-none"
                    >
                      {/* The dot is the only thing marking tier here, so it is
                        given its own column and never reflows when a title
                        turns out to be short. */}
                      <TierDot tier={footer.tier} className="relative top-1 size-1.5" />

                      <span className="min-w-0 flex-1 font-display text-lg tracking-tight">
                        {footer.title}
                      </span>

                      {footer.experimental ? (
                        <span className="shrink-0 font-mono text-xs tracking-widest text-muted-foreground uppercase">
                          experimental
                        </span>
                      ) : null}

                      <span className="shrink-0 font-mono text-xs text-muted-foreground tabular-nums">
                        {footer.category}
                      </span>
                    </Link>
                    {/* The description sits outside the link. Putting it inside
                      gave a 600px-wide click target with a 90-character string
                      in it, and it is the one piece of text here long enough to
                      need a measure of its own. */}
                    <p className="max-w-prose py-4 pl-5.5 text-pretty text-sm text-muted-foreground">
                      {footer.description}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="mt-6 rounded-xl border border-border p-10">
                <p className="text-sm font-medium">Nothing matches that search.</p>
                <p className="mt-2 max-w-sm text-pretty text-sm text-muted-foreground">
                  The library is small on purpose. Try a category, a tier, or part of a
                  footer&rsquo;s name.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
