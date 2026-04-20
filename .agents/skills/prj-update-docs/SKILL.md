---
name: prj-update-docs
description: Refresh portfolio content (`content/`) for `sujeet-pro.github.io` against the upstream project repos and the latest `@pagesmith/site` reference. Updates project READMEs, the home page, and the projects listing so the published site reflects the current state of every linked repo.
---

# Update Portfolio Docs

Pull the latest reality from each upstream repo and reconcile this portfolio's content against it. Aimed at periodic refreshes (post-release sweeps, AGENTS/CLAUDE updates) — not a single-project add (use `prj-add-project` for that).

## When to use

- A coordinated update across multiple project pages.
- After a `@pagesmith/site` upgrade — verify the content layer assumptions still hold.
- Before a release sweep where stale claims need to be scrubbed.
- After renaming an upstream repo or deprecating a project.

## Read first

- `node_modules/@pagesmith/site/REFERENCE.md` — content layer + CLI surface for the installed version.
- `pagesmith.config.json5` — site identity, footer, theme, search.
- `content.config.ts` — collection schemas (treat as source of truth).
- `content/projects/meta.json5` — manual ordering. Items in `items[]` define the displayed order on the listing page.
- `.pagesmith/markdown-guidelines.md` — repo-local markdown rules.

## Workflow

### 1. Inventory

List every project under `content/projects/*/README.md` and group as:

- **published** — `draft` is unset or `false`.
- **draft** — `draft: true` (still in repo, not in build).

For each published project, note its `github` URL.

### 2. Refresh per project (delegate to `prj-add-project`)

For each project that needs an update, follow `.agents/skills/prj-add-project/SKILL.md` § "update" path:

- pull the upstream tarball,
- re-derive `description`, `tags`, `packages`, `badges` from the source of truth,
- verify all external links (docs URL, npm, badge URLs),
- rewrite the body where the upstream README has materially changed.

Batch the changes — do not commit one project at a time when you can finish a sweep in a single PR.

### 3. Reconcile listing + ordering

- Every published project must have a slug in `content/projects/meta.json5#items` (enforced by `npm run validate`).
- Every slug in `items[]` must resolve to a non-draft project.
- If the upstream repo was renamed, rename the folder under `content/projects/`, update `meta.json5`, and the home-page card.

### 4. Reconcile the home page

`content/README.md` is curated, not auto-generated. After per-project updates:

- `packages[]` cards reflect the most current pitch lines.
- Card order matches `meta.json5#items` for projects that appear on both.
- `actions[]` link targets still resolve (`/projects/<slug>/`).
- `badge` field still represents reality (drop "new" badges that have aged out).

### 5. Refresh diagrams

If any project's architecture diagram source changed, follow `.agents/skills/prj-render-diagrams/SKILL.md` so the rendered SVGs stay in sync.

### 6. Verify

```bash
npm run typecheck
npm run lint
npm run validate          # full pipeline (content + build + cross-references)
npm run build
```

If `validate` fails, follow `.agents/skills/prj-validate/SKILL.md` triage matrix.

For diagram-heavy edits, run `.agents/skills/prj-review-content/SKILL.md` instead — it includes the diagramkit re-render + WCAG 2.2 AA pass.

## Operating rules

- **Source of truth wins.** If the upstream repo says X and the portfolio says Y, change Y unless there's an explicit editorial reason.
- **No invented metadata.** Every claim, package name, badge URL must come from the upstream source or a verified URL.
- **Preserve curation.** The home page is curated — do not auto-add every project there. Keep card order intentional.
- **Match the existing voice.** Sentence-case headings, no marketing copy, no emoji, prefer technical precision over salesy phrasing.
- **Use `draft: true`** to hide a project that's currently abandoned but still worth keeping in the repo for history.

## Related skills

- [`prj-add-project`](../prj-add-project/SKILL.md) — the per-project add/update workflow this skill delegates to.
- [`prj-review-content`](../prj-review-content/SKILL.md) — full audit including diagram WCAG 2.2 AA pass.
- [`prj-validate`](../prj-validate/SKILL.md) — triage matrix for `npm run validate` failures.
- [`prj-render-diagrams`](../prj-render-diagrams/SKILL.md) — render-only workflow.
- [`pagesmith-site-customize-theme`](../pagesmith-site-customize-theme/SKILL.md) — when site chrome needs editing alongside content.
