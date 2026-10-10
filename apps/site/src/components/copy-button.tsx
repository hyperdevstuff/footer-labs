"use client";

import { useState } from "react";

/**
 * Two buttons, deliberately. See AGENTS.md / CONTRIBUTING.md: a third
 * "copy with dependencies" button was considered and rejected — a warning
 * sitting next to a copy button is a warning nobody reads, and the broken
 * build it causes is how copy-paste libraries lose people.
 */
export function CopyButton({ value, label }: { value: string; label: string }) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setState("copied");
    } catch {
      setState("failed");
    }
    setTimeout(() => setState("idle"), 1800);
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex h-9 items-center rounded-md bg-foreground px-4 text-sm font-medium text-background transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none"
    >
      {state === "copied" ? "Copied" : state === "failed" ? "Press Ctrl+C" : label}
    </button>
  );
}
