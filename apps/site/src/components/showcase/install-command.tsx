"use client";

import { useState } from "react";

/**
 * PROTOTYPE — install command with package-manager tabs.
 *
 * Pattern taken from shadcn's own `CodeBlockCommand`: one shared
 * `packageManager` value drives every command block on the page, so picking
 * `bun` once changes all of them. Per-block dropdowns would drift.
 *
 * Runner prefixes and the pnpm default are exactly what shadcn's docs use.
 */
export type Pm = "pnpm" | "npm" | "yarn" | "bun";

const RUNNER: Record<Pm, string> = {
  npm: "npx",
  pnpm: "pnpm dlx",
  yarn: "yarn dlx",
  bun: "bunx --bun",
};

export const PM_ORDER: readonly Pm[] = ["pnpm", "npm", "yarn", "bun"];

export const installCommand = (pm: Pm, name: string) =>
  `${RUNNER[pm]} shadcn@latest add @footer-labs/${name}`;

export const registryCommand = (pm: Pm) =>
  `${RUNNER[pm]} shadcn@latest registry add @footer-labs=https://footer-labs.dev/r/{name}.json`;

export function PmTabs({ value, onChange }: { value: Pm; onChange: (pm: Pm) => void }) {
  return (
    <div className="inline-flex items-center gap-0.5 rounded-md border border-border bg-muted p-0.5">
      {PM_ORDER.map((pm) => (
        <button
          key={pm}
          type="button"
          onClick={() => onChange(pm)}
          className={`h-6 rounded-sm px-2 font-mono text-xs transition-colors ${
            value === pm
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {pm}
        </button>
      ))}
    </div>
  );
}

export function CommandLine({ command }: { command: string }) {
  const [state, setState] = useState<"idle" | "copied">("idle");
  return (
    <button
      type="button"
      onClick={() => {
        void navigator.clipboard.writeText(command);
        setState("copied");
        setTimeout(() => setState("idle"), 1600);
      }}
      className="flex w-full items-center gap-3 rounded-md border border-border bg-muted px-3 py-2 text-left font-mono text-xs transition-colors hover:bg-secondary"
    >
      <span className="select-none text-muted-foreground">$</span>
      <span className="min-w-0 flex-1 truncate">{command}</span>
      <span className="shrink-0 text-muted-foreground">
        {state === "copied" ? "copied" : "copy"}
      </span>
    </button>
  );
}
