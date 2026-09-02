import { ExperienceItem } from '@/types'

export const experience: ExperienceItem[] = [
  {
    id: 'sickkids',
    company: 'The Hospital for Sick Children',
    role: 'R&D Engineer',
    dateRange: 'Jan 2026 – Present',
    location: 'Toronto, ON',
    type: 'research',
    description: 'Leading a cross-lab initiative evaluating transcranial focused ultrasound neuromodulation across neuroscience and hardware engineering teams.',
    wins: [
      'Led 9+ researchers and engineers across neuroscience and hardware teams',
      'Co-authored a $225,000 internal research grant across 3 research groups',
      'Prototyped wearable neuromodulation helmet through 11+ transducer/sensor configurations',
      'Identified and mitigated electromagnetic interference using shielded cabling and signal filtering',
    ],
    stack: ['MNE-Python', 'SolidWorks', 'Signal Filtering', 'tFUS', 'Phantom Testing'],
    logo: '/images/logos/sickkids.png',
  },
  {
    id: 'uwaterloo-research',
    company: 'Critical ML Lab, University of Waterloo',
    role: 'Undergraduate Research Assistant',
    dateRange: 'Aug 2025 – Present',
    location: 'Waterloo, ON',
    type: 'research',
    description: 'Implementing active learning pipelines applying RL-based sampling strategies to brain tumor imaging datasets for semantic segmentation. Co-authored two research manuscripts.',
    wins: [
      'Implemented RL-based active learning pipelines in Python and PyTorch',
      'Applied sampling strategies to brain tumor imaging dataset for semantic segmentation',
      'Co-authored two manuscripts on active learning and preprocessing for medical image segmentation',
    ],
    stack: ['Python', 'PyTorch', 'Active Learning', 'Semantic Segmentation', 'Medical Imaging'],
    logo: '/images/logos/uwaterloo.png',
  },
  {
    id: 'harvard',
    company: 'Tearney Lab, Harvard Medical School',
    role: 'Machine Learning Research Intern',
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
