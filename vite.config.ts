import { defineConfig } from "vite-plus";
import { loadSiteConfig, normalizeBasePath, parseSiteConfig } from "@pagesmith/site";
import { pagesmithContent, pagesmithSsg, sharedAssetsPlugin } from "@pagesmith/site/vite";
import collections, { pagesmithMarkdown } from "./content.config.ts";

const siteConfig = parseSiteConfig(loadSiteConfig());
const basePath = normalizeBasePath(siteConfig.basePath);

export default defineConfig({
  base: basePath ? `${basePath}/` : "/",
  css: {
    transformer: "lightningcss",
    lightningcss: {
      drafts: { customMedia: true },
      // Pin Lightning CSS to browsers that natively support `light-dark()`.
      // Vite's defaults (chrome 111 / firefox 114 / safari 16.4) trigger a
      // brittle `var(--lightningcss-light) var(--lightningcss-dark)` polyfill
      // that resolves to an invalid background value once nested through the
      // theme custom properties (e.g. `--color-header-bg`), making the sticky
      // header render as transparent. Native `light-dark()` lands in
      // chrome 123, firefox 120, safari 17.5.
      targets: {
        chrome: 123 << 16,
        firefox: 120 << 16,
        safari: (17 << 16) | (5 << 8),
      },
    },
  },
  build: {
    cssMinify: "lightningcss",
    cssTarget: ["chrome123", "firefox120", "safari17.5"],
  },
  plugins: [
    sharedAssetsPlugin(),
    pagesmithContent({
      collections,
      markdown: pagesmithMarkdown,
      contentRoot: "content",
      dts: false,
    }),
    ...pagesmithSsg({
      entry: "./src/entry-server.tsx",
      contentDirs: ["./content"],
      cssEntry: "./src/theme.css",
      pagefind: siteConfig.search?.enabled,
      trailingSlash: siteConfig.trailingSlash ?? false,
    }),
  ],
  server: {
    port: siteConfig.server?.devPort,
  },
  preview: {
    port: siteConfig.server?.previewPort,
  },
  lint: {
    ignorePatterns: ["dist/**"],
    options: {
      typeAware: true,
      typeCheck: true,
    },
  },
  fmt: {},
  test: {
    environment: "node",
    include: ["**/*.{test,spec}.{ts,tsx}"],
  },
});
