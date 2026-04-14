# Pagesmith Markdown Guidelines

Markdown feature support for content authored and rendered through `@pagesmith/site`.

## Pipeline Order

```
remark-parse → remark-gfm → remark-frontmatter
  → remark-github-alerts → remark-smartypants → remark-math (when `markdown.math` is enabled or auto-detected) → [user remark plugins]
  → remark-rehype
  → rehype-mathjax (when math is enabled)
  → applyPagesmithCodeRenderer (dual themes, line numbers, titles, copy, collapse, mark/ins/del)
  → rehype-code-tabs → rehype-scrollable-tables
  → rehype-slug → rehype-autolink-headings
  → rehype-external-links → rehype-accessible-emojis
  → heading extraction → [user rehype plugins] → rehype-stringify
```

## Key Rules

- Use fenced code blocks with a language identifier (validator warns otherwise)
- One `# h1` per page (validator enforces)
- Sequential heading depth (no skipping from h2 to h4)
- Prefer relative links for internal content
- `allowDangerousHtml` defaults to `true`; disable it when rendering untrusted markdown
- `math` defaults to `'auto'`; Pagesmith only enables the math plugins when the page contains math markers
- Do NOT add manual copy-button JS inside markdown content — the built-in renderer injects its own copy/collapse runtime
- Include the shipped Pagesmith markdown CSS so code block chrome and tabs render correctly
- Raw `mermaid`, `dot`, `excalidraw`, and `drawio` fences are source examples, not rendered diagrams, unless the project adds a custom renderer

## Supported Features

| Feature          | Syntax                                                                    | Notes                                 |
| ---------------- | ------------------------------------------------------------------------- | ------------------------------------- |
| GFM tables       | `\| col \| col \|`                                                        | Alignment via `:---`, `:---:`, `---:` |
| Strikethrough    | `~~text~~`                                                                |                                       |
| Task lists       | `- [x] done` / `- [ ] todo`                                               |                                       |
| Footnotes        | `[^id]` + `[^id]: text`                                                   |                                       |
| Alerts           | `> [!NOTE]`, `> [!TIP]`, `> [!IMPORTANT]`, `> [!WARNING]`, `> [!CAUTION]` | GitHub-compatible                     |
| Inline math      | `$E = mc^2$`                                                              | No spaces inside delimiters           |
| Block math       | `$$...$$`                                                                 | Rendered via MathJax                  |
| Smart quotes     | `"text"` → curly quotes                                                   | Automatic                             |
| Em/en dash       | `---` / `--`                                                              | Automatic                             |
| External links   | `[text](https://...)`                                                     | Auto `target="_blank"`                |
| Heading anchors  | Auto `id` + wrapped anchor                                                | All headings                          |
| Accessible emoji | Unicode emoji                                                             | Auto `role="img"` + `aria-label`      |

## Code Block Features (Built-in Renderer)

| Meta               | Example                    | Description            |
| ------------------ | -------------------------- | ---------------------- |
| `title="..."`      | ` ```js title="app.js" `   | File title             |
| `showLineNumbers`  | ` ```js showLineNumbers `  | Line numbers           |
| `mark={lines}`     | ` ```js mark={3,5-7} `     | Highlight lines        |
| `ins={lines}`      | ` ```js ins={4} `          | Inserted lines (green) |
| `del={lines}`      | ` ```js del={5} `          | Deleted lines (red)    |
| `collapse={lines}` | ` ```js collapse={1-5} `   | Collapsible section    |
| `wrap`             | ` ```js wrap `             | Text wrapping          |
| `frame="..."`      | ` ```js frame="terminal" ` | Frame style            |

## Diagrams And Source-Only Fences

Pagesmith does not ship an inline Mermaid, Graphviz, Excalidraw, or draw.io renderer.

- `mermaid`, `dot`, and `plantuml` are highlighted as text
- `excalidraw` is highlighted as JSON and `drawio` as XML
- raw diagram fences publish as code blocks unless the project adds a custom renderer
- for published docs, generate image assets from diagram source and embed the rendered SVG or PNG
- in site projects, use `.only-light` and `.only-dark` when light and dark diagram variants differ
- choose Mermaid for text-first flows, Excalidraw for architecture sketches, draw.io for precise infrastructure diagrams, and Graphviz for dependency graphs

## Built-in Content Validators

- **linkValidator** — warns on bare URLs, empty link text, suspicious protocols
- **headingValidator** — enforces single h1, sequential depth, non-empty text
- **codeBlockValidator** — warns on missing language, unknown meta properties

Known valid meta properties: `title`, `showLineNumbers`, `startLineNumber`, `wrap`, `frame`, `collapse`, `mark`, `ins`, `del`.
