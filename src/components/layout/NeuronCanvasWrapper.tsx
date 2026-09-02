'use client';

import dynamic from 'next/dynamic';

const NeuronCanvas = dynamic(
  () => import('@/components/layout/NeuronCanvas'),
  { ssr: false },
);

export default function NeuronCanvasWrapper() {
  return <NeuronCanvas />;
}
