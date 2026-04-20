---
name: prj-validate
description: Run the composed validator for this portfolio site (`npm run validate`). Triages content, build-output, and portfolio cross-reference failures and points at the right authoring or render fix. Use when `npm run validate` (or its subcommands) is failing or when adding a new validation rule.
---

# Validate The Portfolio

`scripts/validate.ts` composes three layers of checks:

1. **Content** — `validateContent` from `@pagesmith/site` against `content/`, with collection schemas auto-loaded from `content.config.ts`.
2. **Build output** — `validateBuildOutput` from `@pagesmith/site/build-validator` against `dist/`, including required files (`favicon`, `sitemap.xml`, `robots.txt`, `llms.txt`, `llms-full.txt`, `404.html`), themed `<picture>` pairs, and in-page anchors.
3. **Portfolio cross-references** — every project slug in `content/projects/meta.json5#items` resolves to a non-draft project, every published project appears in `meta.json5#items`, and every site-relative `actions[].link` / `packages[].href` on the home page resolves to a real route.

## When to use

- `npm run validate` failed and the agent needs to map the failure to a fix.
- A new portfolio-level rule needs to be added (extend `scripts/validate.ts`, never spawn a sibling script).
- Verifying release readiness alongside `npm run typecheck` / `npm run build`.

## Read first

- `scripts/validate.ts` — single source of truth for the rule set.
- `node_modules/@pagesmith/site/REFERENCE.md` § "validate" — flag list for the underlying CLI fallback.
- `content.config.ts` — collection schemas drive frontmatter validation.

## Commands

```bash
npm run validate          # all three layers
npm run validate:content  # content only — fast, doesn't need a build
npm run validate:build    # build only — requires `npm run build` to have run
```

The build slice is auto-skipped when `dist/` does not exist.

## Triage matrix

| Failure source | Symptom | Fix |
| --- | --- | --- |
| Frontmatter | `<file>: <field>: …` | Edit the offending markdown frontmatter to match the schema in `content.config.ts`. |
| Forbidden HTML img | `forbids <img>` | Replace `<img>` with a Markdown image or `<picture>` with `<source>` siblings. |
| Missing alt text | `requires alt text` | Add a real, descriptive `alt`. Empty alt is only allowed for purely decorative images. |
| Missing theme variant | `requires light/dark <picture>` | Add the missing `<source media="(prefers-color-scheme: ...)" srcset="...">` and re-render via `prj-render-diagrams`. |
| Required file missing | `dist/sitemap.xml: missing` | Run `npm run build` first; if the file should exist on every build, check the `pagesmith-site build` config. |
| In-page anchor | `links to #foo, no matching id` | Fix the heading or the anchor — not both. Headings determine ids; do not hardcode `id="…"`. |
| Cross-reference | `meta.json5 references missing project slug "<x>"` | Either add the project under `content/projects/<x>/README.md` (use `prj-add-project`) or remove the slug from `meta.json5#items`. |
| Cross-reference | `meta.json5 omits project "<x>"` | Append the slug to `items[]` in a sensible position. |
| Cross-reference | `actions[].link → /foo does not match any rendered project route` | Fix the link or add the missing project. |

## Adding a new rule

Extend `scripts/validate.ts` rather than creating another file:

- Tighten an existing layer by passing more options into `validateContent` / `validateBuildOutput`.
- For project-only rules, append into the `[portfolio-cross-references]` block.
- Push errors into the same `errors[]` array so the final summary stays accurate.
- Preserve the JSON-friendly output shape — the script is wired to be CI-readable.

## Verify

```bash
npm run validate
```

Must end with `Summary: 0 error(s), 0 warning(s) — PASSED` before merge.

## Related skills

- [`prj-review-content`](../prj-review-content/SKILL.md) — full pre-merge audit (calls this validator).
- [`prj-render-diagrams`](../prj-render-diagrams/SKILL.md) — most diagram failures are render-driven.
- [`pagesmith-site-setup`](../pagesmith-site-setup/SKILL.md) — when you need to change the validator's underlying behavior.
