import Link from "next/link";
import { ArrowRight } from "lucide-react";

/**
 * The gallery's own footer.
 *
 * It is deliberately NOT in the registry, which is a constraint worth stating
 * plainly: the moment this file shipped as `@footer-labs/something`, the most
 * viewed footer on the site would have been advertising itself, and the library
 * would be selling its own chrome.
 *
 * So it plays the part and then says so. The headline is the pitch a library
 * footer would make — you already know which footer you want — and the sentence
 * under it is the honest one: this is the site's, not the library's, and the
 * library is one click away. The trap is sprung honestly, which is the only way
 * it is funny.
 */
export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto w-full max-w-400 px-6 pt-20 pb-16 sm:px-8">
        <p className="max-w-3xl text-balance font-display text-4xl leading-display tracking-tight sm:text-5xl">
          We know what you&rsquo;re looking for.
        </p>

        <p className="mt-5 max-w-xl text-pretty text-muted-foreground">
          You want this one — the columns, the hairline, the links that don&rsquo;t shout. It
          isn&rsquo;t in the library, because a library that sells its own footer is just a website
          with a download button. These are.
        </p>

        <Link
          href="/blocks"
          className="group mt-8 inline-flex h-10 items-center gap-2 rounded-md bg-foreground px-5 text-sm font-medium text-background transition-transform duration-150 ease-out active:scale-press focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none"
        >
          Browse the library
          <ArrowRight
            aria-hidden
            className="size-4 transition-transform duration-150 ease-out group-hover:translate-x-0.5"
          />
        </Link>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex w-full max-w-400 flex-col gap-4 px-6 py-8 sm:px-8 md:flex-row md:items-center md:justify-between">
          <p className="font-display text-sm font-medium tracking-tight">footer-labs</p>

          <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <Link
              href="/blocks"
              className="text-muted-foreground underline-offset-4 hover:text-foreground hover:underline focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              Blocks
            </Link>
            <Link
              href="/credits"
              className="text-muted-foreground underline-offset-4 hover:text-foreground hover:underline focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              Credits
            </Link>
            <a
              href="https://github.com/hyperdevstuff/footer-labs"
              className="text-muted-foreground underline-offset-4 hover:text-foreground hover:underline focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              GitHub
            </a>
            <span className="text-muted-foreground/70">MIT</span>
          </nav>
        </div>
      </div>
    </footer>
  );
}
