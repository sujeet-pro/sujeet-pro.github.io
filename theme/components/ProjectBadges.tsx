import type { ProjectBadge, ProjectPackage } from "../../content.config";
import { buildNpmVersionBadge } from "../lib/projects";

type Props = {
  badges?: ProjectBadge[];
  packages?: ProjectPackage[];
  limit?: number;
};

type RenderBadge = {
  key: string;
  href?: string;
  image: string;
  alt: string;
};

function getRenderBadges(
  badges: ProjectBadge[],
  packages: ProjectPackage[],
  limit: number | undefined,
): RenderBadge[] {
  const ciBadges = badges.map((badge) => ({
    key: `${badge.label}:${badge.image}`,
    href: badge.href,
    image: badge.image,
    alt: badge.alt || badge.label,
  }));

  const npmBadges = packages.map((pkg) => ({
    key: `npm:${pkg.name}`,
    href: pkg.url,
    image: buildNpmVersionBadge(pkg.name),
    alt: `npm version for ${pkg.name}`,
  }));

  const combined = [...ciBadges, ...npmBadges];
  return typeof limit === "number" ? combined.slice(0, limit) : combined;
}

export function ProjectBadges({ badges = [], packages = [], limit }: Props) {
  const items = getRenderBadges(badges, packages, limit);
  if (items.length === 0) return null;

  return (
    <div class="site-badge-row" aria-label="Project badges">
      {items.map((badge) =>
        badge.href ? (
          <a
            class="site-badge-link"
            href={badge.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={badge.alt}
          >
            <img class="site-badge-image" src={badge.image} alt={badge.alt} loading="lazy" />
          </a>
        ) : (
          <img class="site-badge-image" src={badge.image} alt={badge.alt} loading="lazy" />
        ),
      )}
    </div>
  );
}
