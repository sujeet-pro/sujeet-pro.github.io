import type { ProjectPackage } from "../../content.config";
import { buildNpmVersionBadge } from "../lib/projects";

type Props = {
  packages?: ProjectPackage[];
};

export function ProjectPackages({ packages = [] }: Props) {
  if (packages.length === 0) return null;

  return (
    <section class="site-package-section" aria-labelledby="project-packages-heading">
      <p class="doc-home-section-label">Published Packages</p>
      <div class="site-section-heading">
        <h2 id="project-packages-heading">Packages on npm</h2>
        <p>NPM packages exported by this project.</p>
      </div>
      <div class="doc-packages site-package-grid">
        {packages.map((pkg) => (
          <a href={pkg.url} target="_blank" rel="noopener noreferrer" class="doc-package-card">
            <div class="doc-package-name">{pkg.name}</div>
            <p class="doc-package-desc">View the published package and version details on npm.</p>
            <div class="doc-package-meta">
              <span class="doc-package-tag">npm</span>
            </div>
            <img
              class="site-badge-image"
              src={buildNpmVersionBadge(pkg.name)}
              alt={`npm version for ${pkg.name}`}
              loading="lazy"
            />
          </a>
        ))}
      </div>
    </section>
  );
}
