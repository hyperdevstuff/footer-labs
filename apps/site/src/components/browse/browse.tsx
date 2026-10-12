"use client";

import { useCallback, useMemo } from "react";
import { CATEGORIES } from "@footer-labs/registry";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { cn } from "@/lib/utils";

/**
 * Browse index.
 *
 * Filters live in the URL, not in React state. A filtered view is a real
 * address, so it can be shared, bookmarked, and reached by the back button —
 * and with `Link` instead of a click handler the whole sidebar works before
 * hydration, on a page that a crawler and a screen reader both have to follow.
 *
 * Sidebar, then content, then whitespace on the right: the same shape as the
 * showcase, so moving between the two does not rearrange the room.
 */

const FACETS = {
  category: CATEGORIES,
  tier: ["css", "motion", "webgl"],
  status: ["stable", "experimental"],
} as const;

type FacetKey = keyof typeof FACETS;
type Filters = Record<FacetKey, string | null>;

export type BrowseFooter = {
  readonly name: string;
  readonly title: string;
  readonly description: string;
  readonly dependencies: readonly string[];
  readonly category: string;
  readonly tier: string;
  readonly status: string;
};

function hrefWith(pathname: string, current: URLSearchParams, next: Filters) {
  const params = new URLSearchParams(current);
  for (const [key, value] of Object.entries(next)) {
    if (value) params.set(key, value);
    else params.delete(key);
  }
  const query = params.toString();
  return query ? `${pathname}?${query}` : pathname;
}

