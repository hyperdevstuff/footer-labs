import Link from "next/link";
import { notFound } from "next/navigation";

import { footers } from "@footer-labs/registry/catalog";
import { SOURCES } from "@footer-labs/registry/sources";
import { CopyButton } from "@/components/copy-button";
import { PreviewFrame } from "@/components/preview-frame";
import { ExperimentalBadge, TierBadge } from "@/components/badges";

export const dynamicParams = false;

export function generateStaticParams() {
  return footers.map((footer) => ({ name: footer.name }));
}

export async function generateMetadata({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const footer = footers.find((entry) => entry.name === name);
  if (!footer) return {};

  return {
    title: `${footer.title} — footer-labs`,
    description: footer.description,
    openGraph: { title: footer.title, description: footer.description, type: "article" },
  };
}

export default async function FooterPage({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const footer = footers.find((entry) => entry.name === name);
  if (!footer) notFound();

  const { meta } = footer;
  const source = SOURCES[footer.name] ?? "";
  const install = `npx shadcn@latest add @footer-labs/${footer.name}`;

  const credit =
    "original" in meta.credit ? (
      <span className="text-xs">original</span>
    ) : (
      <a
        href={meta.credit.url}
        className="text-xs underline underline-offset-4 focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      >
        {meta.credit.technique}
      </a>
    );

  const rows: [string, React.ReactNode][] = [
    ["Tier", <TierBadge key="tier" tier={meta.tier} />],
    [
      "Category",
      <span key="c" className="font-mono text-xs">
        {meta.category}
      </span>,
    ],
    [
      "Tags",
      <span key="tags" className="text-xs">
        {meta.tags.join(" · ")}
      </span>,
    ],
    [
      "Status",
      meta.status === "experimental" ? (
        <ExperimentalBadge key="s" />
      ) : (
        <span key="s" className="text-xs">
          stable
        </span>
      ),
    ],
    [
      "Dependencies",
      <span key="d" className="font-mono text-xs">
        {footer.dependencies.length === 0 ? "none" : footer.dependencies.join(", ")}
      </span>,
    ],
    [
      "Reduced motion",
      <span key="rm" className="text-xs">
        {meta.reducedMotion}
      </span>,
    ],
    [
      "Accessibility",
      <span key="a" className="text-xs">
        {meta.a11y}
      </span>,
    ],
    ["Credit", credit],
    [
      "Contributor",
      <span key="co" className="text-xs">
        {meta.contributor}
      </span>,
    ],
    [
      "Added",
      <span key="da" className="font-mono text-xs">
        {meta.dateAdded}
      </span>,
    ],
  ];

  if (meta.deviations && meta.deviations.length > 0) {
    rows.splice(4, 0, [
      "Deviations",
      <span key="dev" className="text-xs">
        {meta.deviations.join(" · ")}
      </span>,
    ]);
  }

  return (
    <>
      <main className="mx-auto w-full max-w-6xl px-6 py-12 sm:px-8">
        <Link
          href="/"
          className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          ← all footers
        </Link>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <h1 className="text-3xl tracking-tight sm:text-4xl">{footer.title}</h1>
          <TierBadge tier={meta.tier} />
          {meta.status === "experimental" ? <ExperimentalBadge /> : null}
        </div>
        <p className="mt-4 max-w-2xl text-pretty text-lg text-muted-foreground">
          {footer.description}
        </p>

        {meta.deviations && meta.deviations.length > 0 ? (
          <div className="mt-6 max-w-2xl rounded-lg border border-border p-4">
            <p className="text-sm font-medium">
              This footer breaks{" "}
              {meta.deviations.length === 1 ? "one rule" : `${meta.deviations.length} rules`}.
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              It is experimental, it does not count toward the library total, and it has no
              automated visual verification. Know that before you use it.
            </p>
          </div>
        ) : null}

        <div className="mt-8 flex flex-wrap gap-3">
          <CopyButton value={source} label="Copy component" />
          <CopyButton value={install} label="Install via CLI" />
        </div>

        <section className="mt-10 h-128 overflow-hidden rounded-xl border border-border">
          <PreviewFrame src={`/preview/${footer.name}`} title={`${footer.title} preview`} />
        </section>

        <section className="mt-14 grid gap-10 pb-20 md:grid-split">
          <div>
            <h2 className="text-sm font-medium tracking-widest uppercase">Technique</h2>
            <p className="mt-4 max-w-2xl text-pretty text-muted-foreground">
              {footer.description} The full reasoning, and the specific Tailwind and CSS being used,
              are documented here as the footer is finalised.
            </p>
          </div>

          <div>
            <h2 className="text-sm font-medium tracking-widest uppercase">Details</h2>
            <dl className="mt-4 space-y-3 text-sm">
              {rows.map(([label, value]) => (
                <div key={label} className="grid grid-meta gap-3">
                  <dt className="text-muted-foreground">{label}</dt>
                  <dd className="min-w-0">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <details className="pb-20">
          <summary className="cursor-pointer text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">
            View source
          </summary>
          <pre className="mt-4 overflow-x-auto rounded-lg border border-border p-4 text-xs leading-relaxed">
            <code>{source}</code>
          </pre>
        </details>
      </main>
    </>
  );
}
