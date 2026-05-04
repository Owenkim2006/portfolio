'use client';

import { useEffect, useRef } from 'react';

interface Node {
  x: number;
  y: number;
  radius: number;
  baseA: number;
  fireLevel: number;
  fireTarget: number;
  intensity: number;
  glowIntensity: number;
  isFiring: boolean;
  neighbors: number[];
}

interface Edge {
  a: number;
  b: number;
  baseAlpha: number;
}

interface Signal {
  from: number;
  to: number;
  startMs: number;
  duration: number;
  hop: number;
  fromIntensity: number;
}

const CONN_THRESHOLD = 207;
const NEIGHBOR_MAX = 3;
const MAX_SIGNALS = 8;
const CHAIN_PROB = 0.4;
const MAX_HOPS = 3;
const CURSOR_RADIUS = 130;

function easeInOut(t: number): number {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

export default function NeuronCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });

  // Dedicated effect for mouse tracking — reads through pointer-events: none canvas
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Main animation effect
  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;

    let W = 0, H = 0;
    let lastMs = 0;
    let fireTimer = 300;
    let rafId = 0;

    const nodes: Node[] = [];
    const edges: Edge[] = [];
    const signals: Signal[] = [];

    function buildNodes() {
      nodes.length = 0;
      edges.length = 0;
      signals.length = 0;

      const count = 168 + Math.floor(Math.random() * 85); // 168-252
      for (let i = 0; i < count; i++) {
        nodes.push({
          x: Math.random() * W,
          y: Math.random() * H,
          radius: 1.2 + Math.random() * 1.6,   // 1.2–2.8 px
          baseA: 0.3 + Math.random() * 0.3,
          fireLevel: 0,
          fireTarget: 0,
          intensity: 1,
          glowIntensity: 0,
          isFiring: false,
          neighbors: [],
        });
      }

      // Nearest neighbors within connection threshold
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        const dists: { idx: number; d: number }[] = [];
        for (let j = 0; j < nodes.length; j++) {
          if (i === j) continue;
          const dx = a.x - nodes[j].x;
          const dy = a.y - nodes[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < CONN_THRESHOLD) dists.push({ idx: j, d });
        }
        dists.sort((x, y) => x.d - y.d);
        a.neighbors = dists.slice(0, NEIGHBOR_MAX).map(entry => entry.idx);
      }

      // Undirected edge list — closer pairs get slightly higher base alpha
      const seen = new Set<string>();
      for (let i = 0; i < nodes.length; i++) {
        for (const j of nodes[i].neighbors) {
          const key = i < j ? `${i},${j}` : `${j},${i}`;
          if (seen.has(key)) continue;
          seen.add(key);
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          edges.push({ a: i, b: j, baseAlpha: 0.06 + (1 - d / CONN_THRESHOLD) * 0.06 });
        }
      }
    }

    function resize() {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
      buildNodes();
    }

    function fireNode(idx: number, intensity: number, hop: number) {
      if (signals.length >= MAX_SIGNALS) return;
      const node = nodes[idx];
      node.fireTarget = Math.max(node.fireTarget, intensity);
      node.intensity = intensity;
      node.isFiring = true;
      if (node.neighbors.length === 0) return;
      const toIdx = node.neighbors[Math.floor(Math.random() * node.neighbors.length)];
      signals.push({
        from: idx,
        to: toIdx,
        startMs: lastMs,
        duration: 400 + Math.random() * 200,
        hop,
        fromIntensity: intensity,
      });
    }

    function tick(ts: number) {
      if (!lastMs) lastMs = ts;
      const dt = Math.min(ts - lastMs, 50);
      lastMs = ts;

      ctx.clearRect(0, 0, W, H);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      // ── Update fire levels + cursor proximity ─────────────────────────────
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];

        // Fire rise/decay
        if (n.fireTarget > 0) {
          n.fireLevel = Math.min(n.fireTarget, n.fireLevel + dt / 150);
          if (n.fireLevel >= n.fireTarget) n.fireTarget = 0;
        } else if (n.fireLevel > 0) {
          n.fireLevel = Math.max(0, n.fireLevel - dt / 300);
          if (n.fireLevel === 0) n.isFiring = false;
        }

        // Cursor proximity — drives glowIntensity independently of fire
        const dx = n.x - mx;
        const dy = n.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < CURSOR_RADIUS) {
          const proximity = 1 - dist / CURSOR_RADIUS; // 0 at edge, 1 at center
          n.glowIntensity = Math.min(1, n.glowIntensity + proximity * 0.08);

          if (proximity > 0.6 && !n.isFiring && Math.random() < 0.02) {
            fireNode(i, 1, 0);
          }
        } else {
          n.glowIntensity = Math.max(0, n.glowIntensity - 0.03);
        }
      }

      // ── Ambient fire spawning ─────────────────────────────────────────────
      fireTimer -= dt;
      if (fireTimer <= 0 && signals.length < MAX_SIGNALS) {
        fireTimer = 200 + Math.random() * 200;
        fireNode(Math.floor(Math.random() * nodes.length), 1, 0);
      }

      // ── Advance signals ───────────────────────────────────────────────────
      for (let i = signals.length - 1; i >= 0; i--) {
        const s = signals[i];
        const progress = (ts - s.startMs) / s.duration;
        if (progress >= 1) {
          const destIntensity = s.fromIntensity * 0.8;
          const dest = nodes[s.to];
          dest.fireTarget = Math.max(dest.fireTarget, destIntensity);
          dest.intensity = destIntensity;
          if (s.hop < MAX_HOPS && Math.random() < CHAIN_PROB) {
            fireNode(s.to, destIntensity, s.hop + 1);
          }
          signals.splice(i, 1);
        }
      }

      // ── Draw edges ────────────────────────────────────────────────────────
      for (const e of edges) {
        const na = nodes[e.a], nb = nodes[e.b];
        const edgeGlow = Math.max(na.glowIntensity, nb.glowIntensity, na.fireLevel, nb.fireLevel);
        if (edgeGlow > 0.1) {
          ctx.strokeStyle = `rgba(93,202,165,${(0.08 + edgeGlow * 0.35).toFixed(3)})`;
          ctx.lineWidth = 0.4 + edgeGlow * 0.8;
        } else {
          ctx.strokeStyle = `rgba(127,119,221,${e.baseAlpha.toFixed(3)})`;
          ctx.lineWidth = 0.4;
        }
        ctx.beginPath();
        ctx.moveTo(na.x, na.y);
        ctx.lineTo(nb.x, nb.y);
        ctx.stroke();
      }

      // ── Draw signal particles ─────────────────────────────────────────────
      for (const s of signals) {
        const t = easeInOut(Math.min(1, (ts - s.startMs) / s.duration));
        const fa = nodes[s.from], tb = nodes[s.to];
        const px = fa.x + (tb.x - fa.x) * t;
        const py = fa.y + (tb.y - fa.y) * t;
        ctx.beginPath();
        ctx.arc(px, py, 2, 0, Math.PI * 2);
        ctx.shadowColor = '#5DCAA5';
        ctx.shadowBlur = 10;
        ctx.fillStyle = `rgba(93,202,165,${(0.7 + s.fromIntensity * 0.3).toFixed(2)})`;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // ── Draw nodes ────────────────────────────────────────────────────────
      for (const n of nodes) {
        // Combine cursor glow and fire animation — whichever is stronger drives the look
        const eff = Math.max(n.glowIntensity, n.fireLevel);

        // Outer glow halo for active nodes
        if (eff > 0.2) {
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.radius + eff * 6, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(93,202,165,${(eff * 0.08).toFixed(3)})`;
          ctx.fill();
        }

        // Core dot — teal when active, purple at rest
        ctx.beginPath();
        ctx.arc(n.x, n.y, Math.max(0.5, n.radius + eff * 2.5), 0, Math.PI * 2);
        ctx.fillStyle = eff > 0.1
          ? `rgba(93,202,165,${Math.min(1, 0.35 + eff * 0.65).toFixed(3)})`
          : `rgba(127,119,221,${Math.min(1, 0.35 + eff * 0.3).toFixed(3)})`;
        ctx.fill();
      }

      rafId = requestAnimationFrame(tick);
    }

    resize();
    window.addEventListener('resize', resize);
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{ opacity: 0.28, zIndex: 0 }}
      className="fixed inset-0 w-full h-full pointer-events-none"
    />
  );
}
