# sujeet-pro.github.io

A portfolio site for Sujeet Jaiswal's open source projects, built with `@pagesmith/site` and deployed at `https://projects.sujeet.pro`.

## Commands

- `npm run dev` - start the Vite+ + Pagesmith SSG dev server
- `npm run build` - build the static site to `dist/`
- `npm run preview` - preview the built site
- `npm run check` - run vite-plus format/lint checks plus type-aware TypeScript checking
- `npm run lint` - lint the project with vite-plus
- `npm run format` - format the project with vite-plus
- `npm test` - run the test suite through vite-plus
- `npm run typecheck` - run the TypeScript compiler in no-emit mode
- `npm run validate` - composed validator (content + build output + portfolio cross-references)
- `npm run render:diagrams` - render every diagram source under `content/`

## Architecture

- `pagesmith.config.json5` - site metadata, footer links, theme, search, and ports
- `content.config.ts` - typed Pagesmith collections and markdown configuration
- `content/README.md` - home page markdown/frontmatter
- `content/projects/README.md` - projects index page markdown/frontmatter
- `content/projects/{slug}/README.md` - project detail pages with structured frontmatter
- `content/projects/meta.json5` - manual project ordering
- `src/entry-server.tsx` - SSG route list and HTML rendering entry
- `src/client.ts` - browser runtime bootstrap
- `src/theme.css` - site styles on top of `@pagesmith/site/css/standalone`
- `theme/layouts/*.tsx` - home, listing, project, and not-found layouts

## Adding A Project

1. Create `content/projects/{slug}/README.md` with frontmatter including `title`, `description`, `github`, `docsUrl`, `packages`, `badges`, and `tags`.
2. Add the slug to `content/projects/meta.json5` in the desired order.
3. Add or update the matching featured card in `content/README.md` if the project should appear on the home page.
4. Set `draft: true` in frontmatter to hide unfinished pages from the build.
