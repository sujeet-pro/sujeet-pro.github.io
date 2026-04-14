import { withBasePath } from "@pagesmith/site";
import type { SiteDocumentData } from "@pagesmith/site/components";
import { SiteDocument, SiteFooter, SiteHeader, SiteSidebar } from "@pagesmith/site/components";
import type { HomeFrontmatter } from "../../content.config";

type Props = {
  content: string;
  frontmatter: HomeFrontmatter;
  slug: string;
  site: SiteDocumentData;
};

function resolveHref(basePath: string | undefined, value: string | undefined): string | undefined {
  if (!value) return undefined;
  return value.startsWith("/") ? withBasePath(basePath ?? "", value) : value;
}

export default function Home({ content, frontmatter, slug, site }: Props) {
  const pageTitle = frontmatter.title || site.title || site.name;
  const pageDescription = frontmatter.description || site.description;
  const basePath = site.basePath ?? "";
  const heroText = frontmatter.tagline || frontmatter.title;

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
          <section class="doc-home-section doc-hero">
            {heroText ? <h1 class="doc-hero-text">{heroText}</h1> : null}
            {pageDescription ? <p class="doc-hero-tagline">{pageDescription}</p> : null}
            {frontmatter.actions.length > 0 ? (
              <div class="doc-hero-actions">
                {frontmatter.actions.map((action) => (
                  <a
                    class={`doc-hero-action doc-hero-action-${
                      action.theme === "alt" ? "alt" : "brand"
                    }`}
                    href={resolveHref(basePath, action.link)}
                  >
                    {action.text}
                  </a>
                ))}
              </div>
            ) : null}
          </section>

          {frontmatter.packages.length > 0 ? (
            <section class="doc-home-section">
              <p class="doc-home-section-label">Featured Projects</p>
              <div class="doc-packages">
                {frontmatter.packages.map((project) => {
                  const Tag = project.href ? "a" : "div";

                  return (
                    <Tag class="doc-package-card" href={resolveHref(basePath, project.href)}>
                      <div class="doc-package-name">{project.name}</div>
                      <p class="doc-package-desc">{project.description}</p>
                      {project.tag ? (
                        <div class="doc-package-meta">
                          <span class="doc-package-tag">{project.tag}</span>
                        </div>
                      ) : null}
                    </Tag>
                  );
                })}
              </div>
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
