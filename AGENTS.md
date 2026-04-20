# Agent Instructions

This repo is the portfolio site for Sujeet Jaiswal's open source projects, built with `@pagesmith/site` and rendered diagrams from `diagramkit`. Deployed at `https://projects.sujeet.pro`.

## Key Paths

- `pagesmith.config.json5` — site identity, footer links, search, theme, build output
- `diagramkit.config.json5` — diagram render config (`outputDir: "diagrams"`, `defaultTheme: "both"`)
- `content.config.ts` — typed Pagesmith collections and markdown settings
- `content/README.md` — home page content
- `content/projects/README.md` — projects listing page content
- `content/projects/{slug}/README.md` — project detail pages
- `content/projects/{slug}/architecture.mermaid` — diagram source (rendered into sibling `diagrams/`)
- `content/projects/meta.json5` — manual project ordering
- `src/entry-server.tsx` — SSG route + render entry
- `src/client.ts` — browser runtime bootstrap
- `src/theme.css` — site styles layered on `@pagesmith/site/css/standalone`
- `theme/layouts/*.tsx` — custom site layouts
- `scripts/validate.ts` — composed content + build + portfolio cross-reference validator
- `scripts/scaffold-skills.mjs` — regenerates `.agents/skills/`, `.claude/skills/`, `.cursor/skills/` pointers from `node_modules/`
- `.pagesmith/markdown-guidelines.md` — markdown authoring rules

## Commands

- `npm run dev`
- `npm run build`
- `npm run preview`
- `npm run check` / `npm run lint` / `npm run format` / `npm run typecheck` / `npm test`
- `npm run validate` — composed validator (content + build + portfolio cross-references)
- `npm run validate:content` — content-only slice (fast, no build needed)
- `npm run validate:build` — build-output-only slice (requires `npm run build` first)
- `npm run render:diagrams` — `diagramkit render content/`
- `npm run render:diagrams:watch` — watch mode
- `npm run render:diagrams:check` — `diagramkit validate content/ --recursive`

`npm run validate` runs `validateContent` + `validateBuildOutput` from `@pagesmith/site` against `content/` and `dist/`, auto-loading the schemas declared in `content.config.ts`, then layers on portfolio-specific cross-references (every project slug in `content/projects/meta.json5#items` exists, and every site-relative `actions[].link` / `packages[].href` on the home page resolves to a rendered route). Add or extend rules in `scripts/validate.ts` rather than spawning another script.

## Skill Layout

Skills live in three mirrored folders so every harness sees the same set:

- `.agents/skills/<name>/SKILL.md` — canonical pointer (source of truth for non-Claude / non-Cursor agents).
- `.claude/skills/<name>/SKILL.md` — Claude Code mirror, defers to `.agents/skills/<name>/SKILL.md`.
- `.cursor/skills/<name>/SKILL.md` — Cursor mirror, defers to `.agents/skills/<name>/SKILL.md`.

There are three skill families:

| Prefix | Source of truth | Lifecycle |
| --- | --- | --- |
| `diagramkit-*` | `node_modules/diagramkit/skills/<name>/SKILL.md` | Refresh by `npm install diagramkit` then `node scripts/scaffold-skills.mjs`. |
| `pagesmith-site-*` | `node_modules/@pagesmith/site/skills/<name>/SKILL.md` | Refresh by `npm install @pagesmith/site` then `node scripts/scaffold-skills.mjs`. |
| `prj-*` | `.agents/skills/prj-<name>/SKILL.md` | Hand-authored, project-specific. Edit there; harness mirrors auto-regenerate. |

Project-specific skills:

- `prj-add-project` — add or update a project entry from `github.com/sujeet-pro/<repo>`.
- `prj-update-docs` — coordinated portfolio refresh against upstream repos.
- `prj-render-diagrams` — render every diagram source under `content/`.
- `prj-review-content` — pre-merge audit covering diagrams (re-render + WCAG 2.2 AA) and content (frontmatter, links, themed `<picture>`, cross-references).
- `prj-validate` — `npm run validate` triage matrix.

After upgrading `diagramkit` or `@pagesmith/site`, run `node scripts/scaffold-skills.mjs` so the canonical and harness pointers track the new package descriptions.

## Pagesmith + Diagramkit Reference

- `node_modules/@pagesmith/site/REFERENCE.md` — full API + CLI surface for the installed `@pagesmith/site`.
- `node_modules/diagramkit/REFERENCE.md` — full API + CLI surface for the installed `diagramkit`.
- `.pagesmith/markdown-guidelines.md` — repo-local markdown rules.

Always invoke CLIs via `npx pagesmith-site` and `npx diagramkit` so they resolve to the project-local binaries.

## Adding A Project

1. Follow `.agents/skills/prj-add-project/SKILL.md` end to end.
2. Verify with `npm run validate`.
