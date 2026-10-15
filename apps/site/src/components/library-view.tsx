"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import { LibraryNavbar } from "@/components/library-navbar";
import {
  LibrarySidebar,
  type SidebarCategory,
  type SidebarFooter,
} from "@/components/library-sidebar";

export type { SidebarCategory, SidebarFooter } from "@/components/library-sidebar";

/**
 * Library view.
 *
 * Owns the search query and hands it to both the navbar and the sidebar, which
 * is what lets search live in the navbar while still filtering the categories.
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
      <LibraryNavbar query={query} onQueryChange={setQuery} resultCount={visible.length} />

      <div className="mx-auto grid w-full max-w-400 gap-px px-6 py-8 sm:px-8 lg:grid-library lg:gap-8 lg:py-10">
        <div className="lg:border-r lg:border-border lg:pr-6">
          {/* No wordmark here: this page's navbar already carries one. */}
          <LibrarySidebar
            categories={categories}
            footers={footers}
            query={query}
            showWordmark={false}
          />
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h1 className="font-display text-3xl tracking-tight">Footers</h1>
            <p className="font-mono text-xs text-muted-foreground tabular-nums">
              {visible.length} of {footers.length}
            </p>
          </div>

          {visible.length > 0 ? (
            <ul className="mt-6 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2">
              {visible.map((footer) => (
                <li key={footer.name}>
                  <Link
                    href={`/footers/${footer.name}`}
                    className="group flex h-full flex-col gap-6 bg-background p-6 transition-colors duration-150 hover:bg-secondary/40 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset focus-visible:outline-none"
                  >
                    <span className="flex items-center gap-2">
                      <span
                        aria-hidden
                        className={
                          footer.tier === "css"
                            ? "size-2 shrink-0 rounded-full bg-foreground"
                            : footer.tier === "motion"
                              ? "size-2 shrink-0 rounded-full bg-foreground/50"
                              : "size-2 shrink-0 rounded-full bg-foreground/25"
                        }
                      />
                      <span className="font-mono text-xs text-muted-foreground">
                        {footer.category}
                      </span>
                      {footer.experimental ? (
                        <span className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
                          experimental
                        </span>
                      ) : null}
                    </span>

                    <span className="block">
                      <span className="block font-display text-lg tracking-tight">
                        {footer.title}
                      </span>
                      <span className="mt-2 block text-pretty text-sm text-muted-foreground">
                        {footer.description}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-6 rounded-xl border border-border p-10">
              <p className="text-sm font-medium">Nothing matches that search.</p>
              <p className="mt-2 max-w-sm text-pretty text-sm text-muted-foreground">
                The library is small on purpose. Try a category, a tier, or part of a footer&rsquo;s
                name.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
