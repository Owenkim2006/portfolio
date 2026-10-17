import { ExperienceItem } from '@/types'

export const COMPANY_URLS: Record<string, string> = {
  'sickkids': 'https://pcigiti.com/',
  'uwaterloo-research': 'https://sirisharambhatla.com/criticalml/',
  'harvard': 'http://www.tearneylab.org/',
}

export const experience: ExperienceItem[] = [
  {
    id: 'sickkids',
    company: 'The Hospital for Sick Children',
    role: 'Research Student (R&D Engineering)',
    dateRange: 'Jan 2026 – Present',
    location: 'Toronto, ON',
    type: 'research',
    description: 'Leading a cross-lab initiative evaluating transcranial focused ultrasound neuromodulation across neuroscience and hardware engineering teams.',
    wins: [
      'Led 9+ researchers and engineers across neuroscience and hardware teams',
      'Fabricated and characterized 10 ultrasound transducers, designing impedance-matching circuits',
      'Prototyped wearable neuromodulation helmet through 11+ transducer/sensor configurations',
      'Awarded a $75,000 internal research grant; coordinated technical priorities across 3 research groups',
    ],
    stack: ['MNE-Python', 'SolidWorks', 'Signal Filtering', 'tFUS', 'Phantom Testing'],
    logo: '/images/logos/sickkids.png',
  },
  {
    id: 'uwaterloo-research',
    company: 'Critical ML Lab, University of Waterloo',
    role: 'Undergraduate Research Assistant (Machine Learning)',
    dateRange: 'Aug 2025 – Present',
    location: 'Waterloo, ON',
    type: 'research',
    description: 'Self-supervised and active learning for label-efficient medical image segmentation.',
    wins: [
      'Co-authored DiCoH, a self-supervised contrastive pretraining framework for homogeneous medical images (under review), +2.0 mIoU over the strongest baseline at 5% labels',
      'Developing a reinforcement learning-driven active learning framework for semi-supervised segmentation, leading reward-signal design',
      'Built a PyTorch active learning pipeline on 80K+ BraTS MRI slices, resolving a class-imbalance failure mode in sample selection',
    ],
    stack: ['Python', 'PyTorch', 'Self-Supervised Learning', 'Active Learning', 'Reinforcement Learning', 'Semantic Segmentation'],
    logo: '/images/logos/uwaterloo.png',
  },
  {
    id: 'harvard',
    company: 'Tearney Lab, Harvard Medical School',
    role: 'Machine Learning Research Assistant',
    dateRange: 'May 2025 - Aug 2025',
    location: 'Boston, MA',
    type: 'research',
    description: 'Developed a deep learning pipeline for Parkinson\'s disease diagnosis via esophageal OCT image segmentation. Presented research at the Wellman Center for Photomedicine at MGH.',
    wins: [
      'Built deep learning pipeline for Parkinson\'s diagnosis via esophageal OCT segmentation',
      'Translated 16+ clinician requirements into model architecture and training strategy',
      'Achieved 85%+ classification accuracy with LT-U-Net across all classes',
      'Presented at the Wellman Center for Photomedicine, Massachusetts General Hospital',
    ],
    stack: ['Python', 'PyTorch', 'OCT Imaging', 'LT-U-Net', 'Deep Learning', 'Medical Imaging'],
    logo: '/images/logos/harvard.png',
  },
]
