import { ProjectFrontmatterSchema, defineCollection, defineConfig } from "@pagesmith/core";

function slugFromReadme(filePath: string, directory: string): string {
  const rel = filePath.replace(directory, "").replace(/^\//, "");
  return rel.replace(/\/README\.md$/, "").replace(/README\.md$/, "") || "_index";
}

const projects = defineCollection({
  loader: "markdown",
  directory: "content/projects",
  schema: ProjectFrontmatterSchema,
  include: ["*/README.md"],
  filter: (entry) => !entry.data.draft,
  slugify: slugFromReadme,
});

export default defineConfig({
  collections: { projects },
  root: process.cwd(),
  markdown: {
    shiki: {
      themes: { light: "github-light", dark: "github-dark" },
    },
  },
});
