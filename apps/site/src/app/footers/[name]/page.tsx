import { notFound } from "next/navigation";

import { footers } from "@footer-labs/registry/catalog";
import { SOURCES } from "@footer-labs/registry/sources";
import { BlockSidebar } from "@/components/block-sidebar";
import { Showcase, type BlockData } from "@/components/showcase/showcase";
import { SiteHeader } from "@/components/site-header";

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
    <>
      {/* Not sticky here — on a showcase page it eats the preview's vertical space. */}
      <SiteHeader sticky={false} />
      <div className="grid lg:grid-doc">
        <BlockSidebar active={footer.name} />
        <Showcase block={block} />
      </div>
    </>
  );
}
