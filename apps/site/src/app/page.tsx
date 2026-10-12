import type { ReactNode } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { FOOTERS } from "@footer-labs/registry";
import { RegistrySetup } from "@/components/landing/registry-setup";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

/**
 * Landing page.
 *
 * It argues, it does not enumerate. A grid of every footer here would turn the
 * front door into the catalogue — the visitor would scan forty cards, pick one,
 * and never read a word about why any of them deserve to exist. Browsing gets
 * its own page, with the sidebar; this one has a job, which is to be worth the
 * trip to that page.
 *
 * The thing that makes it land is also the thing it is selling: the footer at
 * the bottom of this page is real, and the line above it explains exactly why
 * it is not in the registry.
 */

export default function Home() {
  return (
    <>
      <SiteHeader />

      <main>
        <Hero />

        <Promise />

        <Setup />

        <Tiers />

        <Theming />

        <Closing />

        {/*
         * The caption that makes the page's own footer legible as an argument
         * rather than an afterthought. It is the one place the site admits that
         * its most-viewed footer is not for sale.
         */}
        <p className="mx-auto w-full max-w-6xl px-6 pb-10 text-pretty text-xs text-muted-foreground sm:px-8">
          The footer below this line is ours, not the library&rsquo;s. It is deliberately excluded —
          if the site&rsquo;s own footer were installable, the most-viewed footer on the site would
          be advertising itself.
        </p>
      </main>

      <SiteFooter />
    </>
  );
}

function Hero() {
  return (
    <section className="mx-auto w-full max-w-6xl px-6 pt-20 pb-24 sm:px-8 sm:pt-28 sm:pb-32">
      <p className="enter enter-1 font-mono text-xs tracking-widest text-muted-foreground uppercase">
        A curated footer library
      </p>

      <h1 className="enter enter-2 mt-6 max-w-4xl text-balance font-display text-4xl leading-display tracking-tight sm:text-6xl">
        Most libraries stop at the hero. This one starts at the footer.
      </h1>

      <p className="enter enter-3 mt-6 max-w-xl text-pretty text-lg text-muted-foreground">
        Each footer is a single self-contained file. No wrapper, no provider, no configuration, no
        build step. Paste it into a fresh Next.js project and it renders, themes and responds
        correctly on the first try.
      </p>

      <div className="enter enter-4 mt-10 flex flex-wrap items-center gap-3">
        <Link
          href="/blocks"
          className="inline-flex h-10 items-center gap-2 rounded-md bg-foreground px-5 text-sm font-medium text-background transition-transform duration-150 ease-out active:scale-press focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none"
        >
          Browse the library
          <ArrowRight aria-hidden className="size-4" />
        </Link>

        <a
          href="https://github.com/hyperdevstuff/footer-labs"
          className="inline-flex h-10 items-center gap-2 rounded-md border border-border px-5 text-sm transition-colors duration-150 hover:bg-secondary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          GitHub
          <ArrowUpRight aria-hidden className="size-4" />
        </a>
      </div>
    </section>
  );
}

const PROMISES = [
  {
    title: "One file, whole",
    body: "The copy is the component. There is no `footer-labs.css` to import and no provider to wrap your app in, because there is nothing left after the file is in your tree.",
  },
  {
    title: "Your theme, not ours",
    body: "Structure is built from shadcn's semantic tokens, so it re-themes with the rest of your site. The accent is one number — a hue — not a palette we picked for you.",
  },
  {
    title: "Honest metadata",
    body: "Every block states what reduced motion does to it and what its accessibility limits are. A footer that quietly fails contrast at small sizes says so on its own page.",
  },
] as const;

