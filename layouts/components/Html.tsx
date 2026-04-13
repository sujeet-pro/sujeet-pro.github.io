import type { SiteConfig } from "../../lib/config";

type Props = {
  title: string;
  description?: string;
  url?: string;
  site: SiteConfig;
  children?: any;
};

const foucScript = `(function(){try{var p=JSON.parse(localStorage.getItem('pagesmith-theme'));if(p){var d=document.documentElement;if(p.colorScheme)d.className=d.className.replace(/color-scheme-\\w+/,'color-scheme-'+p.colorScheme);if(p.theme)d.className=d.className.replace(/theme-\\w[\\w-]*/,'theme-'+p.theme);if(p.textSize&&p.textSize!=='base')d.dataset.textSize=p.textSize}}catch(e){}})();`;

export function Html({ title, description, url, site, children }: Props) {
  const origin = site.origin.replace(/\/$/, "");
  const bp = site.basePath ?? "";
  const canonicalUrl = url ? `${origin}${bp}/${url.replace(/^\//, "")}` : undefined;

  return (
    <html lang={site.language} class="no-js color-scheme-auto theme-paper">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="color-scheme" content="light dark" />
        <title>{title}</title>
        {description ? <meta name="description" content={description} /> : null}
        {canonicalUrl ? <link rel="canonical" href={canonicalUrl} /> : null}

        <meta property="og:type" content="website" />
        {canonicalUrl ? <meta property="og:url" content={canonicalUrl} /> : null}
        <meta property="og:title" content={title} />
        {description ? <meta property="og:description" content={description} /> : null}
        <meta property="og:site_name" content={site.name} />

        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={title} />
        {description ? <meta name="twitter:description" content={description} /> : null}

        <link
          rel="preload"
          href={`${bp}/assets/open-sans-latin-wght-normal.woff2`}
          as="font"
          type="font/woff2"
          crossorigin=""
        />

        <link rel="stylesheet" href={site.cssPath ?? `${bp}/assets/style.css`} />

        {/* Prevent FOUC: apply stored theme before CSS paints */}
        <script innerHTML={foucScript} />
        <script innerHTML="document.documentElement.classList.remove('no-js')" />
      </head>
      <body>
        {children}
        {site.jsPath ? <script type="module" src={site.jsPath} defer /> : null}
      </body>
    </html>
  );
}
