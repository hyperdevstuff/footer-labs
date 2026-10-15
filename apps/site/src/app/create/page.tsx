import type { Metadata } from "next";

import { SiteHeader } from "@/components/site-header";

import { CreateStudio } from "./create-studio";

export const metadata: Metadata = {
  title: "Create — footer-labs",
  description: "Configure a footer live, then copy the component and the theme snippet.",
};

export default function CreatePage() {
  return (
    <>
      <SiteHeader />
      <CreateStudio />
    </>
  );
}
