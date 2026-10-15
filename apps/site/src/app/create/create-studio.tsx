"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import type { FooterEntry, KnobDef } from "@footer-labs/registry/catalog";
import { footers } from "@footer-labs/registry/catalog";

import { CopyButton } from "@/components/copy-button";
import { KnobControls } from "@/components/knobs/knob-controls";
import { useKnobState } from "@/components/knobs/use-knob-state";

type Scheme = "dark" | "light";

const configurable = footers.filter((footer) => (footer.meta.knobs?.length ?? 0) > 0);

function toPascal(name: string): string {
  return name
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

/**
 * The JSX a consumer pastes, with every knob as a prop exactly as configured.
 * Blob URLs from locally previewed files are omitted — they exist only inside
 * this browser session and would be dead code anywhere else.
 */
function componentCode(name: string, knobs: readonly KnobDef[], values: Record<string, unknown>) {
  const props = knobs
    .map((knob) => {
      const value = values[knob.prop];
      switch (knob.kind) {
        case "select":
          return `${knob.prop}="${value}"`;
        case "text":
          return `${knob.prop}=${JSON.stringify(value)}`;
        case "range":
          return `${knob.prop}={${String(value)}}`;
        case "image":
          return typeof value === "string" && value.length > 0 && !value.startsWith("blob:")
            ? `${knob.prop}=${JSON.stringify(value)}`
            : null;
      }
    })
    .filter((prop): prop is string => prop !== null);

  if (props.length === 0) return `<${name} />`;
  return `<${name}\n  ${props.join("\n  ")}\n/>`;
}

/**
 * Layer 2 of the theming table: the `--fl-*` snippet set on any ancestor. The
 * one sanctioned variable today is `--fl-hue`, driven by a `hue` range knob.
 */
function themeCode(knobs: readonly KnobDef[], values: Record<string, unknown>) {
  const hue = knobs.find((knob) => knob.kind === "range" && knob.prop === "hue");
  if (!hue) return undefined;
  const value = typeof values.hue === "number" ? values.hue : hue.default;
  return `/* Set on any ancestor of the footer. */\n.theme-scope {\n  --fl-hue: ${value};\n}`;
}

export function CreateStudio() {
  const [name, setName] = useState(configurable[0]?.name ?? "");
  const selected = configurable.find((footer) => footer.name === name) ?? configurable[0];

  if (configurable.length === 0 || !selected) {
    return (
      <main className="mx-auto w-full max-w-6xl px-6 py-20 sm:px-8">
        <h1 className="text-3xl tracking-tight sm:text-4xl">Nothing to configure yet.</h1>
        <p className="mt-4 max-w-md text-pretty text-lg text-muted-foreground">
          The studio appears once a footer ships with knobs declared in its metadata.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block text-sm underline underline-offset-4 focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          Browse the gallery
        </Link>
      </main>
    );
  }

  return <Studio key={selected.name} footer={selected} onSelect={setName} />;
}

function Studio({ footer, onSelect }: { footer: FooterEntry; onSelect: (name: string) => void }) {
  const knobs = useMemo(() => footer.meta.knobs ?? [], [footer.meta.knobs]);
  const { values, set, reset } = useKnobState(knobs);
  const [scheme, setScheme] = useState<Scheme>("dark");

  const component = useMemo(
    () => componentCode(toPascal(footer.name), knobs, values),
    [footer.name, knobs, values],
  );
  const theme = useMemo(() => themeCode(knobs, values), [knobs, values]);

  const { Component } = footer;

  return (
    <main className="mx-auto grid w-full gap-8 px-6 py-8 sm:px-8 lg:grid-studio">
      <section aria-label="Live preview" className="flex min-h-96 flex-col lg:order-first">
        <div className="flex flex-1 flex-col overflow-hidden rounded-xl border border-border">
          <div className="flex-1" aria-hidden />
          <div className={scheme === "light" ? "light" : "dark"}>
            <Component {...values} />
          </div>
        </div>
      </section>

      <aside aria-label="Controls" className="space-y-8">
        <div>
          <h1 className="text-lg tracking-tight">{footer.title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">Configure it before you copy it.</p>
        </div>

        <label className="block">
          <span className="block text-xs font-medium tracking-widest text-muted-foreground uppercase">
            Footer
          </span>
          <select
            className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            value={footer.name}
            onChange={(event) => onSelect(event.target.value)}
          >
            {configurable.map((entry) => (
              <option key={entry.name} value={entry.name}>
                {entry.title}
              </option>
            ))}
          </select>
        </label>

        <div>
          <span className="block text-xs font-medium tracking-widest text-muted-foreground uppercase">
            Scheme
          </span>
          <div className="mt-2 flex gap-2">
            {(["dark", "light"] as const).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setScheme(option)}
                aria-pressed={scheme === option}
                className={
                  scheme === option
                    ? "rounded-md bg-foreground px-3 py-1.5 text-xs font-medium text-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                    : "rounded-md border border-border px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                }
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="border-t border-border pt-6">
          <span className="block text-xs font-medium tracking-widest text-muted-foreground uppercase">
            Knobs
          </span>
          <div className="mt-4">
            <KnobControls knobs={knobs} values={values} onChange={set} />
          </div>
          <button
            type="button"
            onClick={reset}
            className="mt-5 text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            Reset to defaults
          </button>
        </div>

        <div className="border-t border-border pt-6">
          <span className="block text-xs font-medium tracking-widest text-muted-foreground uppercase">
            Output
          </span>
          <div className="mt-4 flex flex-wrap gap-2">
            <CopyButton value={component} label="Copy component" />
            {theme ? <CopyButton value={theme} label="Copy theme" /> : null}
          </div>
          <pre className="mt-4 overflow-x-auto rounded-lg border border-border p-3 font-mono text-xs leading-relaxed">
            <code>{component}</code>
          </pre>
        </div>
      </aside>
    </main>
  );
}
