import Link from "next/link";

import { ThemeToggle } from "@/components/theme-toggle";

const NAV = [{ href: "/blocks", label: "Blocks" }] as const;

/**
 * The landing page's header.
 *
 * Deliberately the same bar as the one on `/blocks`: mark, wordmark, two
 * links, theme toggle. It looked like two different sites when the landing
 * page had its own animated variant, and "same navbar everywhere" is worth
 * more than a navbar that performs.
 *
 * It renders here and nowhere else — every other route has a sidebar that
 * already lists every footer, or a back link to the front door. And it is not
 * sticky: the landing page's centrepiece is a shelf that is already pinned to
 * the top of the viewport, and a second pinned strip above it would split the
 * screen and make the shelf's scroll hijack feel like a bug.
 *
 * `max-w-400`, the measure of every section on the page. This used to be
 * `max-w-6xl` — 28rem narrower, not enough to look broken and just enough
 * that the wordmark never lined up with the hero text under it.
 *
 * One link, not two. Credits is a footer link: it is where attribution lives
 * on this site, and putting it in the chrome beside the primary destination
 * gave it the same weight as the thing people came for.
 */
export function SiteHeader() {
  return (
    <header className="border-b border-border">
      <div className="mx-auto flex h-14 w-full max-w-400 items-center gap-4 px-6 sm:px-8">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2.5 rounded-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          {/* Same glyph the sidebar and the browse navbar use. One definition
              of the shape lives in globals.css as `fl-mark`; this is just its
              markup. */}
          <span aria-hidden className="fl-mark h-5 w-5 shrink-0 rounded-xs bg-foreground" />
          <span className="font-display text-base leading-none font-medium tracking-tight">
            footer-labs
          </span>
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
