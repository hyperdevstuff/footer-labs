"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import Link from "next/link";

import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

/**
 * Library sidebar.
 *
 * The chrome for the browse index AND the showcase, unchanged between them.
 * It used to be two things: a wordmark here and a navbar there, at three
 * different column widths, so moving between the two pages rearranged the
 * room. There is one sidebar and both pages mount it.
 *
 * Navigation and nothing else. Categories are collapsible groups and footers are
 * direct links inside them, so every footer is one click from anywhere on the
 * page — the old facet sidebar made filtering the primary verb and put the
 * footer two clicks and a card away.
 *
 * Search lives here now rather than in a bar above. It filters the whole
 * library, but so does everything else in this column, and the bar it needed was
 * a whole row of viewport spent on one input. ⌘K still works from anywhere on
 * the page — the listener is global either way, so moving the field into a
 * panel cost the shortcut nothing.
 *
 * Four decisions worth stating because they are not obvious:
 *
 *   - Closed groups are `hidden`, not height-0. A collapsed group must leave
 *     the tab order, or a keyboard user tabs into links they cannot see.
 *   - Search filters across groups rather than reordering them. A category that
 *     matches stays where it is; only its non-matching footers disappear. The
 *     structure does not move under the pointer.
 *   - The active footer is marked with `aria-current="page"`. A background
 *     colour alone tells a screen reader nothing.
 *   - An empty category says "coming soon", not "nothing here yet". Both are
 *     true; only one of them reads as a plan rather than a gap. The structure
 *     is the roadmap, and a roadmap is not an apology.
 */

export type SidebarFooter = {
  readonly name: string;
  readonly title: string;
  readonly description: string;
  readonly category: string;
  readonly tier: string;
  readonly experimental: boolean;
};

export type SidebarCategory = {
  readonly id: string;
  readonly label: string;
};

function matches(footer: SidebarFooter, query: string) {
  if (!query) return true;
  const q = query.toLowerCase();
  return (
    footer.title.toLowerCase().includes(q) ||
    footer.name.includes(q) ||
    footer.category.includes(q) ||
    footer.tier.includes(q)
  );
}

/** Tier as a filled dot — three tiers, always the same shape, so a column of
 *  them reads as a value scale rather than thirty competing badges. */
export function TierDot({ tier, className }: { tier: string; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "shrink-0 rounded-full",
        className ?? "size-1.5",
        tier === "css"
          ? "bg-foreground"
          : tier === "motion"
            ? "bg-foreground/50"
            : "bg-foreground/25",
      )}
    />
  );
}

export function LibrarySidebar({
  categories,
  footers,
  active,
  query,
  onQueryChange,
}: {
  categories: readonly SidebarCategory[];
  footers: readonly SidebarFooter[];
  /** Set on the showcase page. Undefined on the browse index. */
  active?: string;
  query: string;
  onQueryChange: (value: string) => void;
}) {
  // Populated groups open by default. `undefined` means "not yet touched",
  // which is what lets a category added later arrive open rather than closed.
  const [touched, setTouched] = useState<Record<string, boolean>>({});
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

  const grouped = useMemo(
    () =>
      categories
        .map((category) => ({
          ...category,
          items: footers.filter((f) => f.category === category.id && matches(f, query)),
          total: footers.filter((f) => f.category === category.id).length,
        }))
        .filter((group) => !query || group.items.length > 0),
    [categories, footers, query],
  );

  const total = grouped.reduce((sum, group) => sum + group.items.length, 0);

  return (
    <div className="flex h-full flex-col">
      {/* The wordmark. The mark is the footer's own top-edge ornament reduced
          to a glyph — a hairline square with the accent rule across its foot.
          One definition of the shape lives in globals.css as `fl-mark`. */}
      <div className="shrink-0 pb-4">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          <span
            aria-hidden
            className="fl-mark h-6 w-6 shrink-0 rounded-md border border-border bg-foreground"
          />
          <span className="font-display text-base leading-none font-medium tracking-tight">
            footer-labs
          </span>
        </Link>
      </div>

      <div className="shrink-0 border-t border-border" />

      {/* Search, directly under the rule it shares a page with. The shortcut
          focuses the field rather than opening a palette: with a library this
          size a palette is ceremony, and a focused input with the list already
          filtered underneath it is the same job in one control. */}
      <div className="relative mt-3 shrink-0">
        <Search
          aria-hidden
          className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground"
        />
        <input
          ref={input}
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Search"
          aria-label="Search footers"
          aria-describedby="fl-search-count"
          className="h-8 w-full rounded-md border border-border bg-transparent pr-11 pl-8 text-sm placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        />
        <kbd className="pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 rounded border border-border px-1 py-0.5 font-mono text-xs leading-none text-muted-foreground">
          ⌘K
        </kbd>
      </div>

      <nav aria-label="Footers" className="mt-3 flex-1 overflow-y-auto pr-1">
        {grouped.length === 0 ? (
          <p className="px-2 py-6 text-xs text-muted-foreground">
            Nothing matches <span className="font-mono text-foreground">{query}</span>.
          </p>
        ) : (
          grouped.map((group) => (
            <CategoryGroup
              key={group.id}
              id={group.id}
              label={group.label}
              count={group.total}
              /* While searching, every surviving group is forced open — a hit
                 you cannot see is a hit that does not exist. */
              open={query ? true : (touched[group.id] ?? group.total > 0)}
              onToggle={() =>
                setTouched((s) => ({ ...s, [group.id]: !(s[group.id] ?? group.total > 0) }))
              }
            >
              {group.items.map((footer) => (
                <FooterLink key={footer.name} footer={footer} active={footer.name === active} />
              ))}
            </CategoryGroup>
          ))
        )}
      </nav>

      <div className="shrink-0 border-t border-border pt-3">
        <p className="px-2 font-mono text-xs text-muted-foreground tabular-nums">
          {total} {total === 1 ? "footer" : "footers"}
          {query ? " matching" : ""}
        </p>

        {/* Credits lives in the footer of the site, not in its navbar. This is
            where the library keeps a route to it, so removing the link from the
            chrome above did not strand the page. */}
        <Link
          href="/credits"
          className="mt-2 block rounded-md px-2 py-1 text-sm text-muted-foreground transition-colors duration-150 hover:bg-secondary/50 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          Credits
        </Link>
      </div>
    </div>
  );
}

