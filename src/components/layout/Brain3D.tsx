'use client';

import { Suspense, useRef, useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, QuadraticBezierLine, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

// ─── Types ────────────────────────────────────────────────────────────────────

type LobeKey =
  | 'frontal'
  | 'parietal'
  | 'temporal_L'
  | 'temporal_R'
  | 'occipital'
  | 'cerebellum'
  | 'brainstem';

interface LobeData {
  position: [number, number, number];
  scale: [number, number, number];
  baseRadius: number;
  deform: { x: number; y: number; z: number };
  sectionColor: string;
  section: string;
  label: string;
}

// ─── Lobe definitions ─────────────────────────────────────────────────────────

const LOBES: Record<LobeKey, LobeData> = {
  frontal: {
    position: [0, 0.15, 0.55],
    scale: [1.05, 0.88, 0.92],
    baseRadius: 0.62,
    deform: { x: 1.0, y: 0.82, z: 1.12 },
    sectionColor: '#1D9E75',
    section: 'research',
    label: 'Frontal Lobe',
  },
  parietal: {
    position: [0, 0.52, -0.18],
    scale: [0.95, 0.78, 0.82],
    baseRadius: 0.56,
    deform: { x: 1.05, y: 0.85, z: 0.95 },
    sectionColor: '#1D9E75',
    section: 'research',
    label: 'Parietal Lobe',
  },
  temporal_L: {
    position: [-0.82, -0.12, 0.08],
    scale: [0.52, 0.48, 0.88],
    baseRadius: 0.5,
    deform: { x: 0.7, y: 0.72, z: 1.35 },
    sectionColor: '#1D9E75',
    section: 'research',
    label: 'Temporal Lobe (L)',
  },
  temporal_R: {
    position: [0.82, -0.12, 0.08],
    scale: [0.52, 0.48, 0.88],
    baseRadius: 0.5,
    deform: { x: 0.7, y: 0.72, z: 1.35 },
    sectionColor: '#BA7517',
    section: 'projects',
    label: 'Temporal Lobe (R)',
  },
  occipital: {
    position: [0, 0.08, -0.82],
    scale: [0.78, 0.68, 0.72],
    baseRadius: 0.52,
    deform: { x: 0.92, y: 0.88, z: 0.82 },
    sectionColor: '#BA7517',
    section: 'projects',
    label: 'Occipital Lobe',
  },
  cerebellum: {
    position: [0, -0.62, -0.58],
    scale: [0.95, 0.52, 0.68],
    baseRadius: 0.55,
    deform: { x: 1.25, y: 0.65, z: 0.88 },
    sectionColor: '#D85A30',
    section: 'experience',
    label: 'Cerebellum',
  },
  brainstem: {
    position: [0, -0.95, -0.15],
    scale: [0.28, 0.52, 0.28],
    baseRadius: 0.28,
    deform: { x: 0.55, y: 1.6, z: 0.55 },
    sectionColor: '#7F77DD',
    section: 'contact',
    label: 'Brainstem',
  },
};

const CONNECTIONS: [LobeKey, LobeKey][] = [
  ['frontal',    'parietal'],
  ['parietal',   'occipital'],
  ['parietal',   'temporal_L'],
  ['parietal',   'temporal_R'],
  ['occipital',  'cerebellum'],
  ['cerebellum', 'brainstem'],
  ['frontal',    'temporal_L'],
  ['frontal',    'temporal_R'],
];

const LOBE_KEYS = Object.keys(LOBES) as LobeKey[];
const PARTICLE_COUNT = CONNECTIONS.length * 2;

const LEGEND = [
  { label: 'Research',   color: '#1D9E75', section: 'research'   },
  { label: 'Projects',   color: '#BA7517', section: 'projects'   },
  { label: 'Experience', color: '#D85A30', section: 'experience' },
  { label: 'Contact',    color: '#7F77DD', section: 'contact'    },
];

// ─── Geometry helpers ─────────────────────────────────────────────────────────

function createLobeGeometry(
  baseRadius: number,
  deform: { x: number; y: number; z: number },
  segments = 48,
): THREE.BufferGeometry {
  const geo = new THREE.SphereGeometry(baseRadius, segments, segments);
  const pos = geo.attributes.position as THREE.BufferAttribute;

  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);

    const nx = x * deform.x;
    const ny = y * deform.y;
    const nz = z * deform.z;

    const noise =
      Math.sin(x * 4.2 + y * 3.1) *
      Math.cos(y * 3.8 + z * 2.9) *
      Math.sin(z * 3.5 + x * 4.1) *
      0.04 *
      baseRadius;

    const len = Math.sqrt(nx * nx + ny * ny + nz * nz) || 1;
    pos.setXYZ(
      i,
      nx + (nx / len) * noise,
      ny + (ny / len) * noise,
      nz + (nz / len) * noise,
    );
  }

  geo.computeVertexNormals();
  return geo;
}

