import type { SsgRenderConfig } from "@pagesmith/core/vite";
import type { ContentEntry } from "@pagesmith/core";
import { join } from "node:path";

import { loadSiteConfig, loadMetaConfig, type SiteConfig, type MetaConfig } from "#lib/config";
import { createSiteContentLayer, loadAllContent, type SiteContent } from "#lib/collections";

import HomeLayout from "./layouts/Home";
import ProjectLayout from "./layouts/Project";
import NotFoundLayout from "./layouts/NotFound";

// ---------------------------------------------------------------------------
// Site data loading (cached per build, fresh per dev request)
// ---------------------------------------------------------------------------

type SiteData = {
  siteConfig: SiteConfig;
  projectsMeta: MetaConfig;
  content: SiteContent;
};

let cache: SiteData | null = null;

async function loadSite(config: SsgRenderConfig): Promise<SiteData> {
  if (!config.isDev && cache) return cache;

  const contentDir = join(config.root, "content");
  const siteConfig = loadSiteConfig(contentDir);
  const projectsMeta = loadMetaConfig(join(contentDir, "projects"));

  const layer = createSiteContentLayer();
  const content = await loadAllContent(layer);

  const result: SiteData = { siteConfig, projectsMeta, content };
  cache = result;
  return result;
}

// ---------------------------------------------------------------------------
// Order projects by meta.json5 items array
// ---------------------------------------------------------------------------

function orderProjects(projects: ContentEntry[], meta: MetaConfig): ContentEntry[] {
  const items = meta.items ?? [];
  if (items.length === 0) return projects;

  const bySlug = new Map(projects.map((p) => [p.slug, p]));
  const ordered: ContentEntry[] = [];

  for (const slug of items) {
    const entry = bySlug.get(slug);
    if (entry) {
      ordered.push(entry);
      bySlug.delete(slug);
    }
  }
  // Append any remaining projects not in the items list
  for (const entry of bySlug.values()) {
    ordered.push(entry);
  }
  return ordered;
}

// ---------------------------------------------------------------------------
// Content link rewriting
// ---------------------------------------------------------------------------

function rewriteContentLinks(html: string, contentRelDir: string, basePath: string): string {
  return html.replace(/href="([^"]+)"/g, (match, rawPath: string) => {
    if (!rawPath.includes("README.md")) return match;
    if (rawPath.startsWith("http:") || rawPath.startsWith("https:") || rawPath.startsWith("data:"))
      return match;

    const resolved = join(contentRelDir, rawPath).replace(/\\/g, "/");
    const slug = resolved.replace(/\/README\.md$/, "");
    return `href="${basePath}/${slug}"`;
  });
}

// ---------------------------------------------------------------------------
// Route generation
// ---------------------------------------------------------------------------

export async function getRoutes(config: SsgRenderConfig): Promise<string[]> {
  const site = await loadSite(config);
  const routes: string[] = ["/"];

  for (const entry of site.content.projects) {
    routes.push(`/projects/${entry.slug}`);
  }

  routes.push("/404");
  return routes;
}

// ---------------------------------------------------------------------------
// Page rendering
// ---------------------------------------------------------------------------

export async function render(url: string, config: SsgRenderConfig): Promise<string> {
  const site = await loadSite(config);

  let path = url;
  if (config.base && path.startsWith(config.base)) {
    path = path.slice(config.base.length) || "/";
  }
  path = path.replace(/\/+$/, "") || "/";

  const jsPath = config.isDev ? `${config.base}/client.ts` : config.jsPath;
  const siteWithAssets: SiteConfig = { ...site.siteConfig, cssPath: config.cssPath, jsPath };

  // ---- Home (project listing) ----
  if (path === "/") {
    const ordered = orderProjects(site.content.projects, site.projectsMeta);
    const bp = siteWithAssets.basePath;

    const projects = ordered.map((entry) => ({
      title: entry.data.title ?? entry.slug,
      description: entry.data.description,
      url: `${bp}/projects/${entry.slug}`,
      gitRepo: entry.data.gitRepo,
      links: entry.data.links ?? [],
    }));

    return String(HomeLayout({ site: siteWithAssets, projects }));
  }

  // ---- Project page ----
  const projectMatch = path.match(/^\/projects\/(.+)$/);
  if (projectMatch) {
    const slug = projectMatch[1];
    const entry = site.content.projects.find((e) => e.slug === slug);

    if (!entry) {
      return String(NotFoundLayout({ site: siteWithAssets }));
    }

    const rendered = await entry.render();
    const bp = siteWithAssets.basePath;
    const contentHtml = rewriteContentLinks(rendered.html, `projects/${slug}`, bp);

    return String(
      ProjectLayout({
        content: contentHtml,
        frontmatter: entry.data,
        headings: rendered.headings,
        slug,
        site: siteWithAssets,
      }),
    );
  }

  // ---- 404 ----
  return String(NotFoundLayout({ site: siteWithAssets }));
}
