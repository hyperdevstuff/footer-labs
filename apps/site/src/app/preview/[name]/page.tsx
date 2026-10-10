import { notFound } from "next/navigation";

import { footers } from "@footer-labs/registry/catalog";

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
    robots: { index: true, follow: true },
  };
}

/**
 * The preview surface. Rendered inside a sandboxed iframe on the gallery, so
 * it carries no chrome of its own — just enough page above the footer that the
 * footer is seen in the position it will actually occupy.
 */
export default async function PreviewPage({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const footer = footers.find((entry) => entry.name === name);
  if (!footer) notFound();

  const { Component } = footer;

  return (
    <div className="flex min-h-dvh flex-col">
      <div className="mx-auto w-full max-w-6xl flex-1 px-6 py-16 sm:px-8">
        <div className="max-w-xl space-y-3" aria-hidden>
          <div className="h-4 w-24 rounded bg-border" />
          <div className="h-8 w-full rounded bg-border" />
          <div className="h-8 w-3/4 rounded bg-border" />
          <div className="pt-4 h-4 w-1/2 rounded bg-border" />
        </div>
      </div>
      <Component />
    </div>
  );
}