function Promise() {
  return (
    <Section label="The promise">
      <div className="grid gap-10 sm:grid-cols-3 sm:gap-8">
        {PROMISES.map((promise) => (
          <div key={promise.title}>
            <h3 className="font-display text-base tracking-tight">{promise.title}</h3>
            <p className="mt-3 text-pretty text-sm text-muted-foreground">{promise.body}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

function Setup() {
  return (
    <Section label="Install">
      <div className="max-w-2xl">
        <p className="text-pretty text-muted-foreground">
          Register the namespace once, then install any footer by name. It is the shadcn CLI — the
          same command, the same resolution, the same{" "}
          <code className="font-mono">components.json</code> you already have.
        </p>
        <div className="mt-6">
          <RegistrySetup />
        </div>
      </div>
    </Section>
  );
}

const TIER_ROWS = [
  {
    tier: "css",
    needs: "Tailwind and CSS. Zero npm packages.",
    mix: "~70%",
  },
  {
    tier: "motion",
    needs: "The `motion` package, for springs and interruptions.",
    mix: "~20%",
  },
  {
    tier: "webgl",
    needs: "WebGL, or `shaders`. Badged, and never silently assumed.",
    mix: "~10%",
  },
] as const;

function Tiers() {
  return (
    <Section label="What it costs to install">
      <div className="max-w-2xl">
        <p className="text-pretty text-muted-foreground">
          Tier describes dependency cost, not complexity — it is the filter you want if you are
          pasting without touching your build. Each block shows its tier on its card and in the
          registry JSON.
        </p>

        <dl className="mt-8 divide-y divide-border border-y border-border">
          {TIER_ROWS.map((row) => (
            <div key={row.tier} className="grid grid-tier items-baseline gap-4 py-4">
              <dt className="font-mono text-sm">{row.tier}</dt>
              <dd className="text-pretty text-sm text-muted-foreground">{row.needs}</dd>
              <dd className="text-right font-mono text-xs text-muted-foreground tabular-nums">
                {row.mix}
              </dd>
            </div>
          ))}
        </dl>

        <p className="mt-3 text-xs text-muted-foreground">Target mix, not a shipping count.</p>
      </div>
    </Section>
  );
}

function Theming() {
  return (
    <Section label="Theming">
      <div className="max-w-2xl">
        <p className="text-pretty text-muted-foreground">
          Structural colour comes from your tokens. The accent comes from a single custom property
          that any footer reads with a fallback, so you can theme one from a prop, all of them from
          an ancestor, or neither at all.
        </p>

        <div className="mt-6 overflow-hidden rounded-lg border border-border bg-muted/40">
          <p className="border-b border-border px-4 py-2 font-mono text-xs text-muted-foreground">
            theme this footer
          </p>
          <pre className="overflow-x-auto px-4 py-3 text-xs leading-relaxed">
            <code>{`<html style="--fl-hue: 265" />`}</code>
          </pre>
        </div>
      </div>
    </Section>
  );
}

function Closing() {
  return (
    <Section label="Browse">
      <div className="flex flex-wrap items-center justify-between gap-6">
        <p className="max-w-md text-pretty text-muted-foreground">
          {FOOTERS.length} {FOOTERS.length === 1 ? "footer" : "footers"} so far. Each one designed
          on its own rather than generated in a batch — which is why the list is short.
        </p>
        <Link
          href="/blocks"
          className="group inline-flex h-10 items-center gap-2 rounded-md border border-border px-5 text-sm transition-colors duration-150 hover:bg-secondary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          Browse by category
          <ArrowRight
            aria-hidden
            className="size-4 transition-transform duration-150 ease-out group-hover:translate-x-0.5"
          />
        </Link>
      </div>
    </Section>
  );
}

/** One section rhythm for the whole page, so spacing is never re-invented. */
function Section({ label, children }: { label: string; children: ReactNode }) {
  return (
    <section className="border-t border-border">
      <div className="mx-auto w-full max-w-6xl px-6 py-20 sm:px-8 sm:py-24">
        <h2 className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
          {label}
        </h2>
        <div className="mt-8">{children}</div>
      </div>
    </section>
  );
}
