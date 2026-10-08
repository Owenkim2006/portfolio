import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { experience, COMPANY_URLS } from '@/data/experience';
import { PF } from '@/lib/portfolioTheme';
import DetailLayout, { BulletList, LinkList, SectionLabel, TagList } from '@/components/portfolio/DetailLayout';

export async function generateStaticParams() {
  return experience.map((e) => ({ id: e.id }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params;
  const item = experience.find((e) => e.id === id);
  if (!item) return {};
  return {
    title: `${item.role}, ${item.company}`,
    description: item.description,
  };
}

export default async function ExperiencePage(
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const item = experience.find((e) => e.id === id);
  if (!item) notFound();

  const companyUrl = COMPANY_URLS[item.id];

  return (
    <DetailLayout
      badge="Experience"
      title={item.company}
      subtitle={item.role}
      images={item.images}
      sidebar={
        <>
          <div>
            <SectionLabel>Details</SectionLabel>
            <p style={{ fontSize: 14, color: PF.textSecondary, lineHeight: 1.7, margin: 0 }}>
              {item.dateRange}<br />{item.location}
            </p>
          </div>
          {item.stack.length > 0 && (
            <div>
              <SectionLabel>Stack</SectionLabel>
              <TagList tags={item.stack} />
            </div>
          )}
          {companyUrl && (
            <div>
              <SectionLabel>Links</SectionLabel>
              <LinkList links={[{ label: 'Website', href: companyUrl }]} />
            </div>
          )}
        </>
      }
    >
      <p style={{ fontSize: 16, color: PF.textPrimary, lineHeight: 1.8, margin: 0 }}>
        {item.description}
      </p>
      {item.wins.length > 0 && (
        <div>
          <SectionLabel>Key outcomes</SectionLabel>
          <BulletList items={item.wins} />
        </div>
      )}
    </DetailLayout>
  );
}
