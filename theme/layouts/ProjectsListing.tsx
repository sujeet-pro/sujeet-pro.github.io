import type { SiteDocumentData } from "@pagesmith/site/components";
import { SiteDocument } from "@pagesmith/site/components";
import { PageShell } from "@pagesmith/site/layouts";
import type { ListingFrontmatter } from "../../content.config";
import { ProjectCard } from "../components/ProjectCard";
import type { ProjectRecord } from "../lib/projects";
import { buildProjectsSidebarSections } from "../lib/projects";

type Props = {
  content: string;
  frontmatter: ListingFrontmatter;
  slug: string;
  site: SiteDocumentData;
  projects: ProjectRecord[];
};

export default function ProjectsListing({ content, frontmatter, slug, site, projects }: Props) {
  const sidebarSections = buildProjectsSidebarSections(site.basePath ?? "", projects);

  return (
    <SiteDocument
      title={frontmatter.title}
      description={frontmatter.description}
      url={slug}
      socialImage={frontmatter.socialImage}
      site={site}
    >
      <PageShell site={site} currentPath={slug} sidebarSections={sidebarSections} showToc={false}>
        <section class="site-page-intro">
          <p class="site-page-kicker">Projects</p>
          <h1>{frontmatter.title}</h1>
          <p class="site-page-description">{frontmatter.description}</p>
        </section>

        <section class="site-project-listing">
          {content ? <div class="doc-listing-intro prose" innerHTML={content} /> : null}
          <p class="doc-listing-stats">
            {projects.length} project{projects.length === 1 ? "" : "s"} in manual portfolio order.
          </p>
          <ul class="doc-listing-grid">
            {projects.map((project) => (
              <ProjectCard project={project} />
            ))}
          </ul>
        </section>
      </PageShell>
    </SiteDocument>
  );
}
