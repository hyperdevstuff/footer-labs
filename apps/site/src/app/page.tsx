import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { FooterThumb } from "@/components/footer-thumb";
import { HorizontalShelf, ShelfCard } from "@/components/shelf";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { footers } from "@footer-labs/registry/catalog";
import { CATEGORIES } from "@footer-labs/registry/schema";

/**
 * Landing page.
 *
 * Three things, in this order: the argument, the product, the taxonomy. An
 * install section used to sit at the bottom and an admission about this page's
 * own footer sat under it — neither earned its place. The install command lives
 * on every block's page, where someone is already looking at a footer they want;
 * here it answered a question nobody had asked yet.
 *
 * The scroll is horizontal because a footer is a wide object. The shelf is
 * pinned while its section is in view and the reader's vertical scroll is spent
 * moving it sideways; when the last column has passed, scrolling continues into
 * the categories below. A grid could only ever show a wide footer cropped.
 */

const CATEGORY_LABELS: Record<string, string> = {
  minimal: "Minimal",
  editorial: "Editorial",
  kinetic: "Kinetic",
  generative: "Generative",
  photographic: "Photographic",
  terminal: "Terminal",
  data: "Data",
  isometric: "Isometric",
};

const CATEGORY_BLURBS: Record<string, string> = {
  minimal: "Hairlines, proportion, and nothing else. The taste bar.",
  editorial: "Type doing the work. Rules, columns, a considered measure.",
  kinetic: "Motion on scroll and on hover. Springs, not keyframes.",
  generative: "Drawn at runtime. A field, a grid, a rule that computes itself.",
  photographic: "Imagery as structure. Masks, duotone, a fixed aspect.",
  terminal: "Monospace as voice. A prompt, a cursor, a blinking caret.",
  data: "Status, uptime, a live number. Operational, not decorative.",
  isometric: "Line figures that answer the pointer. Drawn in SVG.",
};

export default function Home() {
  return (
    <>
      <SiteHeader />

      <main>
        <Hero />

        <Shelf />

        <Categories />
      </main>

      <SiteFooter />
    </>
  );
}

function Hero() {
  return (
    <section className="mx-auto w-full max-w-400 px-6 pt-20 pb-16 sm:px-8 lg:pt-28 lg:pb-24">
      <p className="enter enter-1 font-mono text-xs tracking-widest text-muted-foreground uppercase">
        Curated · copy-paste · yours to own
      </p>

      <h1 className="enter enter-2 mt-6 max-w-4xl text-balance font-display text-5xl leading-display tracking-tight sm:text-7xl">
        The bottom of your page, already sorted.
      </h1>

      <p className="enter enter-3 mt-6 max-w-xl text-pretty text-lg text-muted-foreground">
        Every footer is one file you paste and own. No wrapper, no provider, no configuration, no
        build step — drop it into a fresh Next.js project and it renders, themes and responds
        correctly on the first try.
      </p>

      <div className="enter enter-4 mt-10 flex flex-wrap items-center gap-3">
        <Link
          href="/footers"
          className="group inline-flex h-10 items-center gap-2 rounded-md bg-foreground px-5 text-sm font-medium text-background transition-transform duration-150 ease-out active:scale-press focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none"
        >
          Browse the library
          <ArrowRight
            aria-hidden
            className="size-4 transition-transform duration-150 ease-out group-hover:translate-x-0.5"
          />
        </Link>
        <a
          href="https://github.com/hyperdevstuff/footer-labs"
          className="inline-flex h-10 items-center gap-2 rounded-md border border-border px-5 text-sm transition-colors duration-150 hover:bg-secondary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          GitHub
        </a>
      </div>
    </section>
  );
}

function Shelf() {
  return (
    <section aria-label="Footer previews" className="border-t border-border">
      <HorizontalShelf count={footers.length}>
        {footers.map((footer) => (
          <ShelfCard
            key={footer.name}
            href={`/footers/${footer.name}`}
            label={`${footer.title} — ${footer.meta.category}, ${footer.meta.tier}`}
          >
            <FooterThumb
              alt={`A preview of the ${footer.title} footer`}
              className="h-full w-full rounded-lg"
            >
              <footer.Component />
            </FooterThumb>
          </ShelfCard>
        ))}
      </HorizontalShelf>
    </section>
  );
}

function Categories() {
  const counts = new Map<string, number>();
  for (const footer of footers) {
    counts.set(footer.meta.category, (counts.get(footer.meta.category) ?? 0) + 1);
  }

  return (
    <section aria-label="Categories" className="border-t border-border">
      <div className="mx-auto w-full max-w-400 px-6 py-20 sm:px-8">
        <div className="flex items-baseline justify-between border-b border-border pb-3">
          <h2 className="font-mono text-xs tracking-widest uppercase">Categories</h2>
          <span className="font-mono text-xs text-muted-foreground tabular-nums">
            {CATEGORIES.length} declared
          </span>
        </div>

        <ul>
          {CATEGORIES.map((id, index) => {
            const count = counts.get(id) ?? 0;
            const content = (
              <>
                <span className="font-mono text-xs text-muted-foreground tabular-nums">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="min-w-0">
                  <span className="block font-display text-lg tracking-tight">
                    {CATEGORY_LABELS[id] ?? id}
                  </span>
                  <span className="mt-1 block text-pretty text-sm text-muted-foreground">
                    {CATEGORY_BLURBS[id] ?? ""}
                  </span>
                </span>
                <span
                  className={
                    count === 0
                      ? "text-right font-mono text-sm text-muted-foreground/40 tabular-nums"
                      : "text-right font-mono text-sm tabular-nums"
                  }
                >
                  {count}
                </span>
              </>
            );

            /* An empty category is not a link.

               These rows pointed at `?category=<id>`, and the browse page has not
               read a search param since the facet sidebar was replaced — every
               one of them landed on the same unfiltered index. Seven of the eight
               are still empty, so seven of eight rows were a link that went
               nowhere. The ones with a footer in them link to the library; the
               rest are content, and look like it. */
            return (
              <li key={id} className="border-b border-border">
                {count > 0 ? (
                  <Link
                    href="/footers"
                    className="grid grid-category items-baseline gap-4 py-5 transition-colors duration-150 hover:bg-secondary/40 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                  >
                    {content}
                  </Link>
                ) : (
                  <div className="grid grid-category items-baseline gap-4 py-5">{content}</div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
