---
name: prj-render-diagrams
description: Render every diagram source under `content/` for this portfolio (`sujeet-pro.github.io`). Wraps `npm run render:diagrams` (and the watch / check variants) and points at the right engine skill when a render fails. Use when diagram sources changed, when adding a new project's `architecture.mermaid`, or to refresh stale outputs before a build.
---

# Render Portfolio Diagrams

This site stores diagram sources alongside each project (e.g. `content/projects/<slug>/architecture.mermaid`) and writes the rendered SVGs into a sibling `diagrams/` folder. The naming convention is driven by `diagramkit.config.json5#outputDir = "diagrams"`.

## When to use

- A `.mermaid` / `.excalidraw` / `.drawio` / `.dot` source under `content/` was added or edited.
- Outputs in `content/projects/<slug>/diagrams/` look stale (size mismatch, manifest hash drift).
- A `prj-review-content` audit asked for a forced re-render.
- Setting up a new project that ships an architecture diagram.

## Read first

- `node_modules/diagramkit/REFERENCE.md` — version-pinned CLI surface.
- `diagramkit.config.json5` — local overrides (`outputDir: "diagrams"`, `defaultFormats: ["svg"]`, `defaultTheme: "both"`, `useManifest: true`).
- The matching engine skill for any new diagram type:
  - Mermaid → `.agents/skills/diagramkit-mermaid/SKILL.md`
  - Excalidraw → `.agents/skills/diagramkit-excalidraw/SKILL.md`
  - Draw.io → `.agents/skills/diagramkit-draw-io/SKILL.md`
  - Graphviz → `.agents/skills/diagramkit-graphviz/SKILL.md`

## Commands

```bash
npm run render:diagrams         # diagramkit render content/
npm run render:diagrams:watch   # diagramkit render content/ --watch
npm run render:diagrams:check   # diagramkit validate content/ --recursive
```

For ad-hoc renders during authoring:

```bash
npx diagramkit warmup                                            # once per machine
npx diagramkit render content/projects/<slug>/architecture.mermaid
npx diagramkit render content/ --force --json                    # ignore manifest cache
npx diagramkit render content/ --dry-run                         # preview without writing
```

## Embedding the output

Every diagram is rendered for both `light` and `dark` themes. Embed via the `<picture>` pattern (the validator enforces both sources to be present):

```html
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="./diagrams/architecture-dark.svg" />
  <source media="(prefers-color-scheme: light)" srcset="./diagrams/architecture-light.svg" />
  <img alt="<Project> architecture" src="./diagrams/architecture-light.svg" />
</picture>
```

Use a relative path (`./diagrams/...`) so the resolver works from the project README.

## Workflow for a new diagram

1. Pick the engine via `.agents/skills/diagramkit-auto/SKILL.md` (mermaid is the default for architecture sketches).
2. Drop the source at `content/projects/<slug>/architecture.mermaid` (or `.excalidraw`, `.drawio`, `.dot`).
3. Run `npm run render:diagrams`. Verify both `diagrams/architecture-light.svg` and `diagrams/architecture-dark.svg` exist plus `diagrams/manifest.json`.
4. Add the `<picture>` block to the project README.
5. Run `npm run validate` — themed-pair + alt-text checks must pass.

## Troubleshooting

| Symptom | Fix |
| --- | --- |
| `Playwright Chromium not installed` | `npx diagramkit warmup`. Skip only on Graphviz-only sources. |
| Output dimensions look wrong / labels truncated | Edit the source per the engine skill's authoring guidance, then re-render with `--force`. |
| Manifest skipped a file you just edited | The hash matches an older render. Run with `--force` (or delete the entry from `diagrams/manifest.json`). |
| Light-only or dark-only output | `defaultTheme` is `both`; check for an `overrides` entry in `diagramkit.config.json5` that scopes a single theme. |
| `LOW_CONTRAST_TEXT` after render | Switch to the engine's WCAG 2.2 AA palette (see `.agents/skills/diagramkit-review/SKILL.md`). |
| Need PNG/JPEG rasters | `npm add sharp`, then `npx diagramkit render <file> --format svg,png,webp --scale 2`. |

## Operating rules

- **Never hand-edit** anything inside `content/projects/*/diagrams/`. Edit the source and re-render.
- **Commit both** the source diagram **and** the rendered SVGs + `manifest.json`. Hosted CI does not have Chromium installed.
- **Use the npm scripts** for full-tree renders so `outputDir`, theme, and manifest behavior stay consistent. Use `npx diagramkit ...` only for one-off file renders during authoring.

## Related skills

- [`diagramkit-setup`](../diagramkit-setup/SKILL.md) — bootstrap diagramkit when a fresh checkout is missing the install.
- [`diagramkit-auto`](../diagramkit-auto/SKILL.md) — picks the best engine for a new diagram request.
- [`diagramkit-review`](../diagramkit-review/SKILL.md) — full audit including WCAG 2.2 AA contrast.
- [`prj-review-content`](../prj-review-content/SKILL.md) — pre-merge content + diagram audit.
