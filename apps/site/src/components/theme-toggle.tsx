"use client";

import { useEffect } from "react";
import { Moon, Sun } from "lucide-react";

/**
 * Theme toggle.
 *
 * Two states, and the OS decides until the visitor says otherwise: no stored
 * preference means `prefers-color-scheme` wins, and it keeps winning live — a
 * visitor whose OS flips to light at sunset should not have to reload to see
 * it. One click writes the choice and from then on it is the only thing that
 * counts.
 *
 * No `next-themes`, no provider, no `ThemeProvider` in the tree. The whole
 * mechanism is one class on <html> and one key in localStorage, and a provider
 * would be a dependency the site does not otherwise need.
 *
 * The icon swap is pure CSS — `dark:hidden` and `dark:block` against the
 * `.dark` class the layout's init script already sets. That matters for more
 * than tidiness: the server has no idea what the visitor's theme is, so any
 * icon chosen in React state would either flash or hydrate against the wrong
 * one. Rendering both and letting CSS pick means the markup is identical on the
 * server and the client, and the right one is visible before first paint.
 */

/** Must match the key in the root layout's init script. */
const KEY = "fl-theme";

function apply(dark: boolean) {
  document.documentElement.classList.toggle("dark", dark);
}

export function ThemeToggle() {
  /**
   * Follow the OS for as long as no choice has been made.
   *
   * Runs here rather than in the layout because this is the only place that
   * knows a toggle exists, and it stops touching the class the moment a
   * preference is stored — including the one the visitor just made by clicking.
   */
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const sync = () => {
      let stored: string | null = null;
      try {
        stored = localStorage.getItem(KEY);
      } catch {
        return;
      }
      if (!stored) apply(media.matches);
    };

    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  return (
    <button
      type="button"
      onClick={() => {
        const dark = !document.documentElement.classList.contains("dark");
        apply(dark);
        try {
          localStorage.setItem(KEY, dark ? "dark" : "light");
        } catch {
          /* Private mode, storage disabled. The toggle still works this visit. */
        }
      }}
      aria-label="Toggle theme"
      title="Toggle theme"
      className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors duration-150 hover:bg-secondary/60 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
    >
      {/* Both icons ship; CSS picks. The one shown is the theme this click moves to. */}
      <Moon aria-hidden className="size-4 dark:hidden" />
      <Sun aria-hidden className="hidden size-4 dark:block" />
    </button>
  );
}
