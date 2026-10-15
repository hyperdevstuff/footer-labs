import Link from "next/link";

import { ThemeToggle } from "@/components/theme-toggle";

const NAV = [
  { href: "/blocks", label: "Blocks" },
  { href: "/credits", label: "Credits" },
] as const;

/**
 * The site's own navigation, and the only header that carries the wordmark in
 * a bar.
 *
 * It renders on the landing page and nowhere else. Every other route either has
 * a sidebar that already lists every footer (`/footers/[name]`), a navbar that
 * already owns the search field (`/blocks`), or a back link to the front door
 * (`/credits`, `/preview/[name]`) — so a second bar pinned to the top of those
 * pages was pure chrome, competing for the vertical space the actual content
 * needed.
 *
 * Not sticky, for the same reason. The landing page's centrepiece is a pinned
 * horizontal shelf; a second pinned strip above it would have split the
 * viewport and made the shelf's own scroll hijack feel like a bug.
 *
 * No tagline. "Tasteful footers, because we care about the end" was a
 * masthead line sitting between the wordmark and the nav, and it read as a
 * second heading competing with the hero one screen below. It has not gone
 * away — it is the document title, the meta description, and the argument the
 * hero already makes in full sentences.
 *
 * `max-w-400`, the same measure as every section on the page. The bar was
 * `max-w-6xl`, which is 28rem narrower — not enough to look broken, just
 * enough that the wordmark never lined up with the hero text under it, and the
 * eye reads that as "off centre" before it can say why.
 */
export function SiteHeader() {
  return (
    <header className="border-b border-border">
      <div className="mx-auto flex h-14 w-full max-w-400 items-center gap-4 px-6 sm:px-8">
        <Link
          href="/"
          className="font-display text-sm font-medium tracking-tight focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          footer-labs
        </Link>

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
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
