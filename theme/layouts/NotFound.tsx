import { withBasePath } from "@pagesmith/site";
import type { SiteDocumentData } from "@pagesmith/site/components";
import { SiteDocument } from "@pagesmith/site/components";
import { PageShell } from "@pagesmith/site/layouts";

type Props = {
  slug: string;
  site: SiteDocumentData;
};

export default function NotFound({ slug, site }: Props) {
  const basePath = site.basePath ?? "";

  return (
    <SiteDocument
      title={`Not found - ${site.title ?? site.name}`}
      description={site.description}
      url={slug}
      site={site}
    >
      <PageShell site={site} currentPath={slug}>
        <section class="site-not-found">
          <p class="site-page-kicker">404</p>
          <h1>Page not found</h1>
          <p class="site-page-description">
            The page you requested does not exist or may have moved during the site migration.
          </p>
          <div class="doc-hero-actions">
            <a class="doc-hero-action doc-hero-action-brand" href={withBasePath(basePath, "/")}>
              Back home
            </a>
            <a
              class="doc-hero-action doc-hero-action-alt"
              href={withBasePath(basePath, "/projects")}
            >
              Browse projects
            </a>
          </div>
        </section>
      </PageShell>
    </SiteDocument>
  );
}