function createCerebellumGeometry(
  baseRadius: number,
  deform: { x: number; y: number; z: number },
  segments = 48,
): THREE.BufferGeometry {
  const geo = new THREE.SphereGeometry(baseRadius, segments, segments);
  const pos = geo.attributes.position as THREE.BufferAttribute;

  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);

    const nx = x * deform.x;
    const ny = y * deform.y;
    const nz = z * deform.z;

    const noise =
      Math.sin(x * 4.2 + y * 3.1) *
      Math.cos(y * 3.8 + z * 2.9) *
      Math.sin(z * 3.5 + x * 4.1) *
      0.04 *
      baseRadius;

    const len = Math.sqrt(nx * nx + ny * ny + nz * nz) || 1;
    pos.setXYZ(
      i,
      nx + (nx / len) * noise,
      ny + (ny / len) * noise,
      nz + (nz / len) * noise,
    );
  }

  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);

    const distFromCenter = Math.abs(x);
    if (distFromCenter < 0.15) {
      const groove = (1 - distFromCenter / 0.15) * 0.06;
      pos.setY(i, y - groove);
    }

    const foliaRidge = Math.sin(z * 18) * 0.015;
    pos.setZ(i, z + foliaRidge);
  }

  geo.computeVertexNormals();
  return geo;
}

// ─── Misc helpers ─────────────────────────────────────────────────────────────

function seededRandom(seed: number): number {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

function getMid(
  a: [number, number, number],
  b: [number, number, number],
): [number, number, number] {
  return [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2 + 0.2, (a[2] + b[2]) / 2];
}

function bezierPoint(
  t: number,
  start: [number, number, number],
  mid: [number, number, number],
  end: [number, number, number],
): [number, number, number] {
  const s = 1 - t;
  return [
    s * s * start[0] + 2 * s * t * mid[0] + t * t * end[0],
    s * s * start[1] + 2 * s * t * mid[1] + t * t * end[1],
    s * s * start[2] + 2 * s * t * mid[2] + t * t * end[2],
  ];
}

// ─── NIHBrain ─────────────────────────────────────────────────────────────────
// Visual-only layer: anatomically correct GLB with hover-reactive material.
// Raycasting is handled by the invisible LobeMesh components below.

const NIH_NODE = 'Brain_MRI_Nevit%20Dilmenstl';

function NIHBrain({ hoveredLobe }: { hoveredLobe: LobeKey | null }) {
  const { nodes } = useGLTF('/models/brain.glb') as any;
  const solidRef = useRef<THREE.Mesh>(null!);

  const geometry: THREE.BufferGeometry | undefined = nodes[NIH_NODE]?.geometry;

  // Normalize the GLB to fit within a 2.2-unit bounding box (lobe coordinate space)
  const [normalizedScale, centerOffset] = useMemo((): [number, [number, number, number]] => {
    if (!geometry) return [1, [0, 0, 0]];
    geometry.computeBoundingBox();
    const bbox = geometry.boundingBox!;
    const size = new THREE.Vector3();
    bbox.getSize(size);
    const scale = 2.2 / Math.max(size.x, size.y, size.z);
    const center = new THREE.Vector3();
    bbox.getCenter(center);
    return [scale, [-center.x * scale, -center.y * scale, -center.z * scale]];
  }, [geometry]);

  // Pre-compute section colors to avoid per-frame allocations
  const sectionColors = useMemo(
    () =>
      Object.fromEntries(
        LOBE_KEYS.map((k) => [k, new THREE.Color(LOBES[k].sectionColor)]),
      ) as Record<LobeKey, THREE.Color>,
    [],
  );
  const darkColor   = useMemo(() => new THREE.Color('#1e1e38'), []);
  const purpleColor = useMemo(() => new THREE.Color('#7F77DD'), []);

  useFrame(() => {
    if (!solidRef.current) return;
    const mat = solidRef.current.material as THREE.MeshStandardMaterial;
    const target = hoveredLobe ? sectionColors[hoveredLobe] : darkColor;
    mat.color.lerp(target, 0.08);
    mat.emissive.lerp(hoveredLobe ? sectionColors[hoveredLobe] : purpleColor, 0.08);
    mat.emissiveIntensity = THREE.MathUtils.lerp(
      mat.emissiveIntensity,
      hoveredLobe ? 0.2 : 0.08,
      0.1,
    );
  });

  if (!geometry) return null;

  return (
    <group position={centerOffset} scale={normalizedScale}>
      <mesh ref={solidRef} geometry={geometry} castShadow>
        <meshStandardMaterial
          color="#1e1e38"
          emissive="#7F77DD"
          emissiveIntensity={0.08}
          roughness={0.75}
          metalness={0.1}
        />
      </mesh>
      <mesh geometry={geometry}>
        <meshBasicMaterial wireframe color="#7F77DD" opacity={0.04} transparent />
      </mesh>
    </group>
  );
}

useGLTF.preload('/models/brain.glb');

// ─── LobeMesh (invisible raycaster) ──────────────────────────────────────────
// Geometry matches the lobe regions for hit-testing. Material is fully
// transparent — all visual feedback lives on NIHBrain instead.

function LobeMesh({
  lobeKey,
  onHover,
  onUnhover,
  onClick,
}: {
  lobeKey: LobeKey;
  onHover: (key: LobeKey) => void;
  onUnhover: () => void;
  onClick: (key: LobeKey) => void;
}) {
  const lobe = LOBES[lobeKey];

  const geometry = useMemo(
    () =>
      lobeKey === 'cerebellum'
        ? createCerebellumGeometry(lobe.baseRadius, lobe.deform, 48)
        : createLobeGeometry(lobe.baseRadius, lobe.deform, 48),
    [lobeKey], // eslint-disable-line react-hooks/exhaustive-deps
  );

  useEffect(() => () => { geometry.dispose(); }, [geometry]);

  return (
    <group position={lobe.position}>
      <group scale={lobe.scale}>
        <mesh
          geometry={geometry}
          onPointerOver={(e) => { e.stopPropagation(); onHover(lobeKey); }}
          onPointerOut={() => onUnhover()}
          onClick={(e) => { e.stopPropagation(); onClick(lobeKey); }}
        >
          <meshBasicMaterial transparent opacity={0} />
        </mesh>
      </group>
    </group>
  );
}

// ─── CorpusCallosum ───────────────────────────────────────────────────────────

function CorpusCallosum() {
  const curve = useMemo(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(-0.82, -0.12, 0.08),
        new THREE.Vector3(-0.3,  0.1,  0.0),
        new THREE.Vector3(0,     0.15, 0.0),
        new THREE.Vector3(0.3,   0.1,  0.0),
        new THREE.Vector3(0.82, -0.12, 0.08),
      ]),
    [],
  );

  return (
    <mesh>
      <tubeGeometry args={[curve, 20, 0.04, 8, false]} />
      <meshStandardMaterial
        color="#2a2a4a"
        emissive="#7F77DD"
        emissiveIntensity={0.06}
        roughness={0.9}
        transparent
        opacity={0.5}
      />
    </mesh>
  );
}

