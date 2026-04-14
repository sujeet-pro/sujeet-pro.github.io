# Pagesmith Skill

Use this skill when the task involves setting up, extending, migrating, or documenting Pagesmith.

Core rules:

- This repo uses `@pagesmith/site` as the sole Pagesmith dependency — `@pagesmith/core` is a transitive dependency
- prefer `defineCollection`, `defineConfig`, and `createContentLayer`
- start with `node_modules/@pagesmith/site/ai-guidelines/setup-site.md` before changing site shell, preset, runtime, or SSG behavior
- follow the markdown guidelines in `.pagesmith/markdown-guidelines.md`
- use `content.config.ts` as the source of truth for collection schemas and markdown settings
- treat `content/README.md` as the home page and `content/projects/README.md` as the projects index page
- project pages in `content/projects/*/README.md` should use structured frontmatter such as `github`, `docsUrl`, `packages`, `badges`, and `tags`
- `pagesmith.config.json5` should own footer links and high-level site metadata
- built-in search is Pagefind; do not suggest separate search plugin packages
- keep all Pagesmith imports on `@pagesmith/site`

For package usage guidance and full API reference, read:

- `node_modules/@pagesmith/site/ai-guidelines/setup-site.md`
- `node_modules/@pagesmith/site/ai-guidelines/usage.md`
- `node_modules/@pagesmith/site/REFERENCE.md`

Good outputs include:

- collection schemas and loader configuration
- content-layer queries and rendering examples
- documentation updates for Pagesmith usage
- assistant-context install via `npx pagesmith-site init --ai`
