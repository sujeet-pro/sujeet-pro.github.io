import {
  defineCollection,
  defineCollections,
  defineConfig,
  type Loader,
  type LoaderResult,
  z,
} from "@pagesmith/site";
import JSON5 from "json5";
import { readFileSync } from "node:fs";
import { basename, dirname } from "node:path";

const ChromeSchema = z
  .object({
    header: z.boolean().optional(),
    toc: z.boolean().optional(),
    footer: z.boolean().optional(),
  })
  .passthrough();

const HomeActionSchema = z
  .object({
    text: z.string(),
    link: z.string(),
    theme: z.enum(["brand", "alt"]).optional(),
    icon: z.string().optional(),
  })
  .passthrough();

const HomeCardSchema = z
  .object({
    name: z.string(),
    description: z.string(),
    href: z.string().optional(),
    tag: z.string().optional(),
    version: z.string().optional(),
  })
  .passthrough();

const HomeFrontmatterSchema = z
  .object({
    title: z.string(),
    description: z.string(),
    tagline: z.string().optional(),
    badge: z.string().optional(),
    actions: z.array(HomeActionSchema).default([]),
    packages: z.array(HomeCardSchema).default([]),
    chrome: ChromeSchema.optional(),
    socialImage: z.string().optional(),
  })
  .passthrough();

const ListingFrontmatterSchema = z
  .object({
    title: z.string(),
    description: z.string(),
    chrome: ChromeSchema.optional(),
    socialImage: z.string().optional(),
  })
  .passthrough();

const ProjectPackageSchema = z
  .object({
    name: z.string(),
    url: z.string().url(),
  })
  .passthrough();

const ProjectBadgeSchema = z
  .object({
    label: z.string(),
    image: z.string().url(),
    href: z.string().url().optional(),
    alt: z.string().optional(),
  })
  .passthrough();

const ProjectFrontmatterSchema = z
  .object({
    title: z.string(),
    description: z.string(),
    tags: z.array(z.string()).default([]),
    github: z.string().url(),
    docsUrl: z.string().url().optional(),
    packages: z.array(ProjectPackageSchema).default([]),
    badges: z.array(ProjectBadgeSchema).default([]),
    draft: z.boolean().optional().default(false),
    socialImage: z.string().optional(),
  })
  .passthrough();

const ProjectsMetaSchema = z
  .object({
    displayName: z.string().default("Projects"),
    description: z.string().optional(),
    orderBy: z.literal("manual").default("manual"),
    items: z.array(z.string()).default([]),
  })
  .passthrough();

function folderSlug(filePath: string): string {
  return basename(dirname(filePath));
}

const Json5Loader: Loader = {
  name: "repo-json5",
  kind: "data",
  extensions: [".json5"],
  async load(filePath) {
    return JSON5.parse(readFileSync(filePath, "utf-8")) as LoaderResult;
  },
};

export const pagesmithMarkdown = {
  math: "auto",
  shiki: {
    themes: {
      light: "github-light",
      dark: "github-dark",
    },
    defaultShowLineNumbers: true,
  },
} as const;

export type HomeFrontmatter = z.infer<typeof HomeFrontmatterSchema>;
export type ListingFrontmatter = z.infer<typeof ListingFrontmatterSchema>;
export type ProjectFrontmatter = z.infer<typeof ProjectFrontmatterSchema>;
export type ProjectPackage = z.infer<typeof ProjectPackageSchema>;
export type ProjectBadge = z.infer<typeof ProjectBadgeSchema>;
export type ProjectsMeta = z.infer<typeof ProjectsMetaSchema>;

export const collections = defineCollections({
  homePage: defineCollection({
    loader: "markdown",
    directory: "content",
    include: ["README.md"],
    schema: HomeFrontmatterSchema,
  }),
  projectsIndex: defineCollection({
    loader: "markdown",
    directory: "content/projects",
    include: ["README.md"],
    schema: ListingFrontmatterSchema,
  }),
  projects: defineCollection({
    loader: "markdown",
    directory: "content/projects",
    include: ["*/README.md"],
    slugify: folderSlug,
    filter: (entry) => entry.data.draft !== true,
    schema: ProjectFrontmatterSchema,
  }),
  projectsMeta: defineCollection({
    loader: Json5Loader,
    directory: "content/projects",
    include: ["meta.json5"],
    schema: ProjectsMetaSchema,
  }),
});

export const contentLayerConfig = defineConfig({
  collections,
  markdown: pagesmithMarkdown,
  strict: true,
});

export default collections;
