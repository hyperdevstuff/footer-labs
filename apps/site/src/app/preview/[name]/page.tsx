import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { DemoContext } from "@/components/showcase/demo-context";
import { footers } from "@footer-labs/registry/catalog";

export const dynamicParams = false;

export function generateStaticParams() {
  return footers.map((footer) => ({ name: footer.name }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ name: string }>;
}): Promise<Metadata> {
  const { name } = await params;
  const footer = footers.find((entry) => entry.name === name);

  return {
    // A viewing surface, not a destination. The canonical page is the showcase.
    title: footer ? `${footer.title} — preview` : "Preview",
    robots: { index: false, follow: false },
  };
}

/**
 * Fullscreen preview — the block in a real page position, with a way back.
 * Noindex: it is a viewing surface, not a destination.
 */
export default async function PreviewPage({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const footer = footers.find((entry) => entry.name === name);
  if (!footer) notFound();

  const { Component } = footer;

  return (
    <div className="relative min-h-dvh bg-background">
      <Link
        href={`/footers/${footer.name}`}
        className="fixed top-4 left-4 z-50 inline-flex h-9 items-center gap-2 rounded-full border border-border bg-background/90 px-4 text-sm backdrop-blur transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      >
        <ArrowLeft aria-hidden className="size-4" />
        {footer.title}
      </Link>

      <DemoContext>
        <Component />
      </DemoContext>
    </div>
  );
}
