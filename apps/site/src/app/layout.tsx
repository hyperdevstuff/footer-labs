import type { Metadata } from "next";
import { fontVariables } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "footer-labs — tasteful footers, because we care about the end",
  description:
    "A curated, copy-paste-ready library of landing page footers for Next.js and Tailwind.",
};

/**
 * Blocking theme init.
 *
 * Runs before the body paints, which is the entire point: a visitor who chose
 * light must not get a dark frame first and a corrected one a moment later. It
 * reads the same `fl-theme` key the toggle writes, and falls back to the OS
 * preference — so the class is already correct on the very first frame and the
 * client never has to reconcile it.
 *
 * `suppressHydrationWarning` on <html> below covers the one case this script
 * cannot avoid: it mutates a server-rendered attribute.
 */
const THEME_INIT = `try{var k="fl-theme",s=localStorage.getItem(k),d=s?s==="dark":matchMedia("(prefers-color-scheme: dark)").matches;document.documentElement.classList.toggle("dark",d)}catch(e){}`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={fontVariables} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT }} />
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
