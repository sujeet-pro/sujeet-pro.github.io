---
name: prj-review-content
description: Pre-merge audit for this portfolio site (`sujeet-pro.github.io`). Reviews every project page, the home page, and every diagram source under `content/`, then re-renders diagrams, fixes contrast/structure issues via the diagramkit review skill, runs the @pagesmith/site validators, and reports residual findings. Use before publishing a release, after a bulk content edit, or when something feels off in the rendered site.
---

# Review Portfolio Content + Diagrams

End-to-end audit that combines:

- the diagramkit `diagramkit-review` orchestration (re-render every diagram, validate SVG structure + WCAG 2.2 AA contrast),
- the `@pagesmith/site` content + build validators (frontmatter, links, themed `<picture>` pairs, internal anchors),
- this repo's portfolio cross-reference rules (`scripts/validate.ts` — meta ordering and home-page hrefs).

## When to use

- Pre-merge / pre-release diagram + content health check.
- After bulk-editing project READMEs.
- After a `diagramkit` or `@pagesmith/site` upgrade — verify nothing regressed.
- When a `npm run validate` failure needs to be triaged + fixed end to end.

## Read first

- `node_modules/diagramkit/REFERENCE.md` — version-pinned CLI surface.
- `node_modules/@pagesmith/site/REFERENCE.md` — content + build validator surface.
- `.agents/skills/diagramkit-review/SKILL.md` — diagram audit orchestration.
- `scripts/validate.ts` — the actual rule set this site enforces.
- `.pagesmith/markdown-guidelines.md` — markdown authoring rules.

Confirm both binaries resolve to the local install before doing anything:

```bash
npx diagramkit --version
npx pagesmith-site --version
```

## Workflow

### Phase 1 — Snapshot the current state

```bash
npm run typecheck
npm run lint
npm run validate          # content + build + portfolio cross-references
```

Capture the failure list (path + message). Do not start fixing yet — finish the audit so cross-cutting fixes (e.g. a palette swap that touches multiple SVGs) are batched.

### Phase 2 — Diagram audit (delegated)

Follow `.agents/skills/diagramkit-review/SKILL.md` end to end against `content/` (this is where the project diagrams live; the helper scripts are wired to that subtree):

```bash
npx diagramkit warmup
npx diagramkit render content/ --force --json | tee .temp/diagram-review/render.json
npx diagramkit validate content/ --recursive --json | tee .temp/diagram-review/validate.json
```

For each issue:

1. Map issue code + engine via `node_modules/diagramkit/skills/diagramkit-review/references/issue-fix-matrix.md`.
2. Edit the **source** (`content/projects/<slug>/architecture.mermaid` etc.), never the generated SVG.
3. Re-render only that file with `npx diagramkit render <file> --force --json` and re-validate that file's outputs.
4. Cap the loop at 8 iterations per source; log residuals.

`LOW_CONTRAST_TEXT` is always a fix in this audit — accessibility regressions are not optional.

### Phase 3 — Content audit

For every page under `content/`:

1. **Frontmatter** matches the collection schema in `content.config.ts` (`HomeFrontmatterSchema`, `ListingFrontmatterSchema`, `ProjectFrontmatterSchema`, `ProjectsMetaSchema`). Any extra fields are tolerated (`.passthrough()`), but required fields must be present and well-typed.
2. **Markdown** follows `.pagesmith/markdown-guidelines.md`:
   - one h1, sequential heading depth,
   - alt text on every image, no raw `<img>` tag (validator forbids it),
   - GitHub alerts (`> [!NOTE]`, `> [!TIP]`, …) for callouts,
   - code fences carry a language and use the built-in `title=`, `showLineNumbers`, `mark={…}` meta when useful.
3. **Themed `<picture>`** — every diagram embed must ship both a light and dark `<source>` plus a fallback `<img>` (`requireThemeVariantPairs: true` in `scripts/validate.ts`).
4. **Internal links** resolve to a real markdown file or a built route. The validator already checks this; treat any "missing target" message as an authoring bug, not a validator bug.
5. **External links** stay current. Run `npx pagesmith-site validate --check-external` opportunistically (slow; only on demand).

### Phase 4 — Portfolio cross-references

Re-read `scripts/validate.ts` § "Project-specific cross-references" so the reviewer knows what's enforced on top of `@pagesmith/site`:

- every slug in `content/projects/meta.json5#items` exists as a non-draft project,
- every published project appears in `meta.json5#items`,
- every site-relative `actions[].link` / `packages[].href` on the home page resolves to a real project route.

Fix any drift directly in `content/projects/meta.json5` and `content/README.md`.

### Phase 5 — Re-validate + summary

```bash
npm run build
npm run validate
```

Both must end with `Summary: 0 error(s), 0 warning(s) — PASSED`.

Write a short report at `.temp/content-review/<timestamp>/report.md`:

```markdown
# content review — <ISO-timestamp>

## Diagrams
- Sources audited: <count>
- LOW_CONTRAST_TEXT fixes: <count>
- Residual diagram findings: <list>

## Content
- Pages audited: <count>
- Frontmatter fixes: <list>
- Markdown / link fixes: <list>

## Cross-references
- meta.json5 changes: <list>
- home-page card changes: <list>

## Recommended follow-ups
- <e.g. add CI step for `npm run render:diagrams:check`>
```

## Operating rules

- **Never hand-edit** generated SVGs (`content/projects/*/diagrams/*.svg`). Edit the `.mermaid` source and re-render.
- **Always** force-render after a source edit (`--force`); otherwise the manifest hash skips the rebuild.
- **Respect the `.temp/` convention**: every scratch report and JSON dump goes under `.temp/`. Never write outside `.temp/`.
- **Match the repo's existing voice** when rewriting prose — sentence case, no marketing copy, no emoji.
- **Stop at residuals**: if a fix loop hits 8 iterations on a single source, log it as residual. Do not infinite-loop on engine-level incompatibilities.

## Related skills

- [`diagramkit-review`](../diagramkit-review/SKILL.md) — diagram-only audit (Phase 2 details).
- [`prj-validate`](../prj-validate/SKILL.md) — the lower-level validator wrapper.
- [`prj-add-project`](../prj-add-project/SKILL.md) — when the audit finds missing project entries.
- [`prj-render-diagrams`](../prj-render-diagrams/SKILL.md) — render-only workflow.
