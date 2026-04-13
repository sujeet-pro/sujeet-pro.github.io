# Project: sujeet-pro.github.io

A project portfolio site built with `@pagesmith/core`, deployed to `https://projects.sujeet.pro`.

## Architecture

- **@pagesmith/core** for content layer, markdown rendering, JSX runtime, and SSG via Vite
- Custom layouts in `layouts/` (Home listing, Project detail, NotFound)
- Content in `content/projects/{slug}/README.md` with `ProjectFrontmatterSchema` frontmatter
- Site config in `content/site.json5`, project ordering in `content/projects/meta.json5`
- SSR entry in `entry-server.tsx` with `getRoutes()` and `render()`

## Key files

- `pagesmith.config.ts` — collection definitions (projects)
- `entry-server.tsx` — route generation and page rendering
- `content/site.json5` — site metadata (origin, name, social links, copyright)
- `content/projects/meta.json5` — manual project ordering
- `layouts/Home.tsx` — auto-lists non-draft projects with title, description, links
- `layouts/Project.tsx` — individual project page with TOC sidebar

## Commands

- `npm run dev` — start Vite dev server
- `npm run build` — build static site to `dist/`
- `npm run preview` — preview built site

## Adding a project

1. Create `content/projects/{slug}/README.md` with frontmatter: `title`, `description`, `gitRepo`, `links` (`[{url, text}]`), `tags`
2. Add the slug to `content/projects/meta.json5` `items` array
3. Set `draft: true` in frontmatter to hide from listing

## @pagesmith/core reference

- `node_modules/@pagesmith/core/ai-guidelines/usage.md`
- `node_modules/@pagesmith/core/REFERENCE.md`
