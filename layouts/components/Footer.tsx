import type { SiteConfig } from "../../lib/config";

type Props = {
  site: SiteConfig;
};

export function Footer({ site }: Props) {
  const year = new Date().getFullYear();
  const yearDisplay =
    site.copyright.startYear < year ? `${site.copyright.startYear}\u2013${year}` : `${year}`;

  return (
    <footer class="site-footer">
      <div class="footer-links">
        <a href="https://sujeet.pro" target="_blank" rel="noopener">
          Profile
        </a>
        <a href={site.social.github.url} target="_blank" rel="noopener">
          GitHub
        </a>
        <a href={site.social.linkedin.url} target="_blank" rel="noopener">
          LinkedIn
        </a>
      </div>
      <p class="footer-copyright">
        &copy; {yearDisplay} {site.copyright.holder}
      </p>
      <div class="doc-footer-theme no-js-hidden" data-footer-theme="">
        <div class="doc-footer-theme-group">
          <span class="doc-footer-theme-label">Appearance</span>
          <div class="doc-footer-theme-options" data-footer-scheme="">
            <button type="button" data-scheme="auto" class="active" aria-pressed="true">
              Auto
            </button>
            <button type="button" data-scheme="light" aria-pressed="false">
              Light
            </button>
            <button type="button" data-scheme="dark" aria-pressed="false">
              Dark
            </button>
          </div>
        </div>
        <div class="doc-footer-theme-group">
          <span class="doc-footer-theme-label">Theme</span>
          <div class="doc-footer-theme-options" data-footer-theme-type="">
            <button type="button" data-theme="paper" class="active" aria-pressed="true">
              Paper
            </button>
            <button type="button" data-theme="high-contrast" aria-pressed="false">
              High Contrast
            </button>
          </div>
        </div>
        <div class="doc-footer-theme-group">
          <span class="doc-footer-theme-label">Text Size</span>
          <div class="doc-footer-theme-options" data-footer-text-size="">
            <button type="button" data-size="small" aria-pressed="false" aria-label="Small text">
              <span class="doc-text-size-label" data-size="small">
                A
              </span>
            </button>
            <button
              type="button"
              data-size="base"
              class="active"
              aria-pressed="true"
              aria-label="Default text"
            >
              <span class="doc-text-size-label" data-size="base">
                A
              </span>
            </button>
            <button type="button" data-size="large" aria-pressed="false" aria-label="Large text">
              <span class="doc-text-size-label" data-size="large">
                A
              </span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
