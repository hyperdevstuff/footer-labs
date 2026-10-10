import Link from "next/link";

import { MotionToggle } from "@/components/motion-toggle";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur">
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
        <div className="ml-auto">
          <MotionToggle />
        </div>
      </div>
    </header>
  );
}
