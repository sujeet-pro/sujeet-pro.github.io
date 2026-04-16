import { defineConfig } from "vite-plus";
import { loadSiteConfig, normalizeBasePath, parseSiteConfig } from "@pagesmith/site";
import { pagesmithContent, pagesmithSsg, sharedAssetsPlugin } from "@pagesmith/site/vite";
import collections, { pagesmithMarkdown } from "./content.config.ts";

const siteConfig = parseSiteConfig(loadSiteConfig());
const basePath = normalizeBasePath(siteConfig.basePath);

export default defineConfig({
  base: basePath ? `${basePath}/` : "/",
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
