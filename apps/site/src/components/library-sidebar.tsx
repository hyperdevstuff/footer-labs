"use client";

import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";

/**
 * Library sidebar.
 *
 * Navigation and nothing else. Categories are collapsible groups and footers
 * are direct links inside them, so every footer is one click from anywhere on
 * the page — the old facet sidebar made filtering the primary verb and put the
 * footer two clicks and a card away.
 *
 * Search does NOT live here. It filters the whole library, so it sits in the
 * navbar with a global ⌘K, and arrives here as a prop.
 *
 * Three decisions worth stating because they are not obvious:
 *
 *   - Closed groups are `hidden`, not height-0. A collapsed group must leave
 *     the tab order, or a keyboard user tabs into links they cannot see.
 *   - Search filters across groups rather than reordering them. A category that
 *     matches stays where it is; only its non-matching footers disappear. The
 *     structure does not move under the pointer.
 *   - The active footer is marked with `aria-current="page"`. A background
 *     colour alone tells a screen reader nothing.
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
function TierDot({ tier }: { tier: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "size-1.5 shrink-0 rounded-full",
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
}: {
  categories: readonly SidebarCategory[];
  footers: readonly SidebarFooter[];
  active?: string;
  query: string;
}) {
  // Populated groups open by default. `undefined` means "not yet touched",
  // which is what lets a category added later arrive open rather than closed.
  const [touched, setTouched] = useState<Record<string, boolean>>({});

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
          to a glyph — a hairline square with the accent rule across its foot. */}
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
                <BlockLink key={footer.name} footer={footer} active={footer.name === active} />
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
          <li className="py-1 pr-2 pl-8 text-xs text-muted-foreground/50">nothing here yet</li>
        ) : (
          children
        )}
      </ul>
    </div>
  );
}

function BlockLink({ footer, active }: { footer: SidebarFooter; active: boolean }) {
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
