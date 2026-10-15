import { notFound } from "next/navigation";

import { footers } from "@footer-labs/registry/catalog";
import { SOURCES } from "@footer-labs/registry/sources";
import { BlockSidebar } from "@/components/block-sidebar";
import { Showcase, type BlockData } from "@/components/showcase/showcase";

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
  const block: BlockData = {
    name: footer.name,
    title: footer.title,
    description: footer.description,
    source: SOURCES[footer.name] ?? "",
    tier: meta.tier,
    category: meta.category,
    props: meta.props ?? [],
    footer: <footer.Component />,
  };

  return (
    /* No site header here: the sidebar is the navigation on this page, and it
       already carries the wordmark home link and every other footer. A second
       bar above the preview was spending the best screen on a navbar. */
    <div className="grid lg:grid-doc">
      <BlockSidebar active={footer.name} />
      <Showcase block={block} />
    </div>
  );
}
