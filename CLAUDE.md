# Project: sujeet-pro.github.io

A portfolio site for Sujeet Jaiswal's open source projects, built with `@pagesmith/site` and `diagramkit`. Deployed at `https://projects.sujeet.pro`.

## Architecture

- `pagesmith.config.json5` — site config, search, footer links, theme, build output
- `diagramkit.config.json5` — diagram render config (`outputDir: "diagrams"`, `defaultTheme: "both"`)
- `content.config.ts` — typed Pagesmith collections and markdown configuration
- `content/README.md` — home page content (curated)
- `content/projects/README.md` — projects listing page content
- `content/projects/{slug}/README.md` — project detail pages
- `content/projects/{slug}/architecture.mermaid` — diagram source (rendered into sibling `diagrams/`)
- `content/projects/meta.json5` — manual project ordering
- `src/entry-server.tsx` — SSG route + HTML rendering entry
- `src/client.ts` — browser runtime bootstrap
- `src/theme.css` — site styles layered on `@pagesmith/site/css/standalone`
- `theme/layouts/*.tsx` — custom home, listing, project, and not-found layouts
- `scripts/validate.ts` — composed validator for content + build + portfolio cross-references
- `scripts/scaffold-skills.mjs` — regenerates `.agents/skills/`, `.claude/skills/`, `.cursor/skills/` pointers from `node_modules/`
- `.pagesmith/markdown-guidelines.md` — repo-local markdown authoring rules

## Commands

- `npm run dev` — Vite + Pagesmith dev server
- `npm run build` — static site build into `dist/`
- `npm run preview` — preview the built site
- `npm run check` / `npm run lint` / `npm run format` / `npm run typecheck` / `npm test`
- `npm run validate` — composed validator (content + build + portfolio cross-references)
- `npm run validate:content` — content-only slice
- `npm run validate:build` — build-output-only slice (requires `npm run build` first)
- `npm run render:diagrams` — `diagramkit render content/`
- `npm run render:diagrams:watch` — watch mode
- `npm run render:diagrams:check` — `diagramkit validate content/ --recursive`

## Skills

This repo uses a three-folder skill layout: canonical pointers under `.agents/skills/`, mirrored to `.claude/skills/` and `.cursor/skills/` so every harness picks up the same set.

- `diagramkit-*` — thin pointers that defer to `node_modules/diagramkit/skills/<name>/SKILL.md` (version-pinned to the installed `diagramkit`).
- `pagesmith-site-*` — thin pointers that defer to `node_modules/@pagesmith/site/skills/<name>/SKILL.md`.
- `prj-*` — project-specific skills hand-authored for this portfolio:
  - `prj-add-project` — add or update a project entry from `github.com/sujeet-pro/<repo>`.
  - `prj-update-docs` — coordinated portfolio refresh against upstream repos.
  - `prj-render-diagrams` — render every diagram source under `content/`.
  - `prj-review-content` — pre-merge audit covering diagrams (re-render + WCAG 2.2 AA) and content (frontmatter, links, themed `<picture>`, cross-references).
  - `prj-validate` — `npm run validate` triage matrix.

After `npm install diagramkit` or `npm install @pagesmith/site`, run `node scripts/scaffold-skills.mjs` so the pointer descriptions track the new package versions.

## Adding A Project

Follow `.claude/skills/prj-add-project/SKILL.md` (it defers to `.agents/skills/prj-add-project/SKILL.md`). Verify with `npm run validate`.

## Reference

- `node_modules/@pagesmith/site/REFERENCE.md` — full `@pagesmith/site` API + CLI surface.
- `node_modules/diagramkit/REFERENCE.md` — full `diagramkit` API + CLI surface.
- `.pagesmith/markdown-guidelines.md` — markdown authoring rules.
