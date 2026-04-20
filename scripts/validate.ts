/**
 * sujeet-pro.github.io project validation.
 *
 * Strategy: import the published validators from `@pagesmith/site` so the
 * standard checks (link/image resolution, frontmatter schemas pulled from
 * `content.config.ts`, themed `<picture>` variants, asset hashing,
 * required output files, in-page anchors, etc.) stay in lock-step with
 * upstream. Then layer on rules that are unique to this portfolio site:
 *
 *   - `content/projects/meta.json5#items` must reference real project slugs
 *     and cover every non-draft project.
 *   - `content/README.md`'s `packages[].href` / `actions[].link` must
 *     resolve to a routable internal page when they look site-relative.
 *
 * Usage: `npm run validate` (full), `npm run validate -- --content`,
 * or `npm run validate -- --build` for one slice at a time.
 */
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import JSON5 from "json5";
import {
  formatContentValidationReport,
  loadContentSchemaMap,
  loadSiteConfig,
  normalizeBasePath,
  parseSiteConfig,
  validateContent,
  type FileSchemaEntry,
} from "@pagesmith/site";
import { validateBuildOutput } from "@pagesmith/site/build-validator";
import { collections } from "../content.config.ts";

const projectRoot = resolve(import.meta.dirname, "..");
const siteConfig = parseSiteConfig(loadSiteConfig());
const basePath = normalizeBasePath(siteConfig.basePath);
const trailingSlash = siteConfig.trailingSlash ?? false;
const contentDir = resolve(projectRoot, siteConfig.contentDir ?? "content");
const outDir = resolve(projectRoot, siteConfig.outDir ?? "dist");
const publicDir = resolve(projectRoot, "public");

const slice = process.argv.find((arg) => arg === "--content" || arg === "--build");
const checkContent = slice !== "--build";
const checkBuild = slice !== "--content";

let totalErrors = 0;
let totalWarnings = 0;

// ── 1. Markdown content validation (delegated to @pagesmith/site) ────
if (checkContent) {
  console.log(`\n[content] ${contentDir}`);

  const additionalRoots: Array<{ prefix: string; dir: string }> = [];
  if (existsSync(publicDir)) additionalRoots.push({ prefix: "/", dir: publicDir });
  if (existsSync(outDir)) {
    additionalRoots.push({ prefix: "/", dir: outDir });
    if (basePath) additionalRoots.push({ prefix: basePath, dir: outDir });
  }

  const loaded = await loadContentSchemaMap([projectRoot]);
  const schemaByFile: Map<string, FileSchemaEntry> | undefined = loaded?.schemaByFile;
  if (loaded) {
    console.log(
      `  loaded content.config from ${loaded.configPath} ` +
        `(${schemaByFile?.size} markdown files mapped across ${
          Object.keys(loaded.collections).length
        } collections)`,
    );
  }

  const summary = await validateContent({
    contentDir,
    collectionName: "projects",
    resolveFrontmatterSchema: schemaByFile
      ? (filePath) => schemaByFile.get(filePath)?.schema
      : undefined,
    linkValidator: {
      rootDir: contentDir,
      basePath,
      additionalRoots,
      // Portfolio site explicitly publishes asset and external paths, so
      // we do not enforce internalLinksMustBeMarkdown.
      requireAltText: true,
      forbidHtmlImgTag: true,
      requireThemeVariantPairs: true,
    },
  });

  const report = formatContentValidationReport(summary);
  if (report.trim()) console.log(report);
  totalErrors += summary.errors;
  totalWarnings += summary.warnings;
}

