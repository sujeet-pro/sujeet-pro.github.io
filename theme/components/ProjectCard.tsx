import { withTrailingSlash } from "@pagesmith/site";
import type { ProjectRecord } from "../lib/projects";
import { buildNpmVersionBadge } from "../lib/projects";

type Props = {
  project: ProjectRecord;
};

export function ProjectCard({ project }: Props) {
  const { frontmatter } = project;
  const projectUrl = withTrailingSlash(project.path);

  return (
    <li class="site-project-card">
      <div class="site-project-card-body">
        <div class="site-project-card-top">
          <a class="site-project-card-title" href={projectUrl}>
            {frontmatter.title}
          </a>
          {frontmatter.tags[0] ? (
            <span class="site-project-card-tag">{frontmatter.tags[0]}</span>
          ) : null}
        </div>
        <p class="site-project-card-desc">{frontmatter.description}</p>
        {frontmatter.tags.length > 0 ? (
          <div class="site-tag-list" aria-label="Project tags">
            {frontmatter.tags.map((tag) => (
              <span class="site-pill">{tag}</span>
            ))}
          </div>
        ) : null}
        {frontmatter.packages.length > 0 ? (
          <div class="site-project-packages-list">
            {frontmatter.packages.map((pkg) => (
              <a class="site-project-pkg" href={pkg.url} target="_blank" rel="noopener noreferrer">
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
        ) : null}
      </div>
      <div class="site-project-card-actions">
        <a class="site-project-card-action site-project-card-action-primary" href={projectUrl}>
          View project
        </a>
        <a
          class="site-project-card-action"
          href={frontmatter.github}
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>
        {frontmatter.docsUrl ? (
          <a
            class="site-project-card-action"
            href={frontmatter.docsUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Docs
          </a>
        ) : null}
      </div>
    </li>
  );
}
