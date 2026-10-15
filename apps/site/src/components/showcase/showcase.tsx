"use client";

import { useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  Code2,
  Maximize2,
  Monitor,
  RotateCcw,
  Smartphone,
  Tablet,
} from "lucide-react";

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
  const sourcePanel = useRef<HTMLDivElement>(null);

  /**
   * Take the reader to the panel they just opened.
   *
   * The source renders below the preview, which is the right place for it and
   * a terrible place to discover: the button says "View source", the panel
   * appears off-screen, and nothing on the page acknowledges that anything
   * happened. The chevron on the button says which way it goes; this makes
   * good on it.
   *
   * Only on open. Closing leaves the reader where they are, which is where
   * they were already looking.
   *
   * `block: "start"` rather than `"nearest"` because the panel is taller than
   * the space below it — the nearest edge would leave the filename header, the
   * only thing identifying the panel, scrolled off the top.
   */
  useEffect(() => {
    if (!showCode) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    sourcePanel.current?.scrollIntoView({
      behavior: reduced ? "auto" : "smooth",
      block: "start",
    });
  }, [showCode]);

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
      </div>

      {/*
       * 2 · Preview — full width, deliberately outside the measure above.
       *
       * The stage is the only element on this page that is allowed to be as
       * wide as the column it sits in. A desktop footer is 1152px wide; shown
       * inside a 768px text column it silently re-flows, and a "desktop"
       * preview that is not desktop is worse than no preview at all. The prose
       * keeps its measure because prose needs one; a canvas does not.
       *
       * Only the inner frame changes width when the viewport toggle moves.
       * The frame, the toolbar and the canvas around it stay exactly where
       * they are, so switching device re-lays-out the footer and nothing
       * else — the page does not jump, and the toolbar never reflows its
       * own buttons.
       */}
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

            <div className="ml-auto flex items-center gap-2">
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

              {/* Fullscreen and source both act on the preview, so they live on
                    the preview's own toolbar. They were down in the caption row
                    below, which read as a footnote and got skipped. */}
              <a
                href={`/preview/${block.name}`}
                className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border bg-background px-3 text-xs font-medium transition-colors hover:bg-secondary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              >
                <Maximize2 aria-hidden className="size-3.5" />
                Fullscreen
              </a>

              <button
                type="button"
                onClick={() => setShowCode((v) => !v)}
                aria-expanded={showCode}
                aria-controls="fl-source"
                className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border bg-background px-3 text-xs font-medium transition-colors hover:bg-secondary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              >
                <Code2 aria-hidden className="size-3.5" />
                {showCode ? "Hide source" : "View source"}
                {/* Points the way the panel goes. The chevron flipping is most
                    of the affordance — a label that changes on its own says
                    "something is now open", not "look down here". */}
                <ChevronDown
                  aria-hidden
                  className={`size-3.5 transition-transform duration-200 ease-out motion-reduce:transition-none ${
                    showCode ? "rotate-180" : ""
                  }`}
                />
              </button>
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

        {/* Kept mounted and hidden rather than unmounted, so toggling source
              does not throw away the scroll position inside the panel. */}
        <div id="fl-source" ref={sourcePanel} hidden={!showCode} className="mt-4 scroll-mt-6">
          <CodePanel source={block.source} />
        </div>
      </div>

      {/* Prose again, at the measure it had before the preview borrowed the
          full width. Install and props are text, and text wants a column. */}
      <div className="max-w-3xl">
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
