import Link from "next/link";

const NAV = [
  { href: "/blocks", label: "Blocks" },
  { href: "/credits", label: "Credits" },
] as const;

/**
 * The site's own navigation, and the only header that carries the tagline.
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
 */
export function SiteHeader() {
  return (
    <header className="border-b border-border">
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
        </nav>
      </div>
    </header>
  );
}
