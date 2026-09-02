'use client';

import { Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

// ─── GLB brain with hologram material ────────────────────────────────────────

function HoloBrain({ onInteract }: { onInteract?: () => void }) {
  const { scene } = useGLTF('/models/brain_hologram.glb');

  const { wireScene, glowScene } = useMemo(() => {
    const bbox   = new THREE.Box3().setFromObject(scene);
    const size   = bbox.getSize(new THREE.Vector3());
    const center = bbox.getCenter(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale  = 2.2 / maxDim;

    scene.scale.setScalar(scale);
    scene.position.sub(center.multiplyScalar(scale));

    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = new THREE.MeshStandardMaterial({
          color:            '#0a0e1a',
          emissive:         '#6C63FF',
          emissiveIntensity: 0.35,
          roughness:         0.65,
          metalness:         0.2,
          transparent:       true,
          opacity:           0.92,
        });
      }
    });

    // Wireframe overlay
    const wireScene = scene.clone();
    wireScene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = new THREE.MeshBasicMaterial({
          color:       '#6C63FF',
          wireframe:   true,
          transparent: true,
          opacity:     0.12,
        });
      }
    });

    // Outer glow shell, slightly larger, BackSide creates halo
    const glowScene = scene.clone();
    glowScene.scale.multiplyScalar(1.08);
    glowScene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = new THREE.MeshBasicMaterial({
          color:       '#6C63FF',
          transparent: true,
          opacity:     0.04,
          side:        THREE.BackSide,
        });
      }
    });

    return { wireScene, glowScene };
  }, [scene]);

  return (
    <>
      <group>
        <primitive object={scene} />
        <primitive object={wireScene} />
        <primitive object={glowScene} />
      </group>
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        enableRotate={true}
        autoRotate={true}
        autoRotateSpeed={0.6}
        rotateSpeed={0.5}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={(3 * Math.PI) / 4}
        onStart={onInteract}
      />
    </>
  );
}

// ─── BrainBackgroundInner ─────────────────────────────────────────────────────

export default function BrainBackgroundInner({ onInteract }: { onInteract?: () => void }) {
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
      <Canvas
        camera={{ position: [0, 0.2, 4.0], fov: 44 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent', width: '100%', height: '100%' }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.2} />
          <directionalLight position={[2, 4, 3]} intensity={1.3} color="#c4c0ff" />
          <pointLight position={[-4, 3, 2]}  intensity={1.0} color="#6C63FF" />
          <pointLight position={[4, -2, -2]} intensity={0.6} color="#9B94FF" />
          <pointLight position={[0, 3, -4]}  intensity={0.4} color="#4A43CC" />
          <HoloBrain onInteract={onInteract} />
        </Suspense>
      </Canvas>
    </div>
  );
}

useGLTF.preload('/models/brain_hologram.glb');
