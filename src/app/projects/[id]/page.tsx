import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { projects } from '@/data/projects';
import Article, { Figure, FigureGrid, List, Paragraphs, Section } from '@/components/portfolio/Article';

// ─── Static params + metadata ─────────────────────────────────────────────────

export async function generateStaticParams() {
  return projects.map((p) => ({ id: p.id }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params;
  const project = projects.find((p) => p.id === id);
  if (!project) return {};
  return {
    title: project.name,
    description: project.description,
  };
}

const CATEGORY_LABEL = {
  'ai-health': 'AI & Health',
  hardware:    'Hardware',
  software:    'Software',
  design:      'Design',
} as const;

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function ProjectPage(
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const project = projects.find((p) => p.id === id);
  if (!project) notFound();

  // Demo video leads, then the stills; figures are spread between sections
  // and any left over are appended at the end.
  const media = [...(project.gif ? [project.gif] : []), ...(project.images ?? [])];
  let figN = 0;
  const nextFigure = () => {
    if (figN >= media.length) return null;
    const src = media[figN++];
    return <Figure key={src} src={src} n={figN} caption={figN === 1 ? project.name : undefined} />;
  };

  const kicker = ['Project', CATEGORY_LABEL[project.category], project.wip && 'In progress']
    .filter(Boolean).join(' · ');

  return (
    <Article
      kicker={kicker}
      title={project.name}
      deck={project.tagline}
      links={project.links}
    >
      <Section title="Summary">
        <Paragraphs text={project.description} />
      </Section>

      {nextFigure()}

      {project.longDescription && (
        <Section title="Design and Implementation">
          <Paragraphs text={project.longDescription} />
        </Section>
      )}

      {nextFigure()}

      {project.highlights && project.highlights.length > 0 && (
        <Section title="Technical Details">
          <List items={project.highlights} />
        </Section>
      )}

      {nextFigure()}

      {project.outcomes.length > 0 && (
        <Section title="Results">
          <List items={project.outcomes} />
        </Section>
      )}

      {figN < media.length && (
        <Section title="Additional Figures">
          <FigureGrid images={media.slice(figN)} start={figN + 1} />
        </Section>
      )}
    </Article>
  );
}
