import type { SiteConfig } from "../lib/config";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { Html } from "./components/Html";
import { TOC } from "./components/TOC";

type Heading = { depth: number; text: string; slug: string };

type Props = {
  content: string;
  frontmatter: Record<string, any>;
  headings: Heading[];
  slug: string;
  site: SiteConfig;
};

export default function Project({ content, frontmatter, headings, slug, site }: Props) {
  const bp = site.basePath ?? "";

  return (
    <Html
      title={`${frontmatter.title} \u2014 ${site.title}`}
      description={frontmatter.description}
      url={`projects/${slug}/`}
      site={site}
    >
      <Header site={site} />
      <div class="layout-two-col">
        <div class="main-content">
          <main>
            <article>
              <a href={`${bp}/`} class="back-link">
                &larr; Projects
              </a>
              <div class="prose" data-pagefind-body innerHTML={content} />
            </article>
          </main>
          <Footer site={site} />
        </div>
        <aside class="sidebar sidebar-right">
          <TOC headings={headings} />
        </aside>
      </div>
    </Html>
  );
}
