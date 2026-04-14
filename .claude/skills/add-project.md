---
name: add-project
description: Add or update a project in the portfolio by analyzing a GitHub repo under sujeet-pro org
user_invocable: true
arguments:
  - name: repo
    description: Repository name under github.com/sujeet-pro (e.g. "pagesmith")
    required: true
---

# Add/Update Project from GitHub Repo

You are adding or updating a project entry in this portfolio site. The site is powered by `@pagesmith/site`, with:

- home page cards in `content/README.md`
- listing page in `content/projects/README.md`
- project pages in `content/projects/<repo>/README.md`
- manual ordering in `content/projects/meta.json5`

The repo lives at `github.com/sujeet-pro/<repo>`.

## Step 1: Detect new vs update

Check if `content/projects/<repo>/README.md` already exists:

- If it exists, read it — this is an **update**. Use the existing content as a starting point.
- If it doesn't exist, this is a **new** project.

## Step 2: Download and analyze the repo

Use `gh` CLI to download the repo source (do NOT git clone):

```bash
TMPDIR=$(mktemp -d)
gh repo view sujeet-pro/<repo> --json name,description,homepageUrl,url --jq '.' > "$TMPDIR/repo-meta.json"
gh api repos/sujeet-pro/<repo>/tarball -H "Accept: application/octet-stream" | tar xz -C "$TMPDIR" --strip-components=1
```

Then analyze the downloaded code:

1. **Read `README.md`** at the repo root for project overview, philosophy, features
2. **Read `package.json`** (or `packages/*/package.json` for monorepos) to identify:
   - Package name(s) and whether they're public npm packages
   - Dependencies and tech stack
   - Scripts that reveal capabilities
3. **Read `pagesmith.config.ts`** or `pagesmith.config.json` if present (indicates this project uses pagesmith for docs)
4. **Scan for docs configuration** — look for `docs/`, `gh-pages` branch references, GitHub Pages config
5. **Read any `ai-guidelines/` or `CLAUDE.md`** for project philosophy and architecture notes

## Step 3: Verify external links

For each potential link, verify it actually works:

1. **GitHub link**: `https://github.com/sujeet-pro/<repo>` (from `gh repo view`)
2. **Docs URL**: Check if GitHub Pages is enabled:
   ```bash
   gh api repos/sujeet-pro/<repo>/pages --jq '.html_url' 2>/dev/null
   ```
   Also try `https://projects.sujeet.pro/<repo>/` or `https://sujeet-pro.github.io/<repo>/` — verify with a web fetch.
3. **npm packages**: If `package.json` has `"private": false` or no `"private"` field and has a scoped/unscoped name:
   ```bash
   npm view <package-name> --json 2>/dev/null | head -5
   ```
   Only include npm links for packages that actually exist on the registry.

## Step 4: Write the project README

Create/update `content/projects/<repo>/README.md` following this exact structure. Match the tone and format of existing projects (see `content/projects/pagesmith/README.md` or `content/projects/paramanu/README.md` as references).

### Frontmatter

```yaml
---
title: <Project Name>
description: >-
  <One-sentence description — concise, specific, mentions key differentiators>
tags:
  - <relevant-tag>
  - <relevant-tag>
github: "https://github.com/sujeet-pro/<repo>"
docsUrl: "<docs-url>"
packages:
  - name: "<npm-package-name>"
    url: "<npm-package-url>"
badges:
  - label: "CI"
    image: "<workflow-badge-url>"
    href: "<workflow-url>"
    alt: "<badge alt text>"
---
```

- `github` is always included
- Only include `docsUrl` when it was verified to work
- Only include npm packages that were verified to exist on the registry
- Include at least one meaningful badge when a public GitHub Actions workflow exists
- Use `draft: true` if the project is clearly WIP or abandoned

### Body

```markdown
# <Project Name>

<Opening paragraph: 1-3 sentences explaining what problem this solves and the approach taken. Should read as a pitch, not a feature list.>

- [GitHub Repository](github-url)
- [Documentation](docs-url) <!-- only if verified -->
- [npm](npm-org-or-primary-package-url) <!-- only if relevant -->

## What It Does

<3-5 bullet points with bold lead phrases, each explaining a core capability. Use --- for em-dash.>

## Key Features

| Feature       | Description          |
| ------------- | -------------------- |
| **Feature 1** | One-line description |
| ...           | ...                  |

## Getting Started

<Minimal install + first-use code snippet. Keep it to 2-5 lines.>
```

Additional sections (Tech Stack, etc.) are optional — only add if the project has notable technology choices worth highlighting.

## Step 5: Update meta.json5

If this is a **new** project, add the slug to `content/projects/meta.json5` `items` array. Place it in a sensible position (not necessarily last).

## Step 6: Update the home page card list

Keep `content/README.md` in sync with the projects listing:

1. Add or update the matching card in the `packages` array.
2. Use the project title for `name`.
3. Use a concise one-line summary for `description`.
4. Link `href` to `/projects/<repo>/`.
5. Use one short `tag` based on the most representative frontmatter tag.
6. Keep the card order aligned with `content/projects/meta.json5`.

## Step 7: Cleanup

```bash
rm -rf "$TMPDIR"
```

## Important notes

- Do NOT invent or guess information. Every claim must come from the repo source or verified external links.
- Keep the writing style consistent with existing project descriptions — technical but approachable, no marketing fluff.
- If the repo has minimal code or docs, write a shorter description. Don't pad.
- For monorepos, describe the overall project, not each sub-package individually (but mention the package structure).
- Do not forget the curated home page cards in `content/README.md`; the projects listing reads from structured frontmatter, but the home page remains manually curated.
