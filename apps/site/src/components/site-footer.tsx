import Link from "next/link";

/**
 * The gallery's own footer.
 *
 * Deliberately bespoke and deliberately NOT in the registry. If it were a
 * library footer it would no longer be honestly copyable, and the most-viewed
 * footer on the site would look like self-promotion.
 *
 * That distinction is the whole reason this file exists instead of
 * `<QuietMinimal />`.
 */
export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-12 sm:px-8 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-medium tracking-tight">footer-labs</p>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            A curated library of landing page footers. One self-contained file each — copy it and it
            works.
          </p>
        </div>

        <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
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
          <span
            className="text-muted-foreground/70"
            title="This footer is not in the library. Deliberately."
          >
            MIT
          </span>
        </nav>
      </div>
    </footer>
  );
}