// ─── Connections ──────────────────────────────────────────────────────────────

function Connections({ hoveredLobe }: { hoveredLobe: LobeKey | null }) {
  return (
    <>
      {CONNECTIONS.map(([a, b], i) => {
        const isActive = hoveredLobe === a || hoveredLobe === b;
        const color    = isActive && hoveredLobe ? LOBES[hoveredLobe].sectionColor : '#7F77DD';
        const start    = LOBES[a].position;
        const end      = LOBES[b].position;
        const mid      = getMid(start, end);

        return (
          <QuadraticBezierLine
            key={i}
            start={start}
            end={end}
            mid={mid}
            color={color}
            lineWidth={isActive ? 1.2 : 0.5}
            opacity={isActive ? 0.7 : 0.18}
            transparent
            dashed
            dashScale={3}
          />
        );
      })}
    </>
  );
}

// ─── SignalParticles ──────────────────────────────────────────────────────────

function SignalParticles() {
  const meshRef = useRef<THREE.InstancedMesh>(null!);
  const dummy   = useMemo(() => new THREE.Object3D(), []);

  const tData = useRef(
    Float32Array.from({ length: CONNECTIONS.length * 4 }, (_, i) => {
      const ci   = Math.floor(i / 4);
      const slot = i % 4;
      if (slot === 0) return seededRandom(ci * 10) * 0.5;
      if (slot === 1) return 0.004 + seededRandom(ci * 10 + 1) * 0.003;
      if (slot === 2) return (seededRandom(ci * 10 + 2) * 0.5 + 0.5) % 1;
      return 0.004 + seededRandom(ci * 10 + 3) * 0.003;
    }),
  );

  useFrame(() => {
    if (!meshRef.current) return;
    const t = tData.current;
    let idx = 0;

    for (let ci = 0; ci < CONNECTIONS.length; ci++) {
      const [a, b] = CONNECTIONS[ci];
      const start  = LOBES[a].position;
      const end    = LOBES[b].position;
      const mid    = getMid(start, end);
      const base   = ci * 4;

      for (let p = 0; p < 2; p++) {
        const ti = base + p * 2;
        t[ti] += t[ti + 1];
        if (t[ti] > 1) t[ti] -= 1;

        const [px, py, pz] = bezierPoint(t[ti], start, mid, end);
        dummy.position.set(px, py, pz);
        dummy.updateMatrix();
        meshRef.current.setMatrixAt(idx, dummy.matrix);
        idx++;
      }
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, PARTICLE_COUNT]}>
      <sphereGeometry args={[0.018, 8, 8]} />
      <meshBasicMaterial color="#5DCAA5" transparent opacity={0.85} />
    </instancedMesh>
  );
}

