export interface ResearchItem {
  id: string;
  title: string;
  institution: string;
  institutionShort: string;
  role: string;
  dateRange: string;
  description: string;
  tags: string[];
  status: 'current' | 'completed';
  highlight?: string;
  outputs: {
    type: 'paper' | 'poster' | 'talk' | 'conference';
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
  image?: string;
  images?: string[];
  longDescription?: string;
  highlights?: string[];
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
  type: 'research' | 'industry' | 'startup';
  description: string;
  wins: string[];
  stack: string[];
  logo?: string;
  color?: string;
}

export interface SocialLink {
  label: string;
  href: string;
  icon: string;
}
