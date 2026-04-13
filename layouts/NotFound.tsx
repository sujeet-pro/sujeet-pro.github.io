import type { SiteConfig } from "../lib/config";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { Html } from "./components/Html";

type Props = {
  site: SiteConfig;
};

export default function NotFound({ site }: Props) {
  const bp = site.basePath ?? "";

  return (
    <Html title={`Not Found \u2014 ${site.title}`} site={site}>
      <Header site={site} />
      <main class="main-content main-narrow">
        <div class="not-found">
          <h1>404</h1>
          <p>Page not found.</p>
          <a href={`${bp}/`}>Back to projects</a>
        </div>
        <Footer site={site} />
      </main>
    </Html>
  );
}
