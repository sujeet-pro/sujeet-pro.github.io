import { withBasePath } from "@pagesmith/site";
import type { SiteDocumentData } from "@pagesmith/site/components";
import {
  HeroSection,
  SiteDocument,
  SiteFooter,
  SiteHeader,
  SiteSidebar,
} from "@pagesmith/site/components";
import type { SiteAction } from "@pagesmith/site/components";
import type { HomeFrontmatter } from "../../content.config";
import { ProjectCard } from "../components/ProjectCard";
import type { ProjectRecord } from "../lib/projects";

type Props = {
  content: string;
  frontmatter: HomeFrontmatter;
  slug: string;
  site: SiteDocumentData;
  projects: ProjectRecord[];
};

function resolveHref(basePath: string | undefined, value: string | undefined): string | undefined {
  if (!value) return undefined;
  return value.startsWith("/") ? withBasePath(basePath ?? "", value) : value;
}

function getFeaturedProjects(
  featured: HomeFrontmatter["packages"],
  projects: ProjectRecord[],
): ProjectRecord[] {
  const bySlug = new Map(projects.map((p) => [p.slug, p]));
  const result: ProjectRecord[] = [];
  for (const pkg of featured) {
    const slug = pkg.href?.replace(/^\/projects\//, "").replace(/\/$/, "");
    if (slug) {
      const project = bySlug.get(slug);
      if (project) result.push(project);
    }
  }
  return result;
}

export default function Home({ content, frontmatter, slug, site, projects }: Props) {
  const pageTitle = frontmatter.title || site.title || site.name;
  const pageDescription = frontmatter.description || site.description;
  const basePath = site.basePath ?? "";
  const heroText = frontmatter.tagline || frontmatter.title;

  const featuredProjects = getFeaturedProjects(frontmatter.packages, projects);

  const sidebarSections =
    site.navItems && site.navItems.length > 0
      ? [
          {
            title: "Navigation",
            items: site.navItems.map((item) => ({
              title: item.label,
              path: item.path,
            })),
          },
        ]
      : [];

  return (
    <SiteDocument
      title={pageTitle}
      description={pageDescription}
      url={slug}
      socialImage={frontmatter.socialImage}
      site={site}
    >
      <SiteHeader
        siteName={site.name}
        basePath={basePath}
        homeLink={site.homeLink}
        navItems={site.navItems}
        slug={slug}
        searchEnabled={site.search?.enabled}
      />
      <main id="doc-main-content" class="doc-home" tabindex="-1">
        <SiteSidebar sections={sidebarSections} currentSlug={slug} />
        <article class="doc-home-body" data-pagefind-body="">
          <section class="doc-home-section">
            <HeroSection
              tagline={heroText}
              description={pageDescription}
              actions={frontmatter.actions.map(
                (action): SiteAction => ({
                  label: action.text,
                  href: resolveHref(basePath, action.link) ?? "#",
                  variant: action.theme === "alt" ? "secondary" : "primary",
                }),
              )}
              trailingSlash={site.trailingSlash}
            />
          </section>

          {featuredProjects.length > 0 ? (
            <section class="doc-home-section">
              <p class="doc-home-section-label">Featured Projects</p>
              <ul class="doc-listing-grid">
                {featuredProjects.map((project) => (
                  <ProjectCard project={project} />
                ))}
              </ul>
            </section>
          ) : null}

          {content ? (
            <section class="doc-home-content">
              <div class="prose" innerHTML={content} />
            </section>
          ) : null}
        </article>
        <div class="doc-home-footer">
          <SiteFooter
            links={site.footerLinks}
            footerText={site.footerText}
            maintainer={site.maintainer}
            copyright={site.copyright}
          />
        </div>
      </main>
    </SiteDocument>
  );
}
