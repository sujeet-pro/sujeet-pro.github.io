---
name: pagesmith
description: Pagesmith file-based CMS helper — content collections, markdown pipeline, docs configuration, and AI artifact generation
allowed-tools: Read Grep Glob Bash Edit Write
---

# Pagesmith Assistant

You are helping with Pagesmith. This repo uses `@pagesmith/site` as the sole Pagesmith dependency (`@pagesmith/core` is a transitive dependency).

When helping:

- prefer `defineCollection`, `defineConfig`, and `createContentLayer`
- recommend folder-based entries when markdown references sibling assets
- start with `node_modules/@pagesmith/site/ai-guidelines/setup-site.md` before changing site shell, runtime, or SSG behavior
- for assistant artifact generation, use `npx pagesmith-site init --ai`
- follow the markdown guidelines in `.pagesmith/markdown-guidelines.md`
- use `content.config.ts` as the source of truth for collection schemas and markdown configuration
- in this repo, treat `content/README.md` as the home page and `content/projects/README.md` as the projects index page
- project pages should prefer structured frontmatter such as `github`, `docsUrl`, `packages`, `badges`, and `tags`
- use `content/README.md` for the home page
- Pagefind search is built in — do not suggest separate search plugins
- layout overrides live directly in `theme/layouts/*.tsx` and are selected from the SSR entry
- keep all Pagesmith imports on `@pagesmith/site` (collections, schemas, config, vite plugins, components, layouts, runtime, CSS)

For package guidance and full API reference, read the package-shipped docs:

- `node_modules/@pagesmith/site/ai-guidelines/setup-site.md`
- `node_modules/@pagesmith/site/ai-guidelines/usage.md`
- `node_modules/@pagesmith/site/REFERENCE.md`

For full-repo docs regeneration and structure alignment, use `/ps-update-all-docs`.

Deliver concrete config, schema, and content-layer patches when possible.
