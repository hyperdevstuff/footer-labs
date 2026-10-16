import { notFound } from "next/navigation";

import { footers } from "@footer-labs/registry/catalog";
import { SOURCES } from "@footer-labs/registry/sources";
import { FooterSidebar } from "@/components/footer-sidebar";
import { MobileBar } from "@/components/library-sidebar";
import { Showcase, type FooterData } from "@/components/showcase/showcase";

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
  const entry = footers.find((footer) => footer.name === name);
  if (!entry) notFound();

  const { meta } = entry;
  const data: FooterData = {
    name: entry.name,
    title: entry.title,
    description: entry.description,
    source: SOURCES[entry.name] ?? "",
    tier: meta.tier,
    category: meta.category,
    props: meta.props ?? [],
    preview: <entry.Component />,
  };

  return (
    /* No site header here: the sidebar is the navigation on this page, and it
       already carries the wordmark home link and every other footer. A second
       bar above the preview was spending the best screen on a navbar.

       The one exception is `MobileBar`, because the sidebar is `hidden
       lg:block` — below `lg` it does not exist, and without the bar this page
       would have no way home and no theme toggle at any width under 1024px. */
    <div className="min-h-dvh bg-background">
      <MobileBar />

      <div className="grid lg:grid-doc">
        <FooterSidebar active={entry.name} />
        <Showcase footer={data} />
      </div>
    </div>
  );
}
