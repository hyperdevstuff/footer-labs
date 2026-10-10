import { Geist, Inter } from "next/font/google";
import localFont from "next/font/local";

/**
 * footer-labs typography.
 *
 * Three families, three jobs. The mono pairing is not arbitrary — Paper Mono
 * is derived from Geist Mono (Copyright (c) 2025 Lost Coast Labs, Inc.),
 * so the two share a skeleton and sit together without fighting.
 *
 *   Inter       — sans, body and default. Tight, neutral, reads at 14px.
 *   Geist       — display and site chrome. A little more character than Inter
 *                 at large sizes, which is where the wordmark lives.
 *   Paper Mono  — mono. Self-hosted variable file, all eight weights in 52KB.
 *
 * Fonts are loaded once here and exposed as CSS variables, so `font-sans`,
 * `font-display` and `font-mono` work everywhere without an import.
 *
 * FOOTERS NEVER LOAD A FONT. A footer uses the consumer's `font-sans` /
 * `font-mono` from their Tailwind theme. Shipping a font inside a pasted file
 * would mean a 52KB binary riding along with copy-paste code, which breaks the
 * self-contained promise for nothing. See AGENTS.md.
 */

/** Paper Mono is SIL Open Font License 1.1 — see the licence beside the file. */
export const paperMono = localFont({
  src: "../fonts/PaperMono-Variable.woff2",
  weight: "100 800",
  style: "normal",
  display: "swap",
  variable: "--font-paper-mono",
  fallback: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
});

export const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const geist = Geist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist",
});

export const fontVariables = [inter.variable, geist.variable, paperMono.variable].join(" ");
