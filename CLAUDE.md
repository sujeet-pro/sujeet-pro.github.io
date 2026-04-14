# Project: sujeet-pro.github.io

A portfolio site for Sujeet Jaiswal's open source projects, built with `@pagesmith/site` and deployed at `https://projects.sujeet.pro`.

## Architecture

- `pagesmith.config.json5` - site config, search, footer links, theme, and build output
- `content.config.ts` - typed Pagesmith collections and markdown configuration
- `content/README.md` - home page content
- `content/projects/README.md` - projects listing page content
- `content/projects/{slug}/README.md` - project detail pages
- `content/projects/meta.json5` - manual project ordering
- `src/entry-server.tsx` - SSG route and HTML rendering entry
- `src/client.ts` - browser runtime bootstrap
- `src/theme.css` - site styles
- `theme/layouts/*.tsx` - custom home, listing, project, and not-found layouts
- `.pagesmith/markdown-guidelines.md` - repo-local markdown authoring rules

## Commands

- `npm run dev` - start the custom Vite+ Pagesmith site dev server
- `npm run build` - build the static site to `dist/`
- `npm run preview` - preview the built site
- `npm run check` - run OXC format/lint checks plus type-aware TypeScript checking
- `npm run lint` - lint the project with OXC
- `npm run format` - format the project with OXC
- `npm test` - run the Vitest suite through Vite+
- `npm run typecheck` - run the TypeScript compiler in no-emit mode

## Adding A Project

1. Create `content/projects/{slug}/README.md` with frontmatter such as `title`, `description`, `github`, `docsUrl`, `packages`, `badges`, and `tags`.
2. Add the slug to `content/projects/meta.json5` in the desired order.
3. Add a matching featured card to `content/README.md` so the home page stays curated.
4. Set `draft: true` in frontmatter to hide a project from the build.

## Pagesmith Reference

- For bootstrap and retrofit work: `node_modules/@pagesmith/site/ai-guidelines/setup-site.md`
- For operating guidance: `node_modules/@pagesmith/site/ai-guidelines/usage.md`
- For the full reference: `node_modules/@pagesmith/site/REFERENCE.md`
- For markdown authoring rules: `.pagesmith/markdown-guidelines.md`
