import type { ResearchItem } from '@/types';

export const research: ResearchItem[] = [
  {
    id: 'sickkids-tfus',
    title: 'Transcranial Focused Ultrasound Neuromodulation & OPM-MEG Neural Monitoring',
    institution: 'The Hospital for Sick Children',
    institutionShort: 'SickKids',
    role: 'R&D Engineer',
    dateRange: 'Jan 2026 – Present',
    description: 'Leading feasibility evaluation of transcranial focused ultrasound (tFUS) neuromodulation combined with OPM-MEG neural monitoring. Coordinating across 3 independent research groups spanning neuroscience and hardware engineering.',
    tags: ['tFUS', 'OPM-MEG', 'Neuromodulation', 'Signal Processing', 'MNE-Python'],
    status: 'current',
    highlight: 'Co-authored a $225,000 internal research grant to initiate project development',
    outputs: [
      { type: 'poster', label: 'Internal Research Proposal', href: undefined },
    ],
  },
  {
    id: 'uwaterloo-activelearning',
    title: 'Reinforcement Learning–Based Active Learning for Semantic Segmentation',
    institution: 'Vision & Image Processing Lab + Critical ML Lab, University of Waterloo',
    institutionShort: 'UWaterloo',
    role: 'Undergraduate Research Assistant',
    dateRange: 'Aug 2025 – Present',
    description: 'Implementing and benchmarking active learning pipelines to improve annotation efficiency for medical image segmentation. Applied to brain tumor datasets, with a focus on RL-based sampling strategies.',
    tags: ['Active Learning', 'Semantic Segmentation', 'PyTorch', 'Medical Imaging', 'RL'],
    status: 'current',
    highlight: 'Co-authored manuscript under review at ICML 2026',
    outputs: [
      { type: 'paper', label: 'ICML 2026 (Under Review)', href: undefined },
    ],
  },
  {
    id: 'harvard-parkinsons',
    title: "Parkinson's Disease Diagnosis via Esophageal OCT Segmentation",
    institution: 'Harvard Medical School — Tearney Lab',
    institutionShort: 'Harvard',
    role: 'ML Research Intern',
    dateRange: 'May 2025 – Aug 2025',
    description: "Developed a deep learning pipeline for Parkinson's disease diagnosis by segmenting esophageal OCT images. Translated 16+ clinician-defined design requirements into model architecture and training strategy. Validated LT-U-Net achieving 85%+ classification accuracy.",
    tags: ['OCT Imaging', 'Deep Learning', 'LT-U-Net', 'PyTorch', "Parkinson's Disease"],
    status: 'completed',
    highlight: 'Presented at the Wellman Center for Photomedicine, Massachusetts General Hospital',
    outputs: [
      { type: 'talk', label: 'Wellman Center Presentation, MGH', href: undefined },
    ],
  },
];
