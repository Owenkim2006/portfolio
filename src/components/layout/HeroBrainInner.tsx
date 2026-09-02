'use client';

import { useRef, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

function BrainScene() {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF('/models/brain.glb');

  useEffect(() => {
    // Reset to the raw, untransformed geometry before measuring, React's
    // Strict Mode double-invokes effects in development, and without this
    // reset the second pass would measure the already-normalized (2.2-unit)
    // bounding box and rescale it back down to 1x, shrinking the brain to
    // its raw (much smaller) size. Resetting first makes this idempotent.
    scene.scale.set(1, 1, 1);
    scene.position.set(0, 0, 0);

    // Normalize to fit 2.2 unit bounding box
    const bbox = new THREE.Box3().setFromObject(scene);
    const size = bbox.getSize(new THREE.Vector3());
    const center = bbox.getCenter(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = 2.2 / maxDim;

    scene.scale.setScalar(scale);
    scene.position.set(
      -center.x * scale,
      -center.y * scale,
      -center.z * scale
    );

    // Apply the electric blue wireframe aesthetic
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        // Solid dark base mesh
        child.material = new THREE.MeshStandardMaterial({
          color: '#020818',
          emissive: '#1a3aff',
          emissiveIntensity: 0.15,
          roughness: 0.8,
          metalness: 0.1,
          transparent: true,
          opacity: 0.85,
        });
      }
    });
  }, [scene]);

  return (
    <group ref={groupRef}>
      {/* Base solid mesh */}
      <primitive object={scene} />

      {/* Wireframe overlay, the glowing blue lines */}
      <WireframeOverlay scene={scene} />

      {/* Outer glow shell */}
      <GlowShell scene={scene} />
    </group>
  );
}

function WireframeOverlay({ scene }: { scene: THREE.Object3D }) {
  const wireRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (!wireRef.current) return;

    // Each wire copies its source mesh's *local* transform, which is only
    // equivalent to the mesh's position in `scene`-local space (not world
    // space). Reparenting this group into `scene` itself means it inherits
    // `scene`'s own normalization scale/position automatically, so the
    // combined transform matches the base mesh exactly. Also: `.clear()`
    // guards against React Strict Mode's double effect invocation in dev,
    // which would otherwise duplicate every line segment.
    wireRef.current.clear();
    scene.add(wireRef.current);

    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        // Primary wireframe, bright electric blue
        const wireGeo = new THREE.WireframeGeometry(child.geometry);
        const wireMat = new THREE.LineBasicMaterial({
          color: '#4488ff',
          transparent: true,
          opacity: 0.55,
        });
        const wire = new THREE.LineSegments(wireGeo, wireMat);
        wire.scale.copy(child.scale);
        wire.position.copy(child.position);
        wire.rotation.copy(child.rotation);
        wireRef.current?.add(wire);

        // Secondary wireframe, brighter highlight lines
        const wire2Mat = new THREE.LineBasicMaterial({
          color: '#88bbff',
          transparent: true,
          opacity: 0.25,
        });
        const wire2 = new THREE.LineSegments(wireGeo, wire2Mat);
        wire2.scale.copy(child.scale);
        wire2.position.copy(child.position);
        wire2.rotation.copy(child.rotation);
        wireRef.current?.add(wire2);
      }
    });

    // React's reconciler thinks this group's parent is the outer <group>
    // from the JSX tree and will try to remove it from there on unmount 
    // but we reparented it into `scene` above, so clean that up explicitly.
    const wireGroup = wireRef.current;
    return () => {
      scene.remove(wireGroup);
    };
  }, [scene]);

  return <group ref={wireRef} />;
}

function GlowShell({ scene }: { scene: THREE.Object3D }) {
  const glowRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (!glowRef.current) return;

    // Same reasoning as WireframeOverlay: reparent into `scene` so this
    // group inherits the normalization scale/position, and clear first so
    // Strict Mode's double-invoke in dev doesn't duplicate the glow mesh.
    glowRef.current.clear();
    scene.add(glowRef.current);

    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const glowMesh = new THREE.Mesh(
          child.geometry,
          new THREE.MeshBasicMaterial({
            color: '#2255ff',
            transparent: true,
            opacity: 0.06,
            side: THREE.BackSide,
          })
        );
        glowMesh.scale.copy(child.scale).multiplyScalar(1.08);
        glowMesh.position.copy(child.position);
        glowMesh.rotation.copy(child.rotation);
        glowRef.current?.add(glowMesh);
      }
    });

    // Same reconciler-vs-reparenting mismatch as WireframeOverlay.
    const glowGroup = glowRef.current;
    return () => {
      scene.remove(glowGroup);
    };
  }, [scene]);

  return <group ref={glowRef} />;
}

interface HeroBrainInnerProps {
  interactive?: boolean;
}

export default function HeroBrainInner({ interactive = true }: HeroBrainInnerProps) {
  return (
    <Canvas
      camera={{ position: [0, 0.1, 3.8], fov: 46 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: 'transparent', cursor: interactive ? 'grab' : 'default' }}
      performance={{ min: 0.5 }}
    >
      {/* Lighting to create the electric blue glow effect */}
      <ambientLight intensity={0.05} />

      {/* Main blue key light */}
      <pointLight
        position={[3, 3, 3]}
        intensity={3.0}
        color="#2255ff"
      />

      {/* Rim light, bright blue highlight */}
      <pointLight
        position={[-3, 2, -1]}
        intensity={2.5}
        color="#4488ff"
      />

      {/* Top light, white-blue for detail */}
      <pointLight
        position={[0, 4, 2]}
        intensity={1.5}
        color="#aabbff"
      />

      {/* Back fill, deep blue */}
      <pointLight
        position={[0, -3, -3]}
        intensity={1.0}
        color="#0022aa"
      />

      <Suspense fallback={null}>
        <BrainScene />
      </Suspense>

      <OrbitControls
        enabled={interactive}
        enableRotate={interactive}
        enableZoom={false}
        enablePan={false}
        autoRotate={true}
        autoRotateSpeed={0.5}
        rotateSpeed={0.5}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={(3 * Math.PI) / 4}
      />
    </Canvas>
  );
}

useGLTF.preload('/models/brain.glb');
