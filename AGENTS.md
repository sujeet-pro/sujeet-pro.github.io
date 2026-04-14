# Agent Instructions

This repo is a portfolio site built with `@pagesmith/site`.

## Key Paths

- `pagesmith.config.json5` - site config, footer links, search, theme, and build output
- `content.config.ts` - typed Pagesmith collections and markdown settings
- `content/README.md` - home page content
- `content/projects/README.md` - projects listing page content
- `content/projects/{slug}/README.md` - project detail pages
- `content/projects/meta.json5` - manual project ordering
- `src/entry-server.tsx` - SSG route and render entry
- `src/client.ts` - browser runtime bootstrap
- `src/theme.css` - site styles layered on top of `@pagesmith/site/css/standalone`
- `theme/layouts/*.tsx` - custom site layouts
- `.pagesmith/markdown-guidelines.md` - markdown authoring rules

## Commands

- `npm run dev`
- `npm run build`
- `npm run preview`
- `npm run check`
- `npm run lint`
- `npm run format`
- `npm test`
- `npm run typecheck`

## Pagesmith Guidance

- For bootstrap and retrofit tasks, read `node_modules/@pagesmith/site/ai-guidelines/setup-site.md`
- For operating guidance, read `node_modules/@pagesmith/site/ai-guidelines/usage.md`
- For the full reference, read `node_modules/@pagesmith/site/REFERENCE.md`
- For markdown authoring, read `.pagesmith/markdown-guidelines.md`

## Adding A Project

1. Create `content/projects/{slug}/README.md` with frontmatter such as `title`, `description`, `github`, `docsUrl`, `packages`, `badges`, and `tags`.
2. Add the slug to `content/projects/meta.json5`.
3. Add a matching featured card to `content/README.md` if the project should appear on the home page.
4. Set `draft: true` in frontmatter to hide unfinished pages from the build.
