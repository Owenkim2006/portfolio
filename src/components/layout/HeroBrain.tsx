'use client';

import dynamic from 'next/dynamic';

const HeroBrainInner = dynamic(
  () => import('./HeroBrainInner'),
  { ssr: false, loading: () => null },
);

interface HeroBrainProps {
  interactive?: boolean;
}

export default function HeroBrain({ interactive = true }: HeroBrainProps) {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <HeroBrainInner interactive={interactive} />
    </div>
  );
}
