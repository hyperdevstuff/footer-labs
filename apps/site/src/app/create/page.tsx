import type { Metadata } from "next";

import { SiteHeader } from "@/components/site-header";

import { CreateStudio } from "./create-studio";

export const metadata: Metadata = {
  title: "Create — footer-labs",
  description: "Configure a footer live, then copy the component and the theme snippet.",
};

/**
 * The studio is a no-scroll surface: the frame is exactly the viewport, the
 * sidebar scrolls internally if it must, and the footer preview stays pinned
 * in view — it is the thing being configured.
 */
export default function CreatePage() {
  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      <SiteHeader />
      <CreateStudio />
    </div>
  );
}
