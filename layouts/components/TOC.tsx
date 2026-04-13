type Heading = {
  depth: number;
  text: string;
  slug: string;
};

type Props = {
  headings: Heading[];
};

export function TOC({ headings }: Props) {
  const filtered = headings.filter((h) => h.depth >= 2 && h.depth <= 3);
  if (filtered.length === 0) return null;

  return (
    <nav class="toc" aria-label="On this page">
      <h3 class="toc-title">On this page</h3>
      <ul class="toc-list">
        {filtered.map((h) => (
          <li class={`toc-item toc-depth-${h.depth}`}>
            <a href={`#${h.slug}`}>{h.text}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
