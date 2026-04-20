---
name: prj-add-project
description: Add or update a project entry in this portfolio (`sujeet-pro.github.io`) by analyzing the corresponding GitHub repo under github.com/sujeet-pro. Wires content under `content/projects/<repo>/`, updates the manual ordering in `content/projects/meta.json5`, and refreshes the matching home-page card in `content/README.md`.
---

# Add Or Update A Portfolio Project

This site is powered by `@pagesmith/site` (see `.agents/skills/pagesmith-site-setup/SKILL.md` for the bootstrap reference) and uses `diagramkit` for project architecture diagrams (see `.agents/skills/diagramkit-mermaid/SKILL.md`).

## When to use

- The user asks to "add a project" / "publish a project to the site".
- The user asks to refresh an existing portfolio entry from the upstream repo.
- A new release is shipped at `github.com/sujeet-pro/<repo>` and the cards need updating.

## Read first

- `node_modules/@pagesmith/site/REFERENCE.md` — content layer + CLI for the installed version.
- `content.config.ts` — collection schemas (`HomeFrontmatterSchema`, `ProjectFrontmatterSchema`, `ProjectsMetaSchema`).
- `content/projects/pagesmith/README.md` and `content/projects/paramanu/README.md` — exemplary project pages.
- `.pagesmith/markdown-guidelines.md` — repo-local markdown rules.

## Workflow

### 1. Detect new vs update

Check whether `content/projects/<repo>/README.md` exists:

- exists → **update** (start from the existing frontmatter and body)
- missing → **new** project

### 2. Pull the repo metadata

Use the `gh` CLI; do **not** clone the source.

```bash
TMPDIR=$(mktemp -d)
gh repo view sujeet-pro/<repo> --json name,description,homepageUrl,url --jq '.' > "$TMPDIR/repo-meta.json"
gh api repos/sujeet-pro/<repo>/tarball -H "Accept: application/octet-stream" \
  | tar xz -C "$TMPDIR" --strip-components=1
```

Then read inside `$TMPDIR`:

1. `README.md` for project overview, philosophy, features.
2. `package.json` (or `packages/*/package.json`) — public package name(s), tech stack hints, scripts that reveal capabilities.
3. `pagesmith.config.{ts,json5}` if present — indicates the project ships its own docs.
4. `docs/` or GitHub Pages config for a docs URL.
5. Any `ai-guidelines/` / `CLAUDE.md` for stated philosophy.

### 3. Verify external links before writing them

- `https://github.com/sujeet-pro/<repo>` — guaranteed by `gh repo view`.
- Docs URL: `gh api repos/sujeet-pro/<repo>/pages --jq '.html_url' 2>/dev/null` and try `https://projects.sujeet.pro/<repo>/`. Confirm with a real fetch.
- npm packages: `npm view <package-name> --json 2>/dev/null` — only include packages that resolve.
- GitHub Actions badges: only include if the workflow file actually exists in the tarball.

### 4. Write the project page

`content/projects/<repo>/README.md` frontmatter (validated by `ProjectFrontmatterSchema` in `content.config.ts`):

```yaml
---
title: <Project Name>
description: >-
  <One-sentence pitch — concise, specific, mentions the differentiator>
tags:
  - <tag>
github: "https://github.com/sujeet-pro/<repo>"
docsUrl: "<verified docs url>"   # omit if not verified
packages:
  - name: "<package>"
    url: "<verified npm url>"
badges:
  - label: "CI"
    image: "<workflow badge url>"
    href: "<workflow url>"
    alt: "<short alt>"
---
```

Body skeleton (match the tone of existing project pages — technical, no marketing fluff):

```markdown
# <Project Name>

<1–3 sentence pitch: problem solved + approach.>

- [GitHub Repository](github-url)
- [Documentation](docs-url)   <!-- only when verified -->
- [npm](npm-url)              <!-- only when relevant -->

## What It Does

- **<Capability>** — <one-line description>
- ...

## Key Features

| Feature       | Description |
| ------------- | ----------- |
| **<Feature>** | <one-line>  |

## Getting Started

\`\`\`bash
# 2–5 line install/use snippet
\`\`\`
```

Optional sections (Tech Stack, Architecture, Roadmap) only when meaningful.

### 5. Update meta + home page

1. Append (or move) the slug in `content/projects/meta.json5#items` so the manual ordering stays sensible.
2. If the project should appear on the home page, add or update its card in `content/README.md` `packages[]`. Keep the home page curated — not every project needs a card.
3. The home-page card `href` must be `/projects/<repo>/` (validated by the portfolio cross-reference rule in `scripts/validate.ts`).

### 6. Architecture diagram (optional but encouraged)

If the project warrants an architecture sketch, add `content/projects/<repo>/architecture.mermaid` and embed it via the `<picture>` pattern:

```html
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="./diagrams/architecture-dark.svg" />
  <img alt="<Project> architecture" src="./diagrams/architecture-light.svg" />
</picture>
```

Then render with `npm run render:diagrams` (delegates to `.agents/skills/diagramkit-mermaid/SKILL.md`).

### 7. Verify

```bash
npm run validate
npm run typecheck
npm run build
```

`npm run validate` covers:
- frontmatter schema for the new project page,
- the new slug exists in `meta.json5#items`,
- the home-page card `href` resolves to a real route.

### 8. Cleanup

```bash
rm -rf "$TMPDIR"
```

## Rules

- Never invent metadata. Every claim must come from the tarball or from a verified URL.
- Match the writing style of existing project pages: technical, sentence-case headings, no emoji.
- Use `draft: true` for unfinished or abandoned projects so they vanish from the build but stay in the repo.
- Keep `content/README.md` `packages[]` in the same order as `content/projects/meta.json5#items` for the projects that appear on both.
- Project tags should be drawn from the existing tag vocabulary unless a new one is genuinely needed.

## Related skills

- [`prj-render-diagrams`](../prj-render-diagrams/SKILL.md) — render any diagrams added with the project.
- [`prj-review-content`](../prj-review-content/SKILL.md) — pre-merge content + diagram audit.
- [`pagesmith-site-setup`](../pagesmith-site-setup/SKILL.md) — site bootstrap reference for collection-level changes.
