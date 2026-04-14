import { withBasePath } from "@pagesmith/site";
import type { SiteBreadcrumb, SiteDocumentData } from "@pagesmith/site/components";
import { SiteDocument } from "@pagesmith/site/components";
import { PageShell } from "@pagesmith/site/layouts";
import type { ProjectFrontmatter } from "../../content.config";
import { ProjectBadges } from "../components/ProjectBadges";
import { ProjectPackages } from "../components/ProjectPackages";
import type { ProjectRecord } from "../lib/projects";
import { buildProjectsSidebarSections } from "../lib/projects";

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
        <header class="site-project-hero">
          <p class="site-page-kicker">Project</p>
          <h1>{frontmatter.title}</h1>
          <p class="site-page-description">{frontmatter.description}</p>

          {frontmatter.tags.length > 0 ? (
            <div class="site-tag-list" aria-label="Project tags">
              {frontmatter.tags.map((tag) => (
                <span class="site-pill site-pill-subtle">{tag}</span>
              ))}
            </div>
          ) : null}

          <ProjectBadges badges={frontmatter.badges} packages={frontmatter.packages} />

          <div class="doc-hero-actions">
            <a
              class="doc-hero-action doc-hero-action-brand"
              href={frontmatter.github}
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
            {frontmatter.docsUrl ? (
              <a
                class="doc-hero-action doc-hero-action-alt"
                href={frontmatter.docsUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Docs
              </a>
            ) : null}
            <a
              class="doc-hero-action doc-hero-action-alt"
              href={withBasePath(basePath, "/projects")}
            >
              All projects
            </a>
          </div>
        </header>

        <ProjectPackages packages={frontmatter.packages} />

        <section class="site-markdown-section">
          <div class="prose" innerHTML={content} />
        </section>
      </PageShell>
    </SiteDocument>
  );
}
