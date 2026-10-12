import Link from "next/link";

import { FOOTERS } from "@footer-labs/registry";
import { cn } from "@/lib/utils";

/**
 * Library sidebar.
 *
 * Most component galleries are a sidebar, a showcase, and whitespace. It is the
 * shape that lets thirty loud components sit next to quiet chrome.
 *
 * A flat list, deliberately. It becomes a grouped, scrollable list when there
 * is more than one screenful of footers — a change to make when the library
 * earns it, not one to pre-build for.
 */
export function BlockSidebar({ active }: { active: string }) {
  return (
    <aside className="hidden border-r border-border lg:block">
      <div className="sticky top-0 flex h-dvh flex-col px-5 py-6">
        <p className="font-mono text-xs tracking-widest text-muted-foreground uppercase">Blocks</p>

        <nav aria-label="Blocks" className="mt-4 flex-1 overflow-y-auto">
          <ul className="flex flex-col gap-0.5">
            {FOOTERS.map((footer) => {
              const isActive = footer.name === active;
              return (
                <li key={footer.name}>
                  <Link
                    href={`/footers/${footer.name}`}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors duration-150",
                      isActive
                        ? "bg-secondary font-medium text-foreground"
                        : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground",
                    )}
                  >
                    <span className="min-w-0 truncate">{footer.title}</span>
                    {footer.meta.status === "experimental" ? (
                      <span
                        aria-label="experimental"
                        className="ml-auto size-1.5 shrink-0 rounded-full bg-muted-foreground"
                      />
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-border pt-4 text-xs">
          <Link
            href="/blocks"
            className="block text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            ← All blocks
          </Link>
          <Link
            href="/"
            className="mt-2 block text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            About
          </Link>
        </div>
      </div>
    </aside>
  );
}
