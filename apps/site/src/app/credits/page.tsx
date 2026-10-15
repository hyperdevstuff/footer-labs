import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const ENTRIES = [
  {
    href: "https://github.com/shadcn-ui/ui",
    name: "shadcn/ui",
    note: "MIT — the registry distribution model this library is built on.",
  },
  {
    href: "https://hairline.lucasmarkes.com",
    name: "Hairline",
    note: "MIT, © Lucas Marques — isometric line figures that answer the pointer.",
  },
  {
    href: "https://skills.wheresryan.sh/anatomy",
    name: "Anatomy",
    note: "MIT, © Ryan — isometric figures, and a build-then-verify-with-screenshots loop we borrow.",
  },
];

export default function CreditsPage() {
  return (
    <main className="mx-auto w-full max-w-2xl px-6 py-20 sm:px-8">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      >
        <ArrowLeft aria-hidden className="size-3.5" />
        footer-labs
      </Link>

      <h1 className="mt-8 text-3xl tracking-tight sm:text-4xl">Credits</h1>

      <div className="mt-6 space-y-6 text-pretty text-muted-foreground">
        <p>
          footer-labs exists because people made beautiful footers first. This page is our reading
          list.
        </p>
        <p>
          We credit <strong className="text-foreground">techniques, not designs</strong>. A
          technique is a reusable craft decision — an easing curve, a masking approach, a type
          scale. Layouts and structures are not copyrightable; specific illustrations, photographs,
          logos, fonts and written marketing copy are, and none of those are reproduced here.
        </p>
        <p>
          The MIT license covers{" "}
          <strong className="text-foreground">the code in this repository</strong>. It does not
          license photographs, generated imagery, or fonts, and no such asset is committed to the
          source tree.
        </p>
      </div>

      <h2 className="mt-14 text-sm font-medium tracking-widest uppercase">Tools we learned from</h2>
      <ul className="mt-5 space-y-4">
        {ENTRIES.map((entry) => (
          <li key={entry.href}>
            <a
              href={entry.href}
              className="text-sm underline underline-offset-4 focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              {entry.name}
            </a>
            <p className="mt-1 text-sm text-muted-foreground">{entry.note}</p>
          </li>
        ))}
      </ul>

      <h2 className="mt-14 text-sm font-medium tracking-widest uppercase">The reading list</h2>
      <p className="mt-5 text-muted-foreground">
        No entries yet — the first footers are being built. They appear here as they ship. If your
        footer taught us something and it is not on this list, that is a bug.
      </p>
    </main>
  );
}
