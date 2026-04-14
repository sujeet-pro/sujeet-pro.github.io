<!-- pagesmith-ai:gemini-memory:start -->

# sujeet-pro.github.io

This repo is a custom Pagesmith site built with `@pagesmith/site`.

Use these files as the source of truth:

- `pagesmith.config.json5` for site metadata, footer links, search, theme, and ports
- `content.config.ts` for collection schemas and markdown settings
- `content/README.md` for the home page
- `content/projects/README.md` for the projects index page
- `content/projects/{slug}/README.md` for project detail pages
- `content/projects/meta.json5` for manual ordering
- `src/entry-server.tsx` for routes and rendering
- `theme/layouts/*.tsx` for the site shell and page templates

Project page frontmatter should prefer structured fields:

- `title`
- `description`
- `github`
- `docsUrl`
- `packages` as `[{ name, url }]`
- `badges` as `[{ label, image, href?, alt? }]`
- `tags`
- `draft`

Pagesmith rules:

- start with `node_modules/@pagesmith/site/ai-guidelines/setup-site.md` before changing shell, runtime, or SSG wiring
- keep all Pagesmith imports on `@pagesmith/site` (core is a transitive dependency)
- use folder-based markdown entries when content owns sibling assets
- keep Pagefind as the built-in search layer
- follow `.pagesmith/markdown-guidelines.md` for authored markdown

Commands:

- `npm run dev`
- `npm run build`
- `npm run preview`
- `npm run typecheck`

Useful docs:

- `node_modules/@pagesmith/site/REFERENCE.md`
- `node_modules/@pagesmith/site/ai-guidelines/usage.md`
<!-- pagesmith-ai:gemini-memory:end -->
