import type { ProjectBadge } from "../../content.config";

type Props = {
  badges?: ProjectBadge[];
};

export function ProjectBadges({ badges = [] }: Props) {
  if (badges.length === 0) return null;

  return (
    <div class="site-badge-row" aria-label="Project badges">
      {badges.map((badge) =>
        badge.href ? (
          <a
            class="site-badge-link"
            href={badge.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={badge.alt || badge.label}
          >
            <img
              class="site-badge-image"
              src={badge.image}
              alt={badge.alt || badge.label}
              loading="lazy"
            />
          </a>
        ) : (
          <img
            class="site-badge-image"
            src={badge.image}
            alt={badge.alt || badge.label}
            loading="lazy"
          />
        ),
      )}
    </div>
  );
}
