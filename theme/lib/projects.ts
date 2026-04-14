import { withBasePath } from "@pagesmith/site";
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
  const order = new Map((meta?.items ?? []).map((slug, index) => [slug, index]));

  return entries
    .map((entry) => {
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
    })
    .sort((left, right) => {
      const leftOrder = order.get(left.slug);
      const rightOrder = order.get(right.slug);

      if (leftOrder !== undefined && rightOrder !== undefined) {
        return leftOrder - rightOrder;
      }

      if (leftOrder !== undefined) return -1;
      if (rightOrder !== undefined) return 1;

      return left.frontmatter.title.localeCompare(right.frontmatter.title);
    });
}

export function buildProjectBreadcrumbs(basePath: string, projectTitle: string): SiteBreadcrumb[] {
  return [
    { label: "Home", path: withBasePath(basePath, "/") },
    { label: "Projects", path: withBasePath(basePath, "/projects") },
    { label: projectTitle },
  ];
}

export function buildProjectsSidebarSections(
  basePath: string,
  projects: ProjectRecord[],
  title: string = "Projects",
): SiteSidebarSection[] {
  return [
    {
      title,
      items: [
        { title: "Overview", path: withBasePath(basePath, "/projects") },
        ...projects.map((project) => ({
          title: project.frontmatter.title,
          path: project.path,
        })),
      ],
    },
  ];
}

export function buildNpmVersionBadge(packageName: string): string {
  return `https://img.shields.io/npm/v/${encodeURIComponent(packageName)}?style=flat-square`;
}
