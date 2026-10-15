"use client";

import type { ChangeEvent } from "react";

import type { KnobDef } from "@footer-labs/registry";

const fieldLabel = "block text-xs font-medium tracking-widest text-muted-foreground uppercase";
const controlClass =
  "mt-2 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none";

type KnobControlsProps = {
  knobs: readonly KnobDef[];
  values: Record<string, unknown>;
  onChange: (prop: string, value: unknown) => void;
};

/**
 * Renders whatever the footer's knob metadata describes. This file knows
 * nothing about any specific footer — the metadata decides what is tunable.
 *
 * Hand-rolled native inputs on purpose: the site has no component primitives
 * and four controls do not justify adding Base UI, lucide and a cn() to it.
 * Inline styles are approved for this directory (eslint override) — knobs
 * write `--fl-*` custom properties that no static class can express.
 */
export function KnobControls({ knobs, values, onChange }: KnobControlsProps) {
  return (
    <div className="space-y-5">
      {knobs.map((knob) => (
        <KnobField
          key={knob.prop}
          knob={knob}
          value={values[knob.prop]}
          onChange={(value) => onChange(knob.prop, value)}
        />
      ))}
    </div>
  );
}

function KnobField({
  knob,
  value,
  onChange,
}: {
  knob: KnobDef;
  value: unknown;
  onChange: (value: unknown) => void;
}) {
  switch (knob.kind) {
    case "select":
      return (
        <label className="block">
          <span className={fieldLabel}>{knob.label}</span>
          <select
            className={controlClass}
            value={typeof value === "string" ? value : knob.default}
            onChange={(event) => onChange(event.target.value)}
          >
            {knob.options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      );

    case "text":
      return (
        <label className="block">
          <span className={fieldLabel}>{knob.label}</span>
          <input
            type="text"
            className={controlClass}
            value={typeof value === "string" ? value : knob.default}
            onChange={(event) => onChange(event.target.value)}
          />
        </label>
      );

    case "range":
      return (
        <label className="block">
          <span className={fieldLabel}>{knob.label}</span>
          <span className="mt-2 flex items-center gap-3">
            <input
              type="range"
              min={knob.min}
              max={knob.max}
              step={knob.step}
              value={typeof value === "number" ? value : knob.default}
              onChange={(event) => onChange(event.target.valueAsNumber)}
              className="h-2 w-full cursor-pointer accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            />
            <span className="w-10 text-right font-mono text-xs tabular-nums text-muted-foreground">
              {typeof value === "number" ? value : knob.default}
            </span>
          </span>
        </label>
      );

    case "image": {
      const url = typeof value === "string" && value.length > 0 ? value : undefined;

      function onFile(event: ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];
        onChange(file ? URL.createObjectURL(file) : undefined);
      }

      return (
        <div>
          <span className={fieldLabel}>{knob.label}</span>
          {url ? (
            <img
              src={url}
              alt=""
              className="mt-2 h-20 w-full rounded-md border border-border object-cover"
            />
          ) : null}
          <input
            type="file"
            accept="image/*"
            onChange={onFile}
            className="mt-2 w-full text-xs text-muted-foreground file:mr-3 file:rounded-md file:border-0 file:bg-secondary file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-secondary-foreground hover:file:opacity-90 focus-visible:outline-none"
          />
          {knob.presets && knob.presets.length > 0 ? (
            <div className="mt-2 flex flex-wrap gap-2">
              {knob.presets.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => onChange(preset)}
                  className="overflow-hidden rounded-md border border-border focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                  aria-label={`Use preset texture`}
                >
                  <img src={preset} alt="" className="h-10 w-16 object-cover" />
                </button>
              ))}
            </div>
          ) : null}
          {url ? (
            <button
              type="button"
              onClick={() => onChange(undefined)}
              className="mt-2 text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              Clear image
            </button>
          ) : null}
        </div>
      );
    }
  }
}
