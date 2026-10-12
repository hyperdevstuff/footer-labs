"use client";

import { useState } from "react";
import { Monitor, RotateCcw, Smartphone, Tablet } from "lucide-react";

import { CodePanel } from "./code-panel";
import { DemoContext } from "./demo-context";
import { CommandLine, PmTabs, installCommand, type Pm } from "./install-command";
import { OpenInMenu } from "./open-in-menu";
import type { FooterProp } from "@footer-labs/registry/schema";

/**
 * Block showcase.
 *
 *   name  →  preview  →  install  →  props
 *
 * No metadata table, no "design & behaviour", no credit block. Those exist in
 * the registry JSON for machines; they only get rendered when someone asks.
 *
 * The content column is deliberately left-biased and width-capped so the right
 * side stays empty. That whitespace is what lets thirty loud footers sit next
 * to quiet chrome.
 */

export type BlockData = {
  name: string;
  title: string;
  description: string;
  source: string;
  tier: string;
  category: string;
  props: readonly FooterProp[];
  footer: React.ReactNode;
};

const VIEWPORTS = [
  { id: "desktop", label: "Desktop", icon: Monitor, width: "max-w-6xl" },
  { id: "tablet", label: "Tablet", icon: Tablet, width: "max-w-3xl" },
  { id: "mobile", label: "Mobile", icon: Smartphone, width: "max-w-sm" },
] as const;

type ViewportId = (typeof VIEWPORTS)[number]["id"];

export function Showcase({ block }: { block: BlockData }) {
  const [pm, setPm] = useState<Pm>("pnpm");
  const [viewport, setViewport] = useState<ViewportId>("desktop");
  const [restartKey, setRestartKey] = useState(0);
  const [showCode, setShowCode] = useState(false);

  const width = VIEWPORTS.find((v) => v.id === viewport)?.width ?? "max-w-6xl";
  const prompt = buildPrompt(block);

  return (
    <div className="px-6 py-10 sm:px-10">
      <div className="max-w-3xl">
        {/* 1 · Name */}
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
          <h1 className="font-display text-3xl tracking-tight">{block.title}</h1>
          <span className="font-mono text-xs text-muted-foreground">{block.name}</span>
        </div>
        <p className="mt-3 text-pretty text-muted-foreground">{block.description}</p>

        {/* 2 · Preview */}
        <div className="mt-8">
          <div className="overflow-hidden rounded-xl border border-border">
            <div className="flex items-center gap-1 border-b border-border bg-muted px-2 py-1.5">
              {VIEWPORTS.map((v) => {
                const Icon = v.icon;
                const active = v.id === viewport;
                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setViewport(v.id)}
                    title={v.label}
                    aria-pressed={active}
                    className={`flex size-7 items-center justify-center rounded-md transition-colors ${
                      active
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Icon aria-hidden className="size-3.5" />
                  </button>
                );
              })}

              <button
                type="button"
                onClick={() => setRestartKey((k) => k + 1)}
                title="Restart preview"
                className="ml-1 flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
              >
                <RotateCcw aria-hidden className="size-3.5" />
              </button>

              <div className="ml-auto">
                <OpenInMenu
                  targets={[
                    {
                      label: "ChatGPT",
                      href: `https://chatgpt.com/?q=${encodeURIComponent(prompt)}`,
                    },
                    {
                      label: "Claude",
                      href: `https://claude.ai/new?q=${encodeURIComponent(prompt)}`,
                    },
                    {
                      label: "v0",
                      href: `https://v0.dev/chat?q=${encodeURIComponent(prompt)}`,
                    },
                  ]}
                  prompt={prompt}
                />
              </div>
            </div>

            <div className="flex min-h-canvas justify-center overflow-hidden bg-muted/30 p-4">
              <div
                key={`${block.name}-${restartKey}`}
                className={`w-full overflow-hidden rounded-lg border border-border shadow-sm ${width}`}
              >
                <DemoContext>{block.footer}</DemoContext>
              </div>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-3">
            <a
              href={`/preview/${block.name}`}
              className="text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              Fullscreen ↗
            </a>
            <button
              type="button"
              onClick={() => setShowCode((v) => !v)}
              className="text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              {showCode ? "Hide source" : "View source"}
            </button>
          </div>

          {showCode ? (
            <div className="mt-4">
              <CodePanel source={block.source} />
            </div>
          ) : null}
        </div>

        {/* 3 · Install */}
        <div className="mt-12">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
              Install
            </h2>
            <PmTabs value={pm} onChange={setPm} />
          </div>
          <div className="mt-3">
            <CommandLine command={installCommand(pm, block.name)} />
          </div>
        </div>

        {/* 4 · Props */}
        {block.props.length > 0 ? (
          <div className="mt-10">
            <h2 className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
              Props
            </h2>
            <dl className="mt-3 divide-y divide-border">
              {block.props.map((prop) => (
                <div key={prop.name} className="grid gap-1 py-3 sm:grid-props">
                  <dt className="font-mono text-xs">
                    {prop.name}
                    <span className="text-muted-foreground">: {prop.type}</span>
                    {prop.default ? (
                      <span className="block text-muted-foreground">default {prop.default}</span>
                    ) : null}
                  </dt>
                  <dd className="text-xs text-pretty text-muted-foreground">{prop.description}</dd>
                </div>
              ))}
            </dl>
          </div>
        ) : null}

        <div className="h-16" />
      </div>
    </div>
  );
}

function buildPrompt(block: BlockData): string {
  const pascal = block.name
    .split("-")
    .map((p) => (p[0] ?? "").toUpperCase() + p.slice(1))
    .join("");

  return [
    `Add the footer-labs block "${block.name}" to my project.`,
    ``,
    `Install it with the shadcn CLI:`,
    `  npx shadcn@latest add @footer-labs/${block.name}`,
    ``,
    `Then render it as the last element of the page:`,
    `  import { ${pascal} } from "@/components/footer-${block.name}"`,
    ``,
    `What it is: ${block.description}`,
    ``,
    `- One self-contained file, no dependencies.`,
    `- Structural colour uses shadcn semantic tokens, so it inherits your theme.`,
    `- The accent is the \`hue\` prop, which writes the --fl-hue custom property.`,
    `- Do not add a newsletter form, a social row, or extra motion.`,
  ].join("\n");
}
