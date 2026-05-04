'use client';

import dynamic from 'next/dynamic';

const BrainBackground = dynamic(
  () => import('@/components/layout/BrainBackgroundInner'),
  { ssr: false, loading: () => null },
);

export default BrainBackground;
