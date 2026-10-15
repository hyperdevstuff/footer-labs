"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import type { FooterEntry, KnobDef } from "@footer-labs/registry/catalog";
import { footers } from "@footer-labs/registry/catalog";

import { CopyButton } from "@/components/copy-button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { KnobControls } from "@/components/knobs/knob-controls";
import { useKnobState } from "@/components/knobs/use-knob-state";

type Scheme = "dark" | "light";

const configurable = footers.filter((footer) => (footer.meta.knobs?.length ?? 0) > 0);

const fieldLabel = "block text-xs font-medium tracking-widest text-muted-foreground uppercase";

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
      <main className="flex w-full flex-1 items-center justify-center overflow-y-auto px-6 py-20">
        <div className="max-w-md">
          <h1 className="text-3xl tracking-tight sm:text-4xl">Nothing to configure yet.</h1>
          <p className="mt-4 text-pretty text-lg text-muted-foreground">
            The studio appears once a footer ships with knobs declared in its metadata.
          </p>
          <Link
            href="/"
            className="mt-6 inline-block text-sm underline underline-offset-4 focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            Browse the gallery
          </Link>
        </div>
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
    <main className="grid min-h-0 w-full flex-1 overflow-y-auto lg:grid-studio lg:overflow-hidden">
      <aside
        aria-label="Controls"
        className="min-h-0 space-y-8 border-b border-border px-6 py-8 lg:overflow-y-auto lg:border-b-0 lg:border-r"
      >
        <div>
          <h1 className="text-lg tracking-tight">{footer.title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">Configure it before you copy it.</p>
        </div>

        <div>
          <span className={fieldLabel}>Footer</span>
          <div className="mt-2">
            <Select value={footer.name} onValueChange={onSelect}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {configurable.map((entry) => (
                  <SelectItem key={entry.name} value={entry.name}>
                    {entry.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <span className={fieldLabel}>Scheme</span>
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

        <div>
          <span className={fieldLabel}>Knobs</span>
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

        <div>
          <span className={fieldLabel}>Copy</span>
          <div className="mt-4 flex flex-wrap gap-2">
            <CopyButton value={component} label="Copy component" />
            {theme ? <CopyButton value={theme} label="Copy theme" /> : null}
          </div>
        </div>
      </aside>

      <section aria-label="Live preview" className="flex min-h-0 flex-col">
        <div className="flex-1" aria-hidden />
        <div className={scheme === "light" ? "light" : "dark"}>
          <Component {...values} />
        </div>
      </section>
    </main>
  );
}
