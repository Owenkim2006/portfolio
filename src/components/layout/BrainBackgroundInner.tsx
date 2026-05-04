'use client';

import { Suspense, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

// ─── GLB brain with hologram material ────────────────────────────────────────

function HoloBrain() {
  const { scene } = useGLTF('/models/brain_hologram.glb');
  const groupRef = useRef<THREE.Group>(null);

  // Normalize size, center, and apply materials — runs once per scene reference
  const wireScene = useMemo(() => {
    const bbox = new THREE.Box3().setFromObject(scene);
    const size = bbox.getSize(new THREE.Vector3());
    const center = bbox.getCenter(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = 2.2 / maxDim;

    scene.scale.setScalar(scale);
    scene.position.sub(center.multiplyScalar(scale));

    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = new THREE.MeshStandardMaterial({
          color: '#1a1a30',
          emissive: '#7F77DD',
          emissiveIntensity: 0.18,
          roughness: 0.75,
          metalness: 0.15,
          transparent: true,
          opacity: 0.82,
        });
      }
    });

    const wire = scene.clone();
    wire.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = new THREE.MeshBasicMaterial({
          color: '#7F77DD',
          wireframe: true,
          transparent: true,
          opacity: 0.06,
        });
      }
    });

    return wire;
  }, [scene]);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += 0.0012;
    groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.08) * 0.08;
  });

  return (
    <group ref={groupRef}>
      <primitive object={scene} />
      <primitive object={wireScene} />
    </group>
  );
}

// ─── BrainBackgroundInner ─────────────────────────────────────────────────────

export default function BrainBackgroundInner() {
  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      zIndex: 0,
      pointerEvents: 'none',
      opacity: 0.85,
    }}>
      <Canvas
        camera={{ position: [0, 0.2, 4.0], fov: 44 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent', width: '100%', height: '100%' }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.25} />
          <directionalLight position={[2, 4, 3]} intensity={0.9} color="#c8c0ff" />
          <pointLight position={[-3, 2, 2]} intensity={0.6} color="#1D9E75" />
          <pointLight position={[3, -2, -2]} intensity={0.4} color="#D85A30" />
          <pointLight position={[0, -3, 2]} intensity={0.3} color="#7F77DD" />
          <HoloBrain />
        </Suspense>
      </Canvas>
    </div>
  );
}

useGLTF.preload('/models/brain_hologram.glb');
