"use client";

import { useEffect, useRef } from "react";
import { Search } from "lucide-react";
import Link from "next/link";

/**
 * Library navbar.
 *
 * Logo left, navigation centre, search right. Search lives here rather than in
 * the sidebar because it filters the whole library, not the sidebar's column —
 * and because ⌘K needs a global shortcut, which a control scoped to a panel
 * cannot honestly own.
 *
 * This is the browse page's only bar, and it stays sticky because on a long
 * list the search field is the control you want to reach without scrolling back
 * to the top. It is not the site's header: no tagline claim, no marketing nav,
 * and no reduce-motion switch — see `site-header.tsx`.
 *
 * The shortcut focuses the field rather than opening a palette. With a library
 * this size a palette is ceremony; a focused input with the list already
 * filtered underneath it is the same job in one control. The badge is a hint,
 * not a claim — the handler accepts Ctrl on Windows and ⌘ on Mac.
 */
export function LibraryNavbar({
  query,
  onQueryChange,
  resultCount,
}: {
  query: string;
  onQueryChange: (v: string) => void;
  resultCount: number;
}) {
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        input.current?.focus();
        input.current?.select();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-400 items-center gap-4 px-6 sm:px-8">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2.5 rounded-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          <Mark />
          <span className="font-display text-base leading-none font-medium tracking-tight">
            footer-labs
          </span>
        </Link>

        <span className="hidden text-sm text-muted-foreground lg:inline">
          tasteful footers, because we care about the end
        </span>

        <nav aria-label="Main" className="ml-auto flex items-center gap-1">
          <Link
            href="/blocks"
            aria-current="page"
            className="rounded-md px-2.5 py-1.5 text-sm text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            Blocks
          </Link>
          <Link
            href="/credits"
            className="rounded-md px-2.5 py-1.5 text-sm text-muted-foreground transition-colors duration-150 hover:bg-secondary/60 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            Credits
          </Link>
        </nav>

        {/* Search, right. The only control that filters the whole library. */}
        <div className="relative w-full max-w-xs">
          <Search
            aria-hidden
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
          />
          <input
            ref={input}
            type="search"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Search footers"
            aria-label="Search footers"
            aria-describedby="fl-search-count"
            className="h-9 w-full rounded-md border border-border bg-transparent pr-16 pl-9 text-sm placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          />
          <kbd className="pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 rounded border border-border px-1.5 py-0.5 font-mono text-xs text-muted-foreground">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* The result count lives with the control that changes it. */}
      <p id="fl-search-count" aria-live="polite" className="sr-only">
        {resultCount} {resultCount === 1 ? "footer" : "footers"}
        {query ? " matching" : ""}
      </p>
    </header>
  );
}

function Mark() {
  return (
    <span
      aria-hidden
      className="fl-mark h-5 w-5 shrink-0 rounded-xs border border-border bg-foreground"
    />
  );
}
