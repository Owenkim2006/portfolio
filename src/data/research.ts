import type { ResearchItem } from '@/types';

export const research: ResearchItem[] = [
  {
    id: 'sickkids-tfus',
    title: 'Confidential Neuromodulation Research Initiative on Transcranial Focused Ultrasound',
    institution: 'Owen Kim, Adam Waspe, Natalie Rhodes, Sebastian Coleman, George Ibrahim',
    institutionShort: 'SickKids',
    description: 'Ibrahim Lab, Posluns Centre for Image Guided Innovation and Therapeutic Intervention, ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ ‎ The Hospital for Sick Children, University of Toronto.',
    status: 'current',
    outputs: [
      { type: 'poster', label: 'NMH Trainee Research Day 2026', href: undefined },
    ],
  },
  {
    id: 'uwaterloo-activelearning',
    title: 'Semi-Supervised Reinforced Active Learning for Label-efficient Semantic Segmentation',
    institution: 'Anonymus Authors',
    institutionShort: 'UW',
    description: 'Vision & Image Processing Lab + Critical ML Lab, University of Waterloo.',
    status: 'current',
    outputs: [
      { type: 'paper', label: 'ICML 2026 (Under Review)', href: undefined },
    ],
  },
  {
    id: 'harvard-parkinsons',
    title: "Deep Learning Based Segmentation of the Myenteric Plexus to Support Diagnostics of Parkinson's Disease",
    institution: 'Owen Kim, Rosanna Hanke, Francisco Benavides, Guillermo Tearney',
    institutionShort: 'HMS',
    description: "Tearney Lab, Massachusetts General Hospital, Harvard Medical School.",
    status: 'completed',
    outputs: [
      { type: 'poster', label: 'Wellman Center Presentation, MGH', href: undefined },
    ],
  },
];
