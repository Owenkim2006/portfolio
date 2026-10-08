import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { research } from '@/data/research';
import { PF } from '@/lib/portfolioTheme';
import DetailLayout, { LinkList, SectionLabel, TagList } from '@/components/portfolio/DetailLayout';

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
    <DetailLayout
      badge="Research"
      title={item.title}
      sidebar={
        <>
          <div>
            <SectionLabel>Status</SectionLabel>
            <p style={{ fontSize: 14, color: PF.textSecondary, margin: 0 }}>{STATUS_LABEL[item.status]}</p>
          </div>
          {item.tags.length > 0 && (
            <div>
              <SectionLabel>Tags</SectionLabel>
              <TagList tags={item.tags} />
            </div>
          )}
          {links.length > 0 && (
            <div>
              <SectionLabel>Links</SectionLabel>
              <LinkList links={links} />
            </div>
          )}
        </>
      }
    >
      <div>
        <SectionLabel>Authors</SectionLabel>
        <p style={{ fontSize: 16, color: PF.textSecondary, lineHeight: 1.8, margin: 0 }}>
          {item.authors.map((a, i) => (
            <span key={a}>
              {a === 'Owen Kim'
                ? <span style={{ fontWeight: 600, color: PF.textPrimary }}>{a}</span>
                : a}
              {i < item.authors.length - 1 && ', '}
            </span>
          ))}
        </p>
      </div>
      {item.venue && (
        <div>
          <SectionLabel>Venue</SectionLabel>
          <p style={{ fontSize: 16, color: PF.textSecondary, fontStyle: 'italic', lineHeight: 1.7, margin: 0 }}>
            {item.venue}
          </p>
        </div>
      )}
    </DetailLayout>
  );
}
