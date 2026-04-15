import { describe, expect, it } from "vite-plus/test";
import { normalizeBasePath, stripBasePath, withBasePath, withTrailingSlash } from "@pagesmith/site";

describe("site-config path helpers", () => {
  it("normalizes base paths for root and nested deployments", () => {
    expect(normalizeBasePath(undefined)).toBe("");
    expect(normalizeBasePath("/")).toBe("");
    expect(normalizeBasePath("/projects/")).toBe("/projects");
    expect(normalizeBasePath("projects")).toBe("/projects");
  });

  it("applies the base path only to site-relative links", () => {
    expect(withBasePath("/projects", "/docs")).toBe("/projects/docs");
    expect(withBasePath("/projects", "/projects/docs")).toBe("/projects/docs");
    expect(withBasePath("/projects", "docs")).toBe("/projects/docs");
    expect(withBasePath("/projects", "https://example.com/docs")).toBe("https://example.com/docs");
    expect(withBasePath("/projects", "mailto:hello@example.com")).toBe("mailto:hello@example.com");
  });

  it("strips the base path from incoming URLs", () => {
    expect(stripBasePath("/projects/docs?tab=api#install", "/projects")).toBe("/docs");
    expect(stripBasePath("/projects", "/projects")).toBe("/");
    expect(stripBasePath("/", "/")).toBe("/");
  });

  it("adds a trailing slash without changing root", () => {
    expect(withTrailingSlash("")).toBe("/");
    expect(withTrailingSlash("/")).toBe("/");
    expect(withTrailingSlash("/projects")).toBe("/projects/");
    expect(withTrailingSlash("/projects/")).toBe("/projects/");
  });
});
