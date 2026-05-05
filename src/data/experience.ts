import type { ExperienceItem } from '@/types';

export const experience: ExperienceItem[] = [
  {
    id: 'sickkids',
    company: 'The Hospital for Sick Children',
    role: 'R&D Engineer',
    dateRange: 'Jan 2026 - Apr 2026',
    location: 'Toronto, ON',
    type: 'research',
    description: 'Leading a cross-lab initiative evaluating transcranial focused ultrasound neuromodulation with simultaneous neural monitoring across neuroscience and hardware teams.',
    wins: [
      'Led 9+ researchers/engineers across neuroscience and hardware teams',
      'Co-authored a $225,000 internal research grant',
      'SNR improvement via shielded cabling and signal filtering in MNE-Python',
      'Prototyped a wearable neuromodulation helmet through 11+ transducer/sensor configurations',
    ],
    stack: ['Signal Processing', 'MEG', 'SolidWorks', 'Focused Ultrasound', 'MNE-Python'],
  },
  {
    id: 'uwaterloo-research',
    company: 'Critical ML Lab',
    role: 'Undergraduate Research Assistant',
    dateRange: 'Aug 2025 - Present',
    location: 'Waterloo, ON',
    type: 'research',
    description: 'Implementing and evaluating active learning pipelines for annotation efficiency and segmentation performance. Applying methods to brain tumor datasets for medical imaging.',
    wins: [
      'Compared annotation efficiency across active learning sampling strategies',
      'Led medical imaging implementation on brain tumor dataset',
      'Co-authored manuscript on RL-based active learning under review at ICML 2026',
    ],
    stack: ['Python', 'PyTorch', 'Active Learning', 'Semi-supervised Learning', 'Reinforcement Learning'],
  },
  {
    id: 'harvard',
    company: 'Harvard Medical School — Tearney Lab',
    role: 'Machine Learning Research Intern',
    dateRange: 'May 2025 - Aug 2025',
    location: 'Boston, MA',
    type: 'research',
    description: "Developed a deep learning pipeline for Parkinson's disease diagnosis through segmentation of esophageal OCT images. Presented at the Wellman Center for Photomedicine at MGH.",
    wins: [
      "Built deep learning pipeline for Parkinson's diagnosis via esophageal OCT",
      'Translated 16+ clinical design requirements into model architecture decisions',
      'Achieved 85%+ classification accuracy with LT-U-Net model',
      'Completed the Biomedical Optics Summer Institute through the Health Science and Technology program at Harvard Medical School and MIT',
      'Presented at the Wellman Center for Photomedicine, Massachusetts General Hospital',
    ],
    stack: ['Python', 'PyTorch', 'OCT Imaging', 'LT-U-Net', 'Deep Learning'],
  },

  {
    id: 'datafix',
    company: 'DataFix',
    role: 'Junior Software Developer',
    dateRange: 'Apr 2024 - Aug 2024',
    location: 'Toronto, ON',
    type: 'software',
    description: 'Implemented database solutions using Microsoft SQL Server, optimizing data storage and retrieval for optimal website performance.',
    wins: [
      'Developed and repaired website features using C#, HTML and CSS improving user interface',
      "Successfully delivered a major project for Halifax Regional Municipality, developing a poll book system used in their next election by retrieving, implementing, and displaying data, ensuring the project was completed on time and met all functional requirements",
    ],
    stack: ['C#', 'HTML', 'CSS', 'JavaScript', 'SQL Server', 'Product Design'],
  },

];