export function Browse({ footers }: { footers: readonly BrowseFooter[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const filters: Filters = useMemo(
    () => ({
      category: params.get("category"),
      tier: params.get("tier"),
      status: params.get("status"),
    }),
    [params],
  );

  const apply = useCallback(
    (next: Filters) => {
      router.replace(hrefWith(pathname, new URLSearchParams(params.toString()), next), {
        scroll: false,
      });
    },
    [pathname, params, router],
  );

  const visible = useMemo(
    () =>
      footers.filter(
        (footer) =>
          (!filters.category || footer.category === filters.category) &&
          (!filters.tier || footer.tier === filters.tier) &&
          (!filters.status || footer.status === filters.status),
      ),
    [footers, filters],
  );

  const nav = useMemo(
    () => ({
      href: (next: Filters) => hrefWith(pathname, new URLSearchParams(params.toString()), next),
      apply,
    }),
    [pathname, params, apply],
  );

  /*
   * A count next to a filter answers "what happens if I click this?", so it has
   * to be computed with that facet overridden and the others left alone. One
   * function does it; anything cleverer will eventually disagree with the list.
   */
  const countWith = useCallback(
    (override: Filters) =>
      footers.filter(
        (footer) =>
          (!override.category || footer.category === override.category) &&
          (!override.tier || footer.tier === override.tier) &&
          (!override.status || footer.status === override.status),
      ).length,
    [footers],
  );

  const isFiltered = Object.values(filters).some(Boolean);

  return (
    <div className="grid lg:grid-doc">
      <div className="lg:border-r lg:border-border">
        {/* Small screens get the same sidebar, collapsed. A filter hidden behind
            a hamburger is a filter most people never use. */}
        <details className="group border-b border-border lg:hidden">
          <summary className="flex h-12 cursor-pointer items-center gap-2 px-6 text-sm font-medium [&::-webkit-details-marker]:hidden">
            <span aria-hidden className="text-xs">
              ▾
            </span>
            Filters
            {isFiltered ? <span className="text-muted-foreground">· active</span> : null}
          </summary>
          <div className="px-6 pb-6">
            <FacetGroups filters={filters} nav={nav} countWith={countWith} />
          </div>
        </details>

        <aside className="hidden lg:block">
          <div className="sticky top-0 flex h-dvh flex-col overflow-y-auto px-5 py-6">
            <FacetGroups filters={filters} nav={nav} countWith={countWith} />
          </div>
        </aside>
      </div>

      <div className="px-6 py-10 sm:px-10">
        <div className="max-w-3xl">
          <h1 className="font-display text-3xl tracking-tight">Footers</h1>
          <p className="mt-3 text-pretty text-muted-foreground">
            Every footer is one file with no required dependencies. Pick by what it looks like, or
            by what it will cost you to install.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3 text-sm">
            <span className="font-mono text-xs text-muted-foreground tabular-nums">
              {visible.length} of {footers.length}
            </span>
            {isFiltered ? (
              <Link
                href={pathname}
                scroll={false}
                className="text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
              >
                Clear filters
              </Link>
            ) : null}
          </div>

          {visible.length > 0 ? (
            <ul className="mt-4 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2">
              {visible.map((footer) => (
                <li key={footer.name}>
                  <Link
                    href={`/footers/${footer.name}`}
                    className="group flex h-full flex-col gap-8 bg-background p-6 transition-colors duration-150 hover:bg-secondary/40 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset focus-visible:outline-none"
                  >
                    <span className="flex items-center gap-2">
                      <TierDot tier={footer.tier} />
                      <span className="font-mono text-xs text-muted-foreground">
                        {footer.category}
                      </span>
                    </span>

                    <span className="block">
                      <span className="font-display text-lg tracking-tight">{footer.title}</span>
                      <span className="mt-2 block text-pretty text-sm text-muted-foreground">
                        {footer.description}
                      </span>
                    </span>

                    <span className="mt-auto block font-mono text-xs text-muted-foreground">
                      {footer.dependencies.length === 0
                        ? "no dependencies"
                        : footer.dependencies.join(", ")}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-4 rounded-xl border border-border p-10">
              <p className="text-sm font-medium">Nothing matches those filters.</p>
              <p className="mt-2 max-w-sm text-pretty text-sm text-muted-foreground">
                The library is small on purpose. Widen the filters, or clear them and start again.
              </p>
              <Link
                href={pathname}
                scroll={false}
                className="mt-6 inline-flex h-9 items-center rounded-md border border-border px-4 text-sm transition-colors duration-150 hover:bg-secondary"
              >
                Clear filters
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FacetGroups({
  filters,
  nav,
  countWith,
}: {
  filters: Filters;
  nav: { href: (next: Filters) => string; apply: (next: Filters) => void };
  countWith: (override: Filters) => number;
}) {
  return (
    <div className="flex flex-col gap-8">
      <Facet label="Category">
        <FacetRow
          next={{ ...filters, category: null }}
          label="All"
          count={countWith({ ...filters, category: null })}
          {...nav}
          active={!filters.category}
        />
        {FACETS.category.map((category) => (
          <FacetRow
            key={category}
            next={{ ...filters, category }}
            label={category}
            count={countWith({ ...filters, category })}
            {...nav}
            active={filters.category === category}
          />
        ))}
      </Facet>

      <Facet label="Tier">
        <FacetRow
          next={{ ...filters, tier: null }}
          label="Any"
          count={countWith({ ...filters, tier: null })}
          {...nav}
          active={!filters.tier}
        />
        {FACETS.tier.map((tier) => (
          <FacetRow
            key={tier}
            next={{ ...filters, tier }}
            label={tier}
            count={countWith({ ...filters, tier })}
            {...nav}
            active={filters.tier === tier}
          />
        ))}
      </Facet>

      <Facet label="Status">
        <FacetRow
          next={{ ...filters, status: null }}
          label="Any"
          count={countWith({ ...filters, status: null })}
          {...nav}
          active={!filters.status}
        />
        {FACETS.status.map((status) => (
          <FacetRow
            key={status}
            next={{ ...filters, status }}
            label={status}
            count={countWith({ ...filters, status })}
            {...nav}
            active={filters.status === status}
          />
        ))}
      </Facet>
    </div>
  );
}

function Facet({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <nav aria-label={label}>
      <p className="font-mono text-xs tracking-widest text-muted-foreground uppercase">{label}</p>
      <ul className="mt-3 flex flex-col gap-0.5">{children}</ul>
    </nav>
  );
}

/**
 * One row, two behaviours.
 *
 * The `href` is what makes this work without JavaScript and what makes the
 * filtered view a real address. The `onClick` only exists to keep the update
 * from being a full navigation — same target, same history, no scroll jump.
 */
function FacetRow({
  label,
  next,
  active,
  count,
  href,
  apply,
}: {
  label: string;
  next: Filters;
  active: boolean;
  count: number;
  href: (next: Filters) => string;
  apply: (next: Filters) => void;
}) {
  return (
    <li>
      <Link
        href={href(next)}
        scroll={false}
        aria-current={active ? "true" : undefined}
        onClick={(event) => {
          event.preventDefault();
          apply(next);
        }}
        className={cn(
          "flex items-center gap-2 rounded-md px-2 py-1.5 font-mono text-xs transition-colors duration-150",
          active
            ? "bg-secondary font-medium text-foreground"
            : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground",
        )}
      >
        <span className="min-w-0 truncate">{label}</span>
        <span
          className={cn("ml-auto shrink-0 tabular-nums", count === 0 && "opacity-40")}
          // A zero is a fact, not a reason to disable the row — it still works,
          // it just lands on the empty state, which explains itself.
        >
          {count}
        </span>
      </Link>
    </li>
  );
}

/**
 * Tier as a filled dot rather than a word.
 *
 * Three tiers, always in the same order, always the same shape — so a row of
 * thirty cards reads as a value scale from across the page instead of thirty
 * identical badges competing for attention.
 */
function TierDot({ tier }: { tier: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "size-2 shrink-0 rounded-full",
        tier === "css"
          ? "bg-foreground"
          : tier === "motion"
            ? "bg-foreground/50"
            : "bg-foreground/25",
      )}
    />
  );
}
