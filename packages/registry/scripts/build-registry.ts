/**
 * Builds and validates the shadcn registry.
 *
 * Run with `pnpm registry:build` (writes) or `pnpm registry:validate`
 * (validate only). Both exit non-zero on any problem, so CI fails loudly.
 *
 * This script is the structural backstop for the one rule that does not
 * currently work: `@shadcn/lint`'s `require-static-classes` does not fire on
 * template-literal class names in v0.1.5, and a dynamic className in a footer
 * is a silent killer — Tailwind's scanner cannot see it, so the style simply
 * never ships. The check below is deliberately dumb and strict.
 */

import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { FOOTERS } from "../src/footers-meta.ts";
import { validateRegistryItem, type RegistryItem } from "../src/schema.ts";

const HERE = dirname(fileURLToPath(import.meta.url));
const PKG = resolve(HERE, "..");
const FOOTERS_DIR = join(PKG, "src", "footers");
const SITE_PUBLIC = resolve(PKG, "..", "..", "apps", "site", "public", "r");
const GENERATED_SOURCES = join(PKG, "src", "generated", "sources.ts");
const GENERATED_COMPONENTS = join(PKG, "src", "generated", "components.ts");

/** A class name can end in a letter, digit, `-`, `_`, `/`, `:` or `[`. */
const ENDS_MID_TOKEN = /[A-Za-z0-9\-_/:[]$/;
const validateOnly = process.argv.includes("--validate-only");

/**
 * Structural check for computed Tailwind classes.
 *
 * The dangerous shape is a class *fragment* built at runtime:
 *
 *   BAD   className={`bg-${color}`}      -> "bg-red-500" never exists in the source
 *   BAD   className={"bg-" + color}
 *
 * The safe shape passes a consumer's className through a slot after writing
 * every static class out in full:
 *
 *   OK    className={`bg-background ${className}`}
 *
 * So we flag an interpolation only when the text immediately before it ends
 * mid-token — that is, the previous character could still be part of a class
 * name. A preceding space, `{` or backtick means it is a slot, not a fragment.
 */

/**
 * Extracts every `className={...}` expression, brace-balanced.
 *
 * A regex cannot do this: `className={`bg-${tone}`}` contains a `}` inside the
 * interpolation, so a lazy match stops in the wrong place and the check then
 * sees a truncated fragment and quietly finds nothing. That is exactly how a
 * guard turns into decoration, so we scan properly — tracking strings,
 * template literals and nested `${}` blocks.
 */
function extractClassNameExpressions(source: string): string[] {
  const expressions: string[] = [];
  const attribute = /className\s*=\s*\{/g;
  let match: RegExpExecArray | null;

  while ((match = attribute.exec(source)) !== null) {
    let i = match.index + match[0].length;
    const start = i;
    let depth = 1;

    while (i < source.length && depth > 0) {
      const char = source[i];

      if (char === "{") {
        depth += 1;
        i += 1;
        continue;
      }
      if (char === "}") {
        depth -= 1;
        i += 1;
        continue;
      }

      if (char === "`" || char === '"' || char === "'") {
        const quote = char;
        i += 1;
        while (i < source.length) {
          if (source[i] === "\\") {
            i += 2;
            continue;
          }
          if (source[i] === quote) {
            i += 1;
            break;
          }
          // `${ ... }` inside a template may itself contain braces.
          if (quote === "`" && source[i] === "$" && source[i + 1] === "{") {
            let inner = 1;
            i += 2;
            while (i < source.length && inner > 0) {
              if (source[i] === "{") inner += 1;
              else if (source[i] === "}") inner -= 1;
              i += 1;
            }
            continue;
          }
          i += 1;
        }
        continue;
      }

      i += 1;
    }

    expressions.push(source.slice(start, Math.max(start, i - 1)));
  }

  return expressions;
}

function findComputedClasses(source: string): string[] {
  const problems: string[] = [];

  for (const expression of extractClassNameExpressions(source)) {
    // Template literals: `a ${x} b` is a slot; `bg-${x}` is a fragment.
    for (const literal of expression.matchAll(/`([\s\S]*?)`/g)) {
      const body = literal[1] ?? "";
      for (const slot of body.matchAll(/\$\{/g)) {
        if (ENDS_MID_TOKEN.test(body.slice(0, slot.index))) {
          problems.push("template literal className with an interpolated class fragment");
        }
      }
    }

    // Concatenation: `"bg-" + color`.
    for (const fragment of expression.matchAll(/["'`]([^"'`]*)["'`]\s*\+/g)) {
      if (ENDS_MID_TOKEN.test(fragment[1] ?? "")) {
        problems.push("concatenated className with an interpolated class fragment");
      }
    }
  }

  return [...new Set(problems)];
}

async function readFooterSource(name: string): Promise<string> {
  const path = join(FOOTERS_DIR, `${name}.tsx`);
  if (!existsSync(path)) {
    throw new Error(`missing source: ${path}`);
  }
  return readFile(path, "utf8");
}

async function main(): Promise<void> {
  const errors: string[] = [];
  const items: RegistryItem[] = [];
  // Every .tsx in src/footers must be declared in FOOTERS. An undeclared file
  // ships in the repo but never reaches the registry — a silent omission.
  const onDisk = (await readdir(FOOTERS_DIR))
    .filter((file) => file.endsWith(".tsx"))
    .map((file) => file.replace(/\.tsx$/, ""))
    .sort();

  const declared = FOOTERS.map((footer) => footer.name).sort();

  for (const name of onDisk) {
    if (!declared.includes(name)) {
      errors.push(
        `${name}: exists in src/footers but is not declared in FOOTERS. It will never ship.`,
      );
    }
  }
  for (const name of declared) {
    if (!onDisk.includes(name)) {
      errors.push(`${name}: declared in FOOTERS but has no src/footers/${name}.tsx`);
    }
  }

  for (const entry of FOOTERS) {
    const content = await readFooterSource(entry.name);

    for (const problem of findComputedClasses(content)) {
      errors.push(
        `${entry.name}: ${problem}. Tailwind cannot see computed class names, so the style will never be generated. Write every class out in full.`,
      );
    }

    const item: RegistryItem = {
      $schema: "https://ui.shadcn.com/schema/registry-item.json",
      name: entry.name,
      type: "registry:block",
      title: entry.title,
      description: entry.description,
      dependencies: entry.dependencies,
      registryDependencies: [],
      files: [
        {
          path: `components/footer-${entry.name}.tsx`,
          type: "registry:component",
          content,
        },
      ],
      meta: entry.meta,
    };

    for (const problem of validateRegistryItem(item)) {
      errors.push(`${entry.name}: ${problem}`);
    }

    items.push(item);
  }

  if (errors.length > 0) {
    console.error(`\n✖ registry validation failed (${errors.length} problem(s))\n`);
    for (const error of errors) console.error(`  · ${error}`);
    console.error("");
    process.exit(1);
  }

  const stable = items.filter((item) => item.meta.status === "stable");
  const experimental = items.filter((item) => item.meta.status === "experimental");

  if (validateOnly) {
    console.log(`✔ registry valid — ${stable.length} stable, ${experimental.length} experimental`);
    return;
  }

  await mkdir(SITE_PUBLIC, { recursive: true });
  await mkdir(dirname(GENERATED_SOURCES), { recursive: true });

  const index = {
    $schema: "https://ui.shadcn.com/schema/registry.json",
    name: "footer-labs",
    homepage: "https://footer-labs.dev",
    items: items.map((item) => ({
      name: item.name,
      type: item.type,
      title: item.title,
      description: item.description,
      dependencies: item.dependencies,
      registryDependencies: item.registryDependencies,
      files: item.files.map((file) => file.path),
      meta: item.meta,
    })),
  };

  for (const item of items) {
    await writeFile(join(SITE_PUBLIC, `${item.name}.json`), `${JSON.stringify(item, null, 2)}\n`);
  }
  await writeFile(join(SITE_PUBLIC, "registry.json"), `${JSON.stringify(index, null, 2)}\n`);

  /*
   * Emit the sources as a static module so the gallery can show real source
   * without reading the filesystem or dynamically importing a path it cannot
   * statically analyse. Generated file — do not edit.
   */
  const sources = [
    "// GENERATED by scripts/build-registry.ts. Do not edit.",
    "",
    "export const SOURCES: Record<string, string> = {",
    ...items.map(
      (item) => `  ${JSON.stringify(item.name)}: ${JSON.stringify(item.files[0]?.content ?? "")},`,
    ),
    "};",
    "",
  ].join("\n");
  await writeFile(GENERATED_SOURCES, sources);

  /*
   * Emit the component map too, so adding a footer is a two-step change
   * (write the file, add the metadata) rather than three. Fewer places to
   * forget is the entire point — see the undeclared-file check above.
   *
   * Convention: a footer's component is its DEFAULT export.
   */
  const components = [
    "// GENERATED by scripts/build-registry.ts. Do not edit.",
    "",
    'import type { ComponentType } from "react";',
    ...items.map((item) => `import ${item.name} from "../footers/${item.name}";`),
    "",
    "export const COMPONENTS: Record<string, ComponentType<Record<string, unknown>>> = {",
    ...items.map(
      (item) =>
        `  ${JSON.stringify(item.name)}: ${item.name} as ComponentType<Record<string, unknown>>,`,
    ),
    "};",
    "",
  ].join("\n");
  await writeFile(GENERATED_COMPONENTS, components);

  console.log(
    `✔ registry built — ${stable.length} stable, ${experimental.length} experimental → apps/site/public/r`,
  );
}

await main();
