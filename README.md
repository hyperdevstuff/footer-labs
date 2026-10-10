# footer-labs

**Tasteful footers, because we care about the end.**

A curated, copy-paste-ready library of landing-page footers for Next.js and
Tailwind v4. Each footer is a single self-contained file — no build step, no
wrapper, no configuration.

```bash
npx shadcn@latest add @footer-labs/quiet-minimal
```

---

## Why

Footers are the last thing anyone designs and the first thing everyone
regrets. They hold the links nobody wants to write, in a region of the page
nobody looks at — and the best ones in the last few years have become some of
the most interesting craft on the web.

This library treats them that way: a small, curated set where each one earns
its place.

## Install

```bash
npx shadcn@latest add @footer-labs/<name>
```

Or copy the source straight from any footer page. There is no runtime
dependency for the majority of footers.

## What you get

| | |
| --- | --- |
| **Self-contained** | One `.tsx` file. Works in a bare `create-next-app`. |
| **Theme-aware** | Uses shadcn semantic tokens, so it re-themes with your project. |
| **Re-themeable** | Every accent is a `--fl-*` custom property with a documented default. |
| **Honest metadata** | Tier, dependency cost, reduced-motion behaviour and known accessibility limits are published per footer. |
| **Attributed** | Technique credits point back at the sites that taught us the trick. |

## Tiers

Every footer is badged with what it costs you to adopt.

| Tier | Meaning |
| --- | --- |
| `css` | Tailwind and CSS only. Zero npm dependencies. |
| `motion` | depends on `motion` |
| `webgl` | needs WebGL, or a shader dependency |

Most of the library is tier `css`, because a footer should never be the reason
your bundle grows.

## Theming

Each footer reads its accent colour from a custom property with a fallback:

```css
color: oklch(0.72 0.16 var(--fl-hue, 265));
```

Three ways to set it, in order of precedence:

```tsx
<QuietMinimal hue={200} />                    // explicit
```

```css
/* theme this footer */
:root { --fl-hue: 200; }
```

```css
/* or do nothing — the fallback is already tasteful */
```

Structural colour (`background`, `foreground`, `muted-foreground`, `border`)
uses shadcn semantic tokens throughout, so footers inherit your theme instead
of fighting it.

## Accessibility

Every footer ships a real `<footer>` landmark, labelled navigation, visible
focus rings, and a `prefers-reduced-motion` path that degrades to something
complete rather than breaking. Where a footer has a known limitation, its page
says so — we would rather you know than find out.

## Typography

footers-labs itself is set in [Inter](https://rsms.me/inter/) for body,
[Geist](https://vercel.com/font) for display, and
[Paper Mono](https://paper.design/mono) for mono — which is derived from Geist
Mono, so the pairing is deliberate rather than assembled.

**Footers never load a font.** They use your `font-sans` and `font-mono` from
your Tailwind theme. Each footer page documents the type pairing it was
designed around, so you can reproduce the intent with whatever you already use.
See [TYPOGRAPHY.md](./TYPOGRAPHY.md).

## Further reading

- [INSPIRATION.md](./INSPIRATION.md) — the shortlist of footers we are studying
- [CREDITS.md](./CREDITS.md) — techniques we took, and from where
- [CONTRIBUTING.md](./CONTRIBUTING.md) — the bar
- [AGENTS.md](./AGENTS.md) — how this repository is structured, and why

## Contributing

Footers are added **one at a time** and are deliberately curated. Please read
[CONTRIBUTING.md](./CONTRIBUTING.md) first — the bar is the product.

## Credits

Technique studies are credited on the footer itself and collected in
[CREDITS.md](./CREDITS.md). The MIT license covers **the code in this
repository**; imagery used for previews is not covered by it.

## License

MIT © [hyperdevstuff](https://github.com/hyperdevstuff)