/**
 * The sidebar column.
 *
 * The `<aside>` and its full-height sticky inner, shared by the browse index
 * and the showcase. It was written out separately on each page and the two
 * drifted: the showcase had `sticky top-0 h-dvh` with its own `px-5 py-6` and
 * no divider, while the browse index wrapped the sidebar in a bare `<div>`
 * inside the page's `max-w-400 px-6 sm:px-8` grid. Same component, four
 * visible differences — the column sat at a different x-offset, started at a
 * different height, and scrolled away with the page on one route and not the
 * other.
 *
 * This is the showcase's version, because it is the correct one: a sidebar that
 * pins and keeps its own scroll stays put while a long footer list is read,
 * and owning its padding means it does not inherit whatever measure the page
 * around it happens to use.
 *
 * The divider is on the `<aside>` as a negative-margin rule rather than as
 * padding on the column beside it, so it draws at the viewport edge instead of
 * 1.5rem inside the content column.
 */
export function SidebarColumn({ children }: { children: React.ReactNode }) {
  return (
    <aside className="relative hidden lg:block">
      {/* Pinned, full height, scrolls independently. `h-dvh` rather than
          `h-screen` — 100vh jumps on mobile, and this is sticky chrome the
          reader will have on screen while the browser chrome hides. */}
      <div className="sticky top-0 flex h-dvh flex-col overflow-y-auto px-5 py-6">{children}</div>

      {/* The one hairline between the column and the content. */}
      <div aria-hidden className="absolute inset-y-0 -right-px w-px bg-border" />
    </aside>
  );
}

/**
 * The mobile top bar.
 *
 * The sidebar is `hidden lg:block`, so below `lg` this is the only chrome on
 * either page. Without it, a phone visitor on the showcase has no way home and
 * no way to change theme — the sidebar carries the wordmark link and the toggle,
 * and neither of those exists at that width. It is two controls, not a navbar:
 * search stays in the sidebar and is simply unreachable below `lg`, which is
 * the same trade the sidebar already makes for navigation.
 */
export function MobileBar() {
  return (
    <div className="flex items-center gap-3 border-b border-border px-6 py-3 lg:hidden">
      <Link
        href="/"
        className="flex items-center gap-2.5 rounded-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      >
        <span aria-hidden className="fl-mark h-5 w-5 shrink-0 rounded-xs bg-foreground" />
        <span className="font-display text-base leading-none font-medium tracking-tight">
          footer-labs
        </span>
      </Link>
      <div className="ml-auto">
        <ThemeToggle />
      </div>
    </div>
  );
}

function CategoryGroup({
  id,
  label,
  count,
  open,
  onToggle,
  children,
}: {
  id: string;
  label: string;
  count: number;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  const panelId = `fl-group-${id}`;
  return (
    <div className="mb-0.5">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={panelId}
        className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left transition-colors duration-150 hover:bg-secondary/50"
      >
        <ChevronDown
          aria-hidden
          className={cn(
            "size-3.5 shrink-0 text-muted-foreground transition-transform duration-150 ease-out",
            open ? "" : "-rotate-90",
          )}
        />
        <span className="min-w-0 flex-1 truncate text-sm font-medium">{label}</span>
        <span
          className={cn(
            "shrink-0 font-mono text-xs tabular-nums",
            count === 0 ? "text-muted-foreground/40" : "text-muted-foreground",
          )}
        >
          {count}
        </span>
      </button>

      <ul id={panelId} hidden={!open} className="mt-0.5 flex flex-col gap-0.5">
        {count === 0 ? (
          <li className="py-1 pr-2 pl-8 text-xs text-muted-foreground/50">coming soon</li>
        ) : (
          children
        )}
      </ul>
    </div>
  );
}

function FooterLink({ footer, active }: { footer: SidebarFooter; active: boolean }) {
  return (
    <li>
      <Link
        href={`/footers/${footer.name}`}
        aria-current={active ? "page" : undefined}
        className={cn(
          "flex items-center gap-2 rounded-md py-1.5 pr-2 pl-8 text-sm transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
          active
            ? "bg-secondary font-medium text-foreground"
            : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground",
        )}
      >
        <TierDot tier={footer.tier} />
        <span className="min-w-0 flex-1 truncate">{footer.title}</span>
        {footer.experimental ? (
          <span
            aria-label="experimental"
            className="size-1.5 shrink-0 rounded-full bg-muted-foreground"
          />
        ) : null}
      </Link>
    </li>
  );
}
