import type { SiteBreadcrumb, SiteDocumentData } from "@pagesmith/site/components";
import { SiteDocument } from "@pagesmith/site/components";
import { PageShell } from "@pagesmith/site/layouts";
import type { ProjectFrontmatter } from "../../content.config";
import { ProjectBadges } from "../components/ProjectBadges";
import type { ProjectRecord } from "../lib/projects";
import { buildNpmVersionBadge, buildProjectsSidebarSections } from "../lib/projects";

type Props = {
  content: string;
  frontmatter: ProjectFrontmatter;
  headings: Array<{ depth: number; text: string; slug: string }>;
  slug: string;
  site: SiteDocumentData;
  breadcrumbs?: SiteBreadcrumb[];
  projects: ProjectRecord[];
};

export default function ProjectPage({
  content,
  frontmatter,
  headings,
  slug,
  site,
  breadcrumbs,
  projects,
}: Props) {
  const basePath = site.basePath ?? "";
  const sidebarSections = buildProjectsSidebarSections(basePath, projects);
  const hasPackages = frontmatter.packages.length > 0;
  const singlePackage = frontmatter.packages.length === 1;

  return (
    <SiteDocument
      title={`${frontmatter.title} - ${site.title ?? site.name}`}
      description={frontmatter.description}
      url={slug}
      socialImage={frontmatter.socialImage}
      site={site}
    >
      <PageShell
        site={site}
        currentPath={slug}
        headings={headings}
        breadcrumbs={breadcrumbs}
        sidebarSections={sidebarSections}
      >
        <header class="site-project-header">
          <div class="site-project-header-top">
            <div class="site-project-header-info">
              <h1>{frontmatter.title}</h1>
              <p class="site-project-header-desc">{frontmatter.description}</p>
            </div>
            <div class="site-project-header-links">
              <a
                class="site-project-link site-project-link-primary"
                href={frontmatter.github}
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
              {frontmatter.docsUrl ? (
                <a
                  class="site-project-link"
                  href={frontmatter.docsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Docs
                </a>
              ) : null}
            </div>
          </div>

          {frontmatter.tags.length > 0 ? (
            <div class="site-tag-list" aria-label="Project tags">
              {frontmatter.tags.map((tag) => (
                <span class="site-pill">{tag}</span>
              ))}
            </div>
          ) : null}

          <ProjectBadges badges={frontmatter.badges} />

          {hasPackages ? (
            <div class="site-project-packages-row">
              <span class="site-project-packages-label">
                {singlePackage ? "Package" : "Packages"}
              </span>
              <div class="site-project-packages-list">
                {frontmatter.packages.map((pkg) => (
                  <a
                    class="site-project-pkg"
                    href={pkg.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <code class="site-project-pkg-name">{pkg.name}</code>
                    <img
                      class="site-badge-image"
                      src={buildNpmVersionBadge(pkg.name)}
                      alt={`npm version for ${pkg.name}`}
                      loading="lazy"
                    />
                  </a>
                ))}
              </div>
            </div>
          ) : null}
        </header>

        <section class="site-markdown-section">
          <div class="prose" innerHTML={content} />
        </section>
      </PageShell>
    </SiteDocument>
  );
}
