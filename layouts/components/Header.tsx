import type { SiteConfig } from "../../lib/config";

type Props = {
  site: SiteConfig;
};

const themeIcon =
  '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="10" cy="10" r="4"/><path d="M10 2v2M10 16v2M2 10h2M16 10h2M4.93 4.93l1.41 1.41M13.66 13.66l1.41 1.41M4.93 15.07l1.41-1.41M13.66 6.34l1.41-1.41"/></svg>';

export function Header({ site }: Props) {
  const bp = site.basePath ?? "";
  return (
    <header class="site-header">
      <div class="header-inner">
        <a href={`${bp}/`} class="site-logo">
          {site.name}
        </a>
        <div class="header-actions">
          <a
            href={site.social.github.url}
            target="_blank"
            rel="noopener"
            class="header-link"
            aria-label="GitHub"
          >
            GitHub
          </a>
          <div class="doc-theme-toggle no-js-hidden" data-theme-toggle="">
            <button
              type="button"
              class="doc-theme-toggle-btn"
              aria-label="Change theme"
              aria-expanded="false"
              aria-haspopup="true"
              aria-controls="doc-theme-dropdown"
              data-theme-toggle-btn=""
              innerHTML={themeIcon}
            />
            <div id="doc-theme-dropdown" class="doc-theme-dropdown" data-theme-dropdown="" hidden>
              <fieldset class="doc-theme-group">
                <legend>Appearance</legend>
                <label class="doc-theme-option">
                  <input type="radio" name="colorScheme" value="auto" checked />
                  Auto
                </label>
                <label class="doc-theme-option">
                  <input type="radio" name="colorScheme" value="light" />
                  Light
                </label>
                <label class="doc-theme-option">
                  <input type="radio" name="colorScheme" value="dark" />
                  Dark
                </label>
              </fieldset>
              <fieldset class="doc-theme-group">
                <legend>Theme</legend>
                <label class="doc-theme-option">
                  <input type="radio" name="theme" value="paper" checked />
                  Paper
                </label>
                <label class="doc-theme-option">
                  <input type="radio" name="theme" value="high-contrast" />
                  High Contrast
                </label>
              </fieldset>
              <fieldset class="doc-theme-group">
                <legend>Text Size</legend>
                <div class="doc-text-size-options">
                  <label class="doc-text-size-option" title="Small">
                    <input class="sr-only" type="radio" name="textSize" value="small" />
                    <span class="doc-text-size-label" data-size="small" aria-hidden="true">
                      A
                    </span>
                    <span class="sr-only">Small text size</span>
                  </label>
                  <label class="doc-text-size-option" title="Default">
                    <input class="sr-only" type="radio" name="textSize" value="base" checked />
                    <span class="doc-text-size-label" data-size="base" aria-hidden="true">
                      A
                    </span>
                    <span class="sr-only">Default text size</span>
                  </label>
                  <label class="doc-text-size-option" title="Large">
                    <input class="sr-only" type="radio" name="textSize" value="large" />
                    <span class="doc-text-size-label" data-size="large" aria-hidden="true">
                      A
                    </span>
                    <span class="sr-only">Large text size</span>
                  </label>
                </div>
              </fieldset>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
