import { h } from "@pagesmith/site/jsx-runtime";
import { NotFoundLayout } from "@pagesmith/site/layouts";
import type { SiteDocumentData } from "@pagesmith/site/components";

type Props = {
  slug: string;
  site: SiteDocumentData;
};

export default function NotFound({ slug, site }: Props) {
  const basePath = site.basePath ?? "";

  return (
    <NotFoundLayout
      slug={slug}
      site={site}
      actions={[
        { label: "Back home", href: basePath || "/", variant: "primary" },
        { label: "Browse projects", href: `${basePath}/projects`, variant: "secondary" },
      ]}
    />
  );
}
