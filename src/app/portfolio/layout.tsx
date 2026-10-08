import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Portfolio',
  description: 'Projects, experience, and research by Owen Kim, Biomedical Engineering at the University of Waterloo.',
};

export default function PortfolioLayout({ children }: { children: React.ReactNode }) {
  return children;
}
