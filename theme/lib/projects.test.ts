import { describe, expect, it } from "vite-plus/test";
import type { MarkdownEntry } from "@pagesmith/site/ssg-utils";
import type { ProjectFrontmatter, ProjectsMeta } from "../../content.config";
import { orderProjects } from "./projects";

function makeEntry(slug: string, title: string): MarkdownEntry<ProjectFrontmatter> {
  return {
    contentSlug: slug,
    html: "",
    headings: [],
    frontmatter: {
      title,
      description: "",
      github: "https://github.com/example/repo",
      tags: [],
      packages: [],
      badges: [],
      draft: false,
    },
  };
}

function makeMeta(items: string[]): ProjectsMeta {
  return { displayName: "Projects", orderBy: "manual", items };
}

describe("orderProjects", () => {
  it("places listed items in manual order", () => {
    const entries = [makeEntry("c", "Charlie"), makeEntry("a", "Alpha"), makeEntry("b", "Bravo")];
    const result = orderProjects(entries, makeMeta(["b", "a", "c"]), "");
    expect(result.map((r) => r.slug)).toEqual(["b", "a", "c"]);
  });

  it("places unlisted items after listed ones, sorted alphabetically by title", () => {
    const entries = [
      makeEntry("z-project", "Zebra"),
      makeEntry("a-project", "Alpha"),
      makeEntry("pagesmith", "Pagesmith"),
    ];
    const result = orderProjects(entries, makeMeta(["pagesmith"]), "");
    expect(result.map((r) => r.slug)).toEqual(["pagesmith", "a-project", "z-project"]);
  });

  it("sorts everything alphabetically by title when no meta", () => {
    const entries = [makeEntry("z", "Zebra"), makeEntry("a", "Alpha"), makeEntry("m", "Mango")];
    const result = orderProjects(entries, undefined, "");
    expect(result.map((r) => r.slug)).toEqual(["a", "m", "z"]);
  });

  it("sorts everything alphabetically by title when items list is empty", () => {
    const entries = [makeEntry("z", "Zebra"), makeEntry("a", "Alpha"), makeEntry("m", "Mango")];
    const result = orderProjects(entries, makeMeta([]), "");
    expect(result.map((r) => r.slug)).toEqual(["a", "m", "z"]);
  });

  it("strips projects/ prefix from contentSlug", () => {
    const entries = [
      makeEntry("projects/diagramkit", "Diagramkit"),
      makeEntry("projects/pagesmith", "Pagesmith"),
    ];
    const result = orderProjects(entries, makeMeta(["pagesmith", "diagramkit"]), "");
    expect(result.map((r) => r.slug)).toEqual(["pagesmith", "diagramkit"]);
  });

  it("leaves contentSlug unchanged when it lacks the projects/ prefix", () => {
    const entries = [makeEntry("diagramkit", "Diagramkit"), makeEntry("pagesmith", "Pagesmith")];
    const result = orderProjects(entries, makeMeta(["pagesmith", "diagramkit"]), "");
    expect(result.map((r) => r.slug)).toEqual(["pagesmith", "diagramkit"]);
  });

  it("prefixes paths with basePath", () => {
    const entries = [makeEntry("pagesmith", "Pagesmith")];
    const result = orderProjects(entries, makeMeta(["pagesmith"]), "/base");
    expect(result[0]?.path).toBe("/base/projects/pagesmith");
  });
});
