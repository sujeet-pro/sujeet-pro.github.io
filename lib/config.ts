import { readFileSync } from "fs";
import { join } from "path";
import JSON5 from "json5";
import { z } from "@pagesmith/core";

const NavItemSchema = z.object({
  path: z.string(),
  label: z.string(),
});

const SocialAccountSchema = z.object({
  handle: z.string(),
  url: z.string().url(),
});

export const SiteConfigSchema = z
  .object({
    origin: z.string().url(),
    name: z.string(),
    title: z.string(),
    description: z.string(),
    language: z.string().default("en"),
    basePath: z
      .string()
      .default("/")
      .transform((v) => {
        const trimmed = v.replace(/\/+$/, "");
        return trimmed === "" ? "" : trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
      }),
    navItems: z.array(NavItemSchema).default([]),
    social: z.object({
      github: SocialAccountSchema,
      linkedin: SocialAccountSchema,
    }),
    copyright: z.object({
      holder: z.string(),
      startYear: z.number(),
    }),
  })
  .passthrough();

export type SiteConfig = z.infer<typeof SiteConfigSchema> & {
  cssPath?: string;
  jsPath?: string;
};

const MetaConfigSchema = z.object({
  displayName: z.string().optional(),
  description: z.string().optional(),
  orderBy: z.enum(["manual", "publishedDate"]).optional(),
  items: z.array(z.string()).optional(),
});

export type MetaConfig = z.infer<typeof MetaConfigSchema>;

export function loadSiteConfig(contentDir: string): SiteConfig {
  const raw = readFileSync(join(contentDir, "site.json5"), "utf-8");
  const parsed = JSON5.parse(raw);
  if (process.env.BASE_PATH !== undefined) parsed.basePath = process.env.BASE_PATH;
  return SiteConfigSchema.parse(parsed);
}

export function loadMetaConfig(dir: string): MetaConfig {
  const raw = readFileSync(join(dir, "meta.json5"), "utf-8");
  return MetaConfigSchema.parse(JSON5.parse(raw));
}
