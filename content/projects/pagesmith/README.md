---
title: Pagesmith
description: >-
  A static site generator for markdown-driven personal projects, with typed layouts and quiet enhancement.
tags:
  - static-site-generator
  - markdown
  - typescript
github: "https://github.com/sujeet-pro/pagesmith"
docsUrl: "https://projects.sujeet.pro/pagesmith/"
packages:
  - name: "@pagesmith/core"
    url: "https://www.npmjs.com/package/@pagesmith/core"
  - name: "@pagesmith/site"
    url: "https://www.npmjs.com/package/@pagesmith/site"
  - name: "@pagesmith/docs"
    url: "https://www.npmjs.com/package/@pagesmith/docs"
badges:
  - label: "CI"
    image: "https://github.com/sujeet-pro/pagesmith/workflows/CI/badge.svg"
    href: "https://github.com/sujeet-pro/pagesmith/blob/main/.github/workflows/ci.yml"
    alt: "CI status for Pagesmith"
---

A static site generator for markdown-driven personal projects, with typed layouts and quiet enhancement. Pagesmith is a filesystem-first content toolkit with three public packages: `@pagesmith/core` (headless content layer), `@pagesmith/site` (site toolkit), and `@pagesmith/docs` (opinionated docs preset).

## Architecture

<div class="diagram-themed">
  <img class="diagram-light" alt="Pagesmith architecture diagram" src="diagrams/architecture-light.svg" />
  <img class="diagram-dark" alt="Pagesmith architecture diagram" src="diagrams/architecture-dark.svg" />
</div>

## What It Does

- **Schema-validated content collections** loaded from the filesystem
- **Lazy markdown rendering** with headings and read-time metadata
- **Framework-agnostic content APIs** for React, Solid, Svelte, vanilla JS, Node, Bun, or Deno
- **Convention-based docs sites** built from markdown content plus a single config file
- **Built-in Pagefind search**, syntax highlighting via Shiki, and automatic navigation from folder structure

## Key Features

| Feature               | Description                                                                  |
| --------------------- | ---------------------------------------------------------------------------- |
| **Filesystem-first**  | Content collections defined by directory structure with schema validation    |
| **Typed layouts**     | Layout overrides via `theme.layouts` with full TypeScript props              |
| **Markdown pipeline** | Fenced code blocks with Shiki, GitHub Alerts, Mermaid diagrams, math support |
| **Zero-config mode**  | Works out of the box when following `docs/` + `gh-pages/` conventions        |
| **Search**            | Built-in Pagefind integration for full-text search                           |
| **AI-first workflow** | Ships AI guidelines, JSON schemas, and MCP server for agent tooling          |

## Getting Started

```bash
npm add @pagesmith/docs
npx pagesmith init --yes --ai
npx pagesmith dev
```
