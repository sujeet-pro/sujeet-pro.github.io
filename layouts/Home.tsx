import type { SiteConfig } from "../lib/config";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { Html } from "./components/Html";

type ProjectLink = { url: string; text: string };

type ProjectItem = {
  title: string;
  description?: string;
  url: string;
  gitRepo?: string;
  links: ProjectLink[];
};

type Props = {
  site: SiteConfig;
  projects: ProjectItem[];
};

const githubIcon =
  '<svg class="link-icon" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>';

export default function Home({ site, projects }: Props) {
  return (
    <Html title={site.title} description={site.description} url="" site={site}>
      <Header site={site} />
      <main class="main-content main-narrow">
        <div class="home-hero">
          <h1 class="home-title">{site.name}</h1>
          <p class="home-tagline">{site.description}</p>
        </div>
        <section class="project-listing">
          <h2 class="listing-heading">Projects</h2>
          <ul class="project-list">
            {projects.map((project) => (
              <li class="project-card">
                <div class="project-card-header">
                  <h3 class="project-card-title">
                    <a href={project.url}>{project.title}</a>
                  </h3>
                  <div class="project-card-links">
                    {project.gitRepo ? (
                      <a
                        href={project.gitRepo}
                        target="_blank"
                        rel="noopener"
                        class="project-link"
                        aria-label={`${project.title} on GitHub`}
                        innerHTML={githubIcon}
                      />
                    ) : null}
                    {project.links.map((link) => (
                      <a href={link.url} target="_blank" rel="noopener" class="project-link">
                        {link.text}
                      </a>
                    ))}
                  </div>
                </div>
                {project.description ? (
                  <p class="project-card-desc">{project.description}</p>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
        <Footer site={site} />
      </main>
    </Html>
  );
}
