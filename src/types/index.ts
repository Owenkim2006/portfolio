export type ResearchStatus = 'review' | 'published';

export interface ResearchItem {
  id: string;
  title: string;
  authors: string[];
  venue?: string;
  status: ResearchStatus;
  tags: string[];
  links: {
    type: string;
    label: string;
    href?: string;
  }[];
}

export interface Project {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: 'ai-health' | 'hardware' | 'software' | 'design';
  tags: string[];
  outcomes: string[];
  featured: boolean;
  wip?: boolean;
  image?: string;
  images?: string[];
  thumbnail?: string;
  longDescription?: string;
  highlights?: string[];
  gif?: string;
  links: {
    label: string;
    href: string;
    type: 'github' | 'demo' | 'devpost' | 'other';
  }[];
}

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  dateRange: string;
  location: string;
  type: 'research' | 'software';
  description: string;
  wins: string[];
  stack: string[];
  logo?: string;
  color?: string;
  images?: string[];
}

export interface SocialLink {
  label: string;
  href: string;
  icon: string;
}
