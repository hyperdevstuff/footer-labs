import type { Metadata } from "next";
import { fontVariables } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "footer-labs — tasteful footers, because we care about the end",
  description:
    "A curated, copy-paste-ready library of landing page footers for Next.js and Tailwind.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`dark ${fontVariables}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
