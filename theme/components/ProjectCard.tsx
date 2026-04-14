import { withTrailingSlash } from "@pagesmith/site";
import type { ProjectRecord } from "../lib/projects";
import { ProjectBadges } from "./ProjectBadges";

type Props = {
  project: ProjectRecord;
};

export function ProjectCard({ project }: Props) {
  const { frontmatter } = project;

  return (
    <li class="site-project-card-item">
      <a class="doc-listing-card site-project-card" href={withTrailingSlash(project.path)}>
        <div class="site-project-card-top">
          <span class="doc-listing-card-title">{frontmatter.title}</span>
          {frontmatter.tags[0] ? (
            <span class="site-project-card-tag">{frontmatter.tags[0]}</span>
          ) : null}
        </div>
        <span class="doc-listing-card-desc">{frontmatter.description}</span>
        {frontmatter.tags.length > 0 ? (
          <span class="site-tag-list" aria-label="Project tags">
            {frontmatter.tags.map((tag) => (
              <span class="site-pill">{tag}</span>
            ))}
          </span>
        ) : null}
        <div class="site-project-card-badges">
          <ProjectBadges badges={frontmatter.badges} packages={frontmatter.packages} limit={4} />
        </div>
      </a>
      <div class="site-project-card-actions">
        <a class="site-project-card-action" href={withTrailingSlash(project.path)}>
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
