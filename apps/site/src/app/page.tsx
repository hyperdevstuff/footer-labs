import Link from "next/link";

import { FOOTERS } from "@footer-labs/registry";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { TierBadge, ExperimentalBadge } from "@/components/badges";
import { PreviewFrame } from "@/components/preview-frame";

export default function Home() {
  const stable = FOOTERS.filter((footer) => footer.meta.status === "stable");
  const experimental = FOOTERS.filter((footer) => footer.meta.status === "experimental");

  return (
    <>
      <SiteHeader />

      <main className="mx-auto w-full max-w-6xl px-6 sm:px-8">
        <section className="py-20 sm:py-28">
          <h1 className="max-w-3xl text-balance text-4xl leading-display tracking-tight sm:text-6xl">
            Footers, treated like they matter.
          </h1>
          <p className="mt-6 max-w-xl text-pretty text-lg text-muted-foreground">
            A small, curated library of landing page footers. Each one is a single self-contained
            file — no build step, no wrapper, no configuration. Copy it and it works.
          </p>

          <dl className="mt-12 flex flex-wrap gap-x-10 gap-y-4 text-sm">
            <div>
              <dt className="text-muted-foreground">Stable</dt>
              <dd className="mt-1 text-2xl tabular-nums tracking-tight">{stable.length}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Experimental</dt>
              <dd className="mt-1 text-2xl tabular-nums tracking-tight">{experimental.length}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Tier CSS</dt>
              <dd className="mt-1 text-2xl tabular-nums tracking-tight">
                {FOOTERS.filter((footer) => footer.meta.tier === "css").length}
              </dd>
            </div>
          </dl>
        </section>

        {FOOTERS.length === 0 ? (
          <section className="border-t border-border py-20">
            <p className="text-sm font-medium tracking-tight">Nothing here yet.</p>
            <p className="mt-3 max-w-md text-pretty text-muted-foreground">
              Footers are added one at a time and deliberately curated. The first one is being
              finished now — it will be worth the wait.
            </p>
            <Link
              href="/credits"
              className="mt-6 inline-block text-sm underline underline-offset-4 focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              See what we have been learning from
            </Link>
          </section>
        ) : (
          <section className="grid gap-6 pb-20 sm:grid-cols-2">
            {FOOTERS.map((footer) => (
              <article
                key={footer.name}
                className="group relative overflow-hidden rounded-xl border border-border"
              >
                <div className="pointer-events-none h-64 border-b border-border">
                  <PreviewFrame src={`/preview/${footer.name}`} title={`${footer.title} preview`} />
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-2">
                    <TierBadge tier={footer.meta.tier} />
                    {footer.meta.status === "experimental" ? <ExperimentalBadge /> : null}
                    <span className="font-mono text-xs text-muted-foreground">
                      {footer.meta.category}
                    </span>
                  </div>

                  <h2 className="mt-4 text-lg tracking-tight">
                    <Link
                      href={`/footers/${footer.name}`}
                      className="after:absolute after:inset-0 focus-visible:outline-none"
                    >
                      {footer.title}
                    </Link>
                  </h2>
                  <p className="mt-2 text-sm text-pretty text-muted-foreground">
                    {footer.description}
                  </p>
                </div>
              </article>
            ))}
          </section>
        )}
      </main>

      <SiteFooter />
    </>
  );
}
