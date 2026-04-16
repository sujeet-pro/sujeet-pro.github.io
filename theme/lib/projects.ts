import {
  buildBreadcrumbs,
  buildSidebarFromEntries,
  sortByManualOrder,
  withBasePath,
} from "@pagesmith/site";
import type { Heading, SiteBreadcrumb, SiteSidebarSection } from "@pagesmith/site/components";
import type { MarkdownEntry } from "@pagesmith/site/ssg-utils";
import type { ProjectFrontmatter, ProjectsMeta } from "../../content.config";

export type ProjectRecord = {
  slug: string;
  path: string;
  html: string;
  headings: Heading[];
  frontmatter: ProjectFrontmatter;
};

export function projectPath(basePath: string, slug: string): string {
  return withBasePath(basePath, `/projects/${slug}`);
}

export function orderProjects(
  entries: Array<MarkdownEntry<ProjectFrontmatter>>,
  meta: ProjectsMeta | undefined,
  basePath: string,
): ProjectRecord[] {
  const records = entries.map((entry) => {
    const slug = entry.contentSlug.startsWith("projects/")
      ? entry.contentSlug.slice("projects/".length)
      : entry.contentSlug;

    return {
      slug,
      path: projectPath(basePath, slug),
      html: entry.html,
      headings: entry.headings,
      frontmatter: entry.frontmatter,
    };
  });

  return sortByManualOrder(
    records,
    meta?.items ?? [],
    (r) => r.slug,
    (a, b) => a.frontmatter.title.localeCompare(b.frontmatter.title),
  );
}

export function buildProjectBreadcrumbs(basePath: string, projectTitle: string): SiteBreadcrumb[] {
  return buildBreadcrumbs(basePath, [
    { label: "Home", path: "/" },
    { label: "Projects", path: "/projects" },
    { label: projectTitle },
  ]);
}

export function buildProjectsSidebarSections(
  basePath: string,
  projects: ProjectRecord[],
  title: string = "Projects",
): SiteSidebarSection[] {
  return buildSidebarFromEntries(
    title,
    projects.map((p) => ({ title: p.frontmatter.title, path: p.path })),
    { overviewPath: withBasePath(basePath, "/projects") },
  );
}

export function buildNpmVersionBadge(packageName: string): string {
  return `https://img.shields.io/npm/v/${encodeURIComponent(packageName)}?style=flat-square`;
}
