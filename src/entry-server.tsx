import { loadSiteConfig, normalizeBasePath, parseSiteConfig, withBasePath } from "@pagesmith/site";
import type { SiteDocumentData } from "@pagesmith/site/components";
import type { SsgRenderConfig } from "@pagesmith/site/vite";
import { normalizeRoute } from "@pagesmith/site/ssg-utils";
import type { MarkdownEntry } from "@pagesmith/site/ssg-utils";
import homePage from "virtual:content/homePage";
import projects from "virtual:content/projects";
import projectsIndex from "virtual:content/projectsIndex";
import projectsMeta from "virtual:content/projectsMeta";
import type {
  HomeFrontmatter,
  ListingFrontmatter,
  ProjectFrontmatter,
  ProjectsMeta,
} from "../content.config";
import Home from "../theme/layouts/Home";
import NotFound from "../theme/layouts/NotFound";
import ProjectPage from "../theme/layouts/ProjectPage";
import ProjectsListing from "../theme/layouts/ProjectsListing";
import { buildProjectBreadcrumbs, orderProjects } from "../theme/lib/projects";

type DataEntry<T> = {
  contentSlug: string;
  data: T;
};

const siteConfig = parseSiteConfig(loadSiteConfig());
const homeEntry = (homePage as Array<MarkdownEntry<HomeFrontmatter>>)[0]!;
const projectsIndexEntry = (projectsIndex as Array<MarkdownEntry<ListingFrontmatter>>)[0]!;
const projectEntries = projects as Array<MarkdownEntry<ProjectFrontmatter>>;
const projectsMetaEntry = (projectsMeta as Array<DataEntry<ProjectsMeta>>)[0]?.data;

function buildSite(config: SsgRenderConfig): SiteDocumentData {
  const basePath = normalizeBasePath(config.base ?? siteConfig?.basePath);
  const projectsLabel = projectsMetaEntry?.displayName || "Projects";
  const projectsPath = withBasePath(basePath, "/projects");

  return {
    origin: siteConfig?.origin ?? "",
    name: siteConfig?.name ?? siteConfig?.title ?? "",
    title: siteConfig?.title,
    description: siteConfig?.description,
    language: siteConfig?.language,
    maintainer: siteConfig?.maintainer,
    footerLinks: siteConfig?.footerLinks,
    footerText: siteConfig?.footerText,
    copyright: siteConfig?.copyright,
    search: siteConfig?.search,
    theme: siteConfig?.theme,
    basePath,
    homeLink: withBasePath(basePath, "/"),
    navItems: [
      { path: projectsPath, label: projectsLabel },
      { path: "https://sujeet.pro", label: "Sujeet.pro" },
    ],
    cssPath: config.cssPath,
    jsPath: config.jsPath,
  };
}

function toHtml(node: unknown, includeDoctype: boolean): string {
  const html = String(node);
  return includeDoctype ? `<!DOCTYPE html>${html}` : html;
}

function getOrderedProjects(basePath: string) {
  return orderProjects(projectEntries, projectsMetaEntry, basePath);
}

export function getRoutes(_config: SsgRenderConfig): string[] {
  return [
    "/",
    "/projects",
    "/404",
    ...getOrderedProjects("").map((project) => `/projects/${project.slug}`),
  ];
}

export function render(url: string, config: SsgRenderConfig): string {
  const site = buildSite(config);
  const basePath = site.basePath ?? "";
  const route = normalizeRoute(url, config.base ?? siteConfig?.basePath ?? "");
  const includeDoctype = config.isDev;
  const orderedProjects = getOrderedProjects(basePath);
  const projectBySlug = new Map(orderedProjects.map((project) => [project.slug, project]));

  if (route === "/") {
    return toHtml(
      <Home
        content={homeEntry?.html ?? ""}
        frontmatter={
          homeEntry?.frontmatter ?? {
            title: site.title ?? site.name,
            description: site.description ?? "",
            actions: [],
            packages: [],
          }
        }
        slug={site.homeLink ?? "/"}
        site={site}
      />,
      includeDoctype,
    );
  }

  if (route === "/projects") {
    return toHtml(
      <ProjectsListing
        content={projectsIndexEntry?.html ?? ""}
        frontmatter={
          projectsIndexEntry?.frontmatter ?? {
            title: "Projects",
            description: "Open source projects and tools.",
          }
        }
        slug={withBasePath(basePath, "/projects")}
        site={site}
        projects={orderedProjects}
      />,
      includeDoctype,
    );
  }

  if (route === "/404" || route === "/404.html") {
    return toHtml(<NotFound slug={withBasePath(basePath, "/404")} site={site} />, includeDoctype);
  }

  const projectMatch = route.match(/^\/projects\/(.+)$/);
  if (projectMatch) {
    const project = projectBySlug.get(projectMatch[1]!);
    if (!project) {
      return toHtml(<NotFound slug={withBasePath(basePath, "/404")} site={site} />, includeDoctype);
    }

    return toHtml(
      <ProjectPage
        content={project.html}
        frontmatter={project.frontmatter}
        headings={project.headings}
        slug={project.path}
        site={site}
        breadcrumbs={buildProjectBreadcrumbs(basePath, project.frontmatter.title)}
        projects={orderedProjects}
      />,
      includeDoctype,
    );
  }

  return toHtml(<NotFound slug={withBasePath(basePath, "/404")} site={site} />, includeDoctype);
}