// ── 2. Build-output validation (delegated to @pagesmith/site) ────────
if (checkBuild) {
  console.log(`\n[build] ${outDir}`);
  if (!existsSync(outDir)) {
    console.log(`  skipped — outDir does not exist (run \`npm run build\` first)`);
  } else {
    const result = validateBuildOutput({
      outDir,
      basePath,
      trailingSlash,
      requireThemeVariants: true,
      checkInPageAnchors: true,
      requiredFiles: [
        ["favicon.svg", "favicon.ico"],
        "sitemap.xml",
        "robots.txt",
        "llms.txt",
        "llms-full.txt",
        "404.html",
      ],
    });
    for (const w of result.warnings) console.log(`  ⚠ ${w.file}: ${w.message}`);
    for (const e of result.errors) console.log(`  ✗ ${e.file}: ${e.message}`);
    console.log(
      `  ${result.htmlFileCount} HTML files, ${result.imageFileCount} images, ` +
        `${result.errors.length} errors, ${result.warnings.length} warnings`,
    );
    totalErrors += result.errors.length;
    totalWarnings += result.warnings.length;
  }
}

// ── 3. Project-specific cross-references ────────────────────────────
if (checkContent) {
  console.log(`\n[portfolio-cross-references]`);
  const errors: string[] = [];

  // Load every non-draft project slug from the `projects/` directory.
  const layer = await import("@pagesmith/site").then((m) =>
    m.createContentLayer({ collections }),
  );
  const projectEntries = await layer.getCollection("projects");
  const projectSlugs = new Set(projectEntries.map((entry) => entry.slug));

  // 3a. projects/meta.json5#items must reference live project slugs and
  //     should not omit any non-draft project.
  const metaPath = resolve(contentDir, "projects", "meta.json5");
  if (existsSync(metaPath)) {
    const meta = JSON5.parse(readFileSync(metaPath, "utf-8")) as {
      items?: string[];
    };
    const items = new Set(meta.items ?? []);
    for (const slug of items) {
      if (!projectSlugs.has(slug)) {
        errors.push(
          `content/projects/meta.json5 references missing project slug "${slug}".`,
        );
      }
    }
    for (const slug of projectSlugs) {
      if (!items.has(slug)) {
        errors.push(
          `content/projects/meta.json5 omits project "${slug}" — manual order should list every published project.`,
        );
      }
    }
  } else {
    errors.push("content/projects/meta.json5 is missing.");
  }

  // 3b. Home page hero actions and feature cards must point to routable
  //     destinations when they are site-relative paths.
  const homeEntries = await layer.getCollection("homePage");
  const home = homeEntries[0];
  if (!home) {
    errors.push("content/README.md (homePage) is missing.");
  } else {
    const homeFm = home.data as {
      packages?: Array<{ name: string; href?: string }>;
      actions?: Array<{ text: string; link?: string }>;
    };
    const knownInternal = new Set<string>([
      "/",
      "/projects",
      "/projects/",
      ...Array.from(projectSlugs).flatMap((slug) => [
        `/projects/${slug}`,
        `/projects/${slug}/`,
      ]),
    ]);

    const checkInternalUrl = (
      where: string,
      label: string,
      href: string | undefined,
    ): void => {
      if (!href) return;
      if (!href.startsWith("/")) return; // external / fragment / mailto
      const cleaned = href.split(/[?#]/)[0]!;
      if (!knownInternal.has(cleaned)) {
        errors.push(
          `${where} ${label} → ${href} does not match any rendered project route ` +
            `(${Array.from(knownInternal).slice(0, 3).join(", ")}, …).`,
        );
      }
    };

    for (const card of homeFm.packages ?? []) {
      checkInternalUrl("content/README.md packages[]", card.name, card.href);
    }
    for (const action of homeFm.actions ?? []) {
      checkInternalUrl("content/README.md actions[]", action.text, action.link);
    }
  }

  if (errors.length === 0) {
    console.log(
      `  meta and home page reference live content (${projectSlugs.size} project pages).`,
    );
  } else {
    for (const message of errors) console.log(`  ✗ ${message}`);
  }
  totalErrors += errors.length;
}

console.log(
  `\nSummary: ${totalErrors} error(s), ${totalWarnings} warning(s) — ${
    totalErrors === 0 ? "PASSED" : "FAILED"
  }`,
);
process.exit(totalErrors === 0 ? 0 : 1);
