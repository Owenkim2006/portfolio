import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { experience, COMPANY_URLS } from '@/data/experience';
import Article, { Figure, FigureGrid, List, Paragraphs, Section } from '@/components/portfolio/Article';

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
  const images = item.images ?? [];

  return (
    <Article
      kicker="Experience"
      title={item.company}
      deck={item.role}
      meta={<>{item.dateRange} · {item.location}</>}
      links={companyUrl ? [{ label: 'Website', href: companyUrl }] : []}
    >
      <Section title="Overview">
        <Paragraphs text={item.description} />
      </Section>

      {images[0] && <Figure src={images[0]} n={1} caption={item.company} />}

      {item.wins.length > 0 && (
        <Section title="Contributions">
          <List items={item.wins} />
          {item.stack.length > 0 && (
            <p className="article-p">
              <em>Tools and methods:</em> {item.stack.join(', ')}.
            </p>
          )}
        </Section>
      )}

      {images.length > 1 && (
        <Section title="Figures">
          <FigureGrid images={images.slice(1)} start={2} />
        </Section>
      )}
    </Article>
  );
}
