import { ResearchItem } from '@/types'

export const research: ResearchItem[] = [
  {
    id: 'dicoh',
    title: 'DiCoH: Rethinking Self-Supervised Pretraining for Semantic Segmentation in Homogeneous Medical Domains',
    authors: [
      'Kimathi Kaai',
      'Mahip Singh',
      'Joshua Kurien',
      'Owen Kim',
      'C Thomas',
      'Raviteja Vemulapalli',
      'Kwei-Herng Lai',
      'Alexander Wong',
      'Sirisha Rambhatla',
    ],
    venue: 'Under Review',
    status: 'review',
    tags: ['Medical Imaging', 'Self-Supervised Learning', 'Segmentation'],
    links: [],
  },
  {
    id: 'harvard-parkinsons',
    title: 'Deep Learning Based Segmentation of the Myenteric Plexus to Support Diagnostics of Parkinson\'s Disease',
    authors: [
      'Owen Kim',
      'Rosanna Hanke',
      'Francisco Benavides',
      'Guillermo Tearney',
    ],
    venue: 'Harvard Medical School, Tearney Lab · Wellman Center for Photomedicine, MGH',
    status: 'published',
    tags: ['OCT Imaging', 'Deep Learning', "Parkinson's Disease", 'Segmentation'],
    links: [
      {
        type: 'talk',
        label: 'LinkedIn Post',
        href: 'https://www.linkedin.com/feed/update/urn:li:activity:7368844996772306945/',
      },
    ],
  },
]