// ─── Scene ────────────────────────────────────────────────────────────────────

function Scene({
  hoveredLobe,
  setHoveredLobe,
  onLobeClick,
  miniMode = false,
  heroMode = false,
}: {
  hoveredLobe: LobeKey | null;
  setHoveredLobe: (k: LobeKey | null) => void;
  onLobeClick: (k: LobeKey) => void;
  miniMode?: boolean;
  heroMode?: boolean;
}) {
  return (
    <>
      <ambientLight intensity={0.2} />
      <directionalLight position={[2, 4, 3]}   intensity={1.1} color="#c8c0ff" castShadow={false} />
      <pointLight       position={[-3, 2, 2]}   intensity={0.7} color="#1D9E75" />
      <pointLight       position={[3, -1, -2]}  intensity={0.5} color="#D85A30" />
      <pointLight       position={[0, -2, 2]}   intensity={0.3} color="#BA7517" />
      <hemisphereLight  args={['#7F77DD', '#0a0a12', 0.4]} />

      <NIHBrain hoveredLobe={hoveredLobe} />

      {!(miniMode || heroMode) && LOBE_KEYS.map(key => (
        <LobeMesh
          key={key}
          lobeKey={key}
          onHover={setHoveredLobe}
          onUnhover={() => setHoveredLobe(null)}
          onClick={onLobeClick}
        />
      ))}

      <CorpusCallosum />
      <Connections hoveredLobe={hoveredLobe} />
      <SignalParticles />

      <OrbitControls
        target={[0, -0.1, 0]}
        enableZoom={false}
        enablePan={false}
        enableRotate={!(miniMode || heroMode)}
        autoRotate
        autoRotateSpeed={heroMode ? 0.35 : miniMode ? 0.8 : 0.5}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={(3 * Math.PI) / 4}
      />
    </>
  );
}

// ─── Brain3D ──────────────────────────────────────────────────────────────────

interface Brain3DProps {
  onSectionClick?: (section: string) => void;
  miniMode?: boolean;
  heroMode?: boolean;
  layoutId?: string;
}

export default function Brain3D({ onSectionClick, miniMode = false, heroMode = false, layoutId }: Brain3DProps) {
  const [hoveredLobe, setHoveredLobe] = useState<LobeKey | null>(null);
  const noInteraction = miniMode || heroMode;

  useEffect(() => {
    if (noInteraction) return;
    document.body.style.cursor = hoveredLobe ? 'pointer' : 'default';
    return () => { document.body.style.cursor = 'default'; };
  }, [hoveredLobe, noInteraction]);

  return (
    <motion.div
      layoutId={layoutId}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        minHeight: noInteraction ? 0 : '500px',
        opacity: heroMode ? 0.55 : 1,
      }}
    >
      {/* Vignette — skipped in heroMode (Hero provides its own gradient) */}
      {!heroMode && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse at center, transparent 40%, #0a0a12 100%)',
            pointerEvents: 'none',
            zIndex: 1,
          }}
        />
      )}

      <Canvas
        camera={{ position: [0, 0.3, heroMode ? 3.2 : miniMode ? 3.2 : 3.8], fov: heroMode ? 50 : 42 }}
        dpr={[1, noInteraction ? 1 : 1.5]}
        performance={{ min: 0.5 }}
        style={{ background: 'transparent', width: '100%', height: '100%' }}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <Scene
            hoveredLobe={hoveredLobe}
            setHoveredLobe={setHoveredLobe}
            onLobeClick={(key) => onSectionClick?.(LOBES[key].section)}
            miniMode={miniMode}
            heroMode={heroMode}
          />
        </Suspense>
      </Canvas>

      {/* Section legend — hidden in miniMode / heroMode */}
      <div
        style={{
          display: noInteraction ? 'none' : 'flex',
          position: 'absolute',
          bottom: '24px',
          left: 0,
          right: 0,
          justifyContent: 'center',
          gap: '24px',
          zIndex: 2,
          pointerEvents: 'auto',
        }}
      >
        {LEGEND.map(item => (
          <button
            key={item.section}
            onClick={() => onSectionClick?.(item.section)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '12px',
              fontFamily: 'var(--font-jetbrains-mono, monospace)',
              color: '#9898b0',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#f0f0f5'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#9898b0'; }}
          >
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: item.color, flexShrink: 0 }} />
            {item.label}
          </button>
        ))}
      </div>
    </motion.div>
  );
}
