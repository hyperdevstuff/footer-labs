import Link from "next/link";

import { MotionToggle } from "@/components/motion-toggle";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/blocks", label: "Blocks" },
  { href: "/credits", label: "Credits" },
] as const;

/**
 * `sticky` is off on showcase pages — pinned chrome competes with the preview
 * for vertical space, and a footer library should not spend its best screen on
 * a navbar.
 */
export function SiteHeader({ sticky = true }: { sticky?: boolean }) {
  return (
    <header
      className={cn(
        "z-20 border-b border-border bg-background/80 backdrop-blur",
        sticky && "sticky top-0",
      )}
    >
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center gap-4 px-6 sm:px-8">
        <Link
          href="/"
          className="font-display text-sm font-medium tracking-tight focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          footer-labs
        </Link>
        <span className="hidden text-sm text-muted-foreground sm:inline">
          tasteful footers, because we care about the end
        </span>

        <nav aria-label="Main" className="ml-auto flex items-center gap-1">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-2.5 py-1.5 text-sm text-muted-foreground transition-colors duration-150 hover:bg-secondary/60 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              {item.label}
            </Link>
          ))}
          <MotionToggle />
        </nav>
      </div>
    </header>
  );
}
