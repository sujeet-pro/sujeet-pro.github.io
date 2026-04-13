import { createContentLayer, type ContentEntry, type ContentLayer } from "@pagesmith/core";
import config from "../pagesmith.config";

export function createSiteContentLayer(): ContentLayer {
  return createContentLayer(config);
}

export type SiteContent = {
  projects: ContentEntry[];
};

export async function loadAllContent(layer: ContentLayer): Promise<SiteContent> {
  const projects = await layer.getCollection("projects");
  return { projects };
}
