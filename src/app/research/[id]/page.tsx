import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { research } from '@/data/research';
import { PF } from '@/lib/portfolioTheme';
import Article, { Paragraphs, Section } from '@/components/portfolio/Article';

const STATUS_LABEL = {
  review: 'Under review',
  published: 'Published',
} as const;

export async function generateStaticParams() {
  return research.map((r) => ({ id: r.id }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params;
  const item = research.find((r) => r.id === id);
  if (!item) return {};
  return {
    title: item.title,
    description: `${item.authors.join(', ')}${item.venue ? `. ${item.venue}` : ''}`,
  };
}

export default async function ResearchPage(
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const item = research.find((r) => r.id === id);
  if (!item) notFound();

  const links = item.links
    .filter((l): l is typeof l & { href: string } => !!l.href)
    .map((l) => ({ label: l.label, href: l.href }));

  return (
    <Article
      kicker={`Research · ${STATUS_LABEL[item.status]}`}
      title={item.title}
      meta={
        <>
          {item.authors.map((a, i) => (
            <span key={a}>
              {a === 'Owen Kim'
                ? <span style={{ fontWeight: 600, color: PF.textPrimary }}>{a}</span>
                : a}
              {i < item.authors.length - 1 && ', '}
            </span>
          ))}
        </>
      }
      links={links}
    >
      {item.abstract && (
        <Section title="Abstract">
          <Paragraphs text={item.abstract} />
        </Section>
      )}
      {/* The status already shows in the kicker, so skip a bare "Under Review" venue. */}
      {item.venue && item.venue.toLowerCase() !== 'under review' && (
        <Section title="Publication">
          <Paragraphs text={item.venue} />
        </Section>
      )}
      {item.tags.length > 0 && (
        <Section title="Keywords">
          <p className="article-p">{item.tags.join(', ')}</p>
        </Section>
      )}
    </Article>
  );
}
