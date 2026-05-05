'use client';

import { useEffect, useRef } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Neighbor {
  nodeIdx: number;
  edgeIdx: number;
}

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
  neighbors: Neighbor[];
  // Precomputed organic geometry — set once in buildNodes
  dendriteAngles: number[];
  dendriteLengths: number[];
  // Arrival burst state
  burstActive: boolean;
  burstStartMs: number;
  burstAngles: number[];
}

interface Edge {
  a: number;
  b: number;
  baseAlpha: number;
  // Precomputed bezier control point
  cpX: number;
  cpY: number;
  // Dynamic
  axonBrightness: number;
  lastFiredMs: number;
}

interface Signal {
  edgeIdx: number;
  from: number;
  to: number;
  startMs: number;
  duration: number;
  hop: number;
  fromIntensity: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const CONN_THRESHOLD  = 180;
const NEIGHBOR_MAX    = 4;
const MAX_SIGNALS     = 16;
const CHAIN_PROB      = 0.4;
const MAX_HOPS        = 3;
const CURSOR_RADIUS   = 130;
const AXON_CURSOR_R   = 15;          // px — cursor proximity to axon

// ─── Pure helpers (defined outside effects so TS sees them) ──────────────────

function easeInOut(t: number): number {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

function bezierPt(
  ax: number, ay: number,
  cpx: number, cpy: number,
  bx: number, by: number,
  t: number,
): { x: number; y: number } {
  const mt = 1 - t;
  return {
    x: mt * mt * ax + 2 * mt * t * cpx + t * t * bx,
    y: mt * mt * ay + 2 * mt * t * cpy + t * t * by,
  };
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function NeuronCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef  = useRef({ x: -9999, y: -9999 });

  // Dedicated effect — reads cursor through pointer-events: none canvas
  useEffect(() => {
    const onMove = (e: MouseEvent) => { mouseRef.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx    = canvas.getContext('2d')!;

    let W = 0, H = 0;
    let lastMs    = 0;
    let fireTimer = 300;
    let rafId     = 0;

    const nodes:   Node[]   = [];
    const edges:   Edge[]   = [];
    const signals: Signal[] = [];

    // ── Build scene geometry ──────────────────────────────────────────────────

    function buildNodes() {
      nodes.length = 0;
      edges.length = 0;
      signals.length = 0;

      const count = Math.max(40, Math.floor(160 * (W / 1920)));

      // 1. Create nodes with precomputed dendrite geometry
      for (let i = 0; i < count; i++) {
        const numD = 2 + Math.floor(Math.random() * 3); // 2–4 dendrites
        const dendriteAngles: number[]  = [];
        const dendriteLengths: number[] = [];
        for (let d = 0; d < numD; d++) {
          dendriteAngles.push(Math.random() * Math.PI * 2);
          dendriteLengths.push(15 + Math.random() * 15);   // 15–30 px
        }
        nodes.push({
          x: Math.random() * W,
          y: Math.random() * H,
          radius: 1.5 + Math.random() * 1.5,   // 1.5–3 px soma radius
          baseA:  0.5  + Math.random() * 0.2,   // 0.5–0.7 base opacity
          fireLevel: 0, fireTarget: 0, intensity: 1,
          glowIntensity: 0, isFiring: false,
          neighbors: [],
          dendriteAngles, dendriteLengths,
          burstActive: false, burstStartMs: 0, burstAngles: [],
        });
      }

      // 2. Build neighbor lists (closest N within threshold)
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        const dists: { idx: number; d: number }[] = [];
        for (let j = 0; j < nodes.length; j++) {
          if (i === j) continue;
          const dx = a.x - nodes[j].x, dy = a.y - nodes[j].y;
          const d  = Math.sqrt(dx * dx + dy * dy);
          if (d < CONN_THRESHOLD) dists.push({ idx: j, d });
        }
        dists.sort((p, q) => p.d - q.d);
        for (const { idx } of dists.slice(0, NEIGHBOR_MAX)) {
          a.neighbors.push({ nodeIdx: idx, edgeIdx: -1 });
        }
      }

      // 3. Build edges with precomputed bezier control points
      const seen = new Map<string, number>(); // canonical key → edge index
      for (let i = 0; i < nodes.length; i++) {
        for (const nb of nodes[i].neighbors) {
          const j   = nb.nodeIdx;
          const key = i < j ? `${i},${j}` : `${j},${i}`;

          if (!seen.has(key)) {
            const na = nodes[i], nb2 = nodes[j];
            const mx = (na.x + nb2.x) / 2, my = (na.y + nb2.y) / 2;
            const dx = nb2.x - na.x,        dy = nb2.y - na.y;
            const len = Math.sqrt(dx * dx + dy * dy) || 1;
            // Perpendicular offset for gentle curve
            const nx = -dy / len, ny = dx / len;
            const offset = (Math.random() * 12 + 8) * (Math.random() < 0.5 ? 1 : -1);
            const d = len; // reuse for baseAlpha
            const eidx = edges.length;
            edges.push({
              a: i, b: j,
              baseAlpha: 0.08 + (1 - d / CONN_THRESHOLD) * 0.04,
              cpX: mx + nx * offset,
              cpY: my + ny * offset,
              axonBrightness: 0,
              lastFiredMs: -9999,
            });
            seen.set(key, eidx);
          }

          nb.edgeIdx = seen.get(key)!;
        }
      }
    }

    function resize() {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
      buildNodes();
    }

    // ── Fire helpers ──────────────────────────────────────────────────────────

    function fireNode(nodeIdx: number, intensity: number, hop: number) {
      if (signals.length >= MAX_SIGNALS) return;
      const node = nodes[nodeIdx];
      node.fireTarget = Math.max(node.fireTarget, intensity);
      node.intensity  = intensity;
      node.isFiring   = true;
      if (node.neighbors.length === 0) return;
      const nb = node.neighbors[Math.floor(Math.random() * node.neighbors.length)];
      signals.push({
        edgeIdx:       nb.edgeIdx,
        from:          nodeIdx,
        to:            nb.nodeIdx,
        startMs:       lastMs,
        duration:      250 + Math.random() * 150,  // 250–400 ms (faster)
        hop,
        fromIntensity: intensity,
      });
    }

    function fireAlongEdge(edgeIdx: number, fromIdx: number) {
      if (signals.length >= MAX_SIGNALS) return;
      const edge  = edges[edgeIdx];
      const toIdx = edge.a === fromIdx ? edge.b : edge.a;
      nodes[fromIdx].isFiring   = true;
      nodes[fromIdx].fireTarget = Math.max(nodes[fromIdx].fireTarget, 0.8);
      signals.push({
        edgeIdx,
        from:          fromIdx,
        to:            toIdx,
        startMs:       lastMs,
        duration:      250 + Math.random() * 150,
        hop:           0,
        fromIntensity: 0.8,
      });
    }

    function triggerBurst(nodeIdx: number, ts: number) {
      const node = nodes[nodeIdx];
      node.burstActive  = true;
      node.burstStartMs = ts;
      const count = 4 + Math.floor(Math.random() * 3); // 4–6 spokes
      node.burstAngles = Array.from({ length: count }, () => Math.random() * Math.PI * 2);
    }

    // ── Animation loop ────────────────────────────────────────────────────────

    function tick(ts: number) {
      if (!lastMs) lastMs = ts;
      const dt = Math.min(ts - lastMs, 50);
      lastMs = ts;

      ctx.clearRect(0, 0, W, H);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      // ── UPDATE: nodes ───────────────────────────────────────────────────────
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];

        // Fire rise / decay
        if (n.fireTarget > 0) {
          n.fireLevel = Math.min(n.fireTarget, n.fireLevel + dt / 150);
          if (n.fireLevel >= n.fireTarget) n.fireTarget = 0;
        } else if (n.fireLevel > 0) {
          n.fireLevel = Math.max(0, n.fireLevel - dt / 300);
          if (n.fireLevel === 0) n.isFiring = false;
        }

        // Cursor proximity → glowIntensity + occasional fire trigger
        const dx = n.x - mx, dy = n.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CURSOR_RADIUS) {
          const proximity = 1 - dist / CURSOR_RADIUS;
          n.glowIntensity = Math.min(1, n.glowIntensity + proximity * 0.08);
          if (proximity > 0.6 && !n.isFiring && Math.random() < 0.02) {
            fireNode(i, 1, 0);
          }
        } else {
          n.glowIntensity = Math.max(0, n.glowIntensity - 0.03);
        }
      }

      // ── UPDATE: edges (cursor-over-axon detection + brightness decay) ───────
      for (let i = 0; i < edges.length; i++) {
        const e = edges[i];
        e.axonBrightness = Math.max(0, e.axonBrightness - 0.04);

        // Sample 3 points along bezier to detect cursor proximity
        const na = nodes[e.a], nb = nodes[e.b];
        let nearAxon = false;
        for (const t of [0.25, 0.5, 0.75]) {
          const pt = bezierPt(na.x, na.y, e.cpX, e.cpY, nb.x, nb.y, t);
          if ((pt.x - mx) ** 2 + (pt.y - my) ** 2 < AXON_CURSOR_R * AXON_CURSOR_R) {
            nearAxon = true;
            break;
          }
        }
        if (nearAxon) {
          e.axonBrightness = Math.min(1, e.axonBrightness + 0.15);
          if (ts - e.lastFiredMs > 600 && signals.length < MAX_SIGNALS) {
            e.lastFiredMs = ts;
            fireAlongEdge(i, e.a);
          }
        }
      }

      // ── UPDATE: ambient fire spawning ───────────────────────────────────────
      fireTimer -= dt;
      if (fireTimer <= 0 && signals.length < MAX_SIGNALS) {
        fireTimer = 200 + Math.random() * 300;
        fireNode(Math.floor(Math.random() * nodes.length), 1, 0);
      }

      // ── UPDATE: advance signals + arrival ───────────────────────────────────
      for (let i = signals.length - 1; i >= 0; i--) {
        const s = signals[i];
        const progress = (ts - s.startMs) / s.duration;
        if (progress >= 1) {
          const destIntensity = s.fromIntensity * 0.8;
          const dest = nodes[s.to];
          dest.fireTarget = Math.max(dest.fireTarget, destIntensity);
          dest.intensity  = destIntensity;
          if (s.hop < MAX_HOPS && Math.random() < CHAIN_PROB) {
            fireNode(s.to, destIntensity, s.hop + 1);
          }
          triggerBurst(s.to, ts);
          signals.splice(i, 1);
        }
      }

      // ════════════════════════════ DRAW PHASE ════════════════════════════════

      // ── DRAW 1: Axons (quadratic bezier, low opacity) ───────────────────────
      for (const e of edges) {
        const na = nodes[e.a], nb = nodes[e.b];
        const nodeGlow = Math.max(
          na.glowIntensity, nb.glowIntensity,
          na.fireLevel,     nb.fireLevel,
        );
        const brightness = Math.max(nodeGlow, e.axonBrightness);

        if (brightness > 0.1) {
          ctx.strokeStyle = `rgba(93,202,165,${Math.min(0.5, 0.1 + brightness * 0.4).toFixed(3)})`;
          ctx.lineWidth   = Math.min(1.2, 0.5 + brightness * 0.7);
        } else {
          ctx.strokeStyle = `rgba(127,119,221,${e.baseAlpha.toFixed(3)})`;
          ctx.lineWidth   = 0.5;
        }
        ctx.beginPath();
        ctx.moveTo(na.x, na.y);
        ctx.quadraticCurveTo(e.cpX, e.cpY, nb.x, nb.y);
        ctx.stroke();
      }

      // ── DRAW 2: Soma outer glow rings (very diffuse) ────────────────────────
      for (const n of nodes) {
        const eff   = Math.max(n.glowIntensity, n.fireLevel);
        const glowR = n.radius * (eff > 0.1 ? 4.5 : 3);
        const glowA = 0.04 + eff * 0.04;
        ctx.beginPath();
        ctx.arc(n.x, n.y, Math.max(2, glowR), 0, Math.PI * 2);
        ctx.fillStyle = eff > 0.1
          ? `rgba(93,202,165,${glowA.toFixed(3)})`
          : `rgba(127,119,221,${glowA.toFixed(3)})`;
        ctx.fill();
      }

      // ── DRAW 3: Signal particles — action potentials with comet trail ────────
      for (const s of signals) {
        const tRaw   = Math.min(1, (ts - s.startMs) / s.duration);
        const tEased = easeInOut(tRaw);
        const edge   = edges[s.edgeIdx];
        const na     = nodes[s.from];
        const nb     = nodes[s.to];

        // Trail: [t-offset, radius, opacity, rgb]
        const trail: [number, number, number, string][] = [
          [0.00, 2.5, 1.00, '93,202,165'],
          [0.06, 2.0, 0.60, '93,202,165'],
          [0.12, 1.5, 0.35, '105,175,189'],
          [0.18, 1.0, 0.18, '115,150,210'],
          [0.24, 0.6, 0.08, '127,119,221'],
        ];

        for (const [offset, r, alpha, rgb] of trail) {
          const tSample = Math.max(0, tEased - offset);
          const pt = bezierPt(na.x, na.y, edge.cpX, edge.cpY, nb.x, nb.y, tSample);
          if (offset === 0) {
            ctx.shadowColor = '#5DCAA5';
            ctx.shadowBlur  = 8;
          }
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${rgb},${alpha})`;
          ctx.fill();
          if (offset === 0) ctx.shadowBlur = 0;
        }
      }

      // ── DRAW 4: Dendrites — short organic lines from soma center ────────────
      for (const n of nodes) {
        const eff    = Math.max(n.glowIntensity, n.fireLevel);
        const lenMul = eff > 0.1 ? 1.3 : 1.0;
        ctx.lineWidth = 0.5;
        for (let d = 0; d < n.dendriteAngles.length; d++) {
          const ang = n.dendriteAngles[d];
          const len = n.dendriteLengths[d] * lenMul;
          ctx.strokeStyle = eff > 0.1
            ? `rgba(93,202,165,0.18)`
            : `rgba(175,169,236,0.15)`;
          ctx.beginPath();
          ctx.moveTo(n.x, n.y);
          ctx.lineTo(n.x + Math.cos(ang) * len, n.y + Math.sin(ang) * len);
          ctx.stroke();
        }
      }

      // ── DRAW 5: Cell bodies + nuclei ────────────────────────────────────────
      for (const n of nodes) {
        const eff = Math.max(n.glowIntensity, n.fireLevel);

        // Purple → teal color blend based on activation
        const cr = Math.round(127 + (93  - 127) * eff);
        const cg = Math.round(119 + (202 - 119) * eff);
        const cb = Math.round(221 + (165 - 221) * eff);

        const bodyR = n.radius + eff * 1.8;
        const bodyA = Math.min(1, n.baseA + eff * 0.3);

        // Soma cell body
        ctx.beginPath();
        ctx.arc(n.x, n.y, Math.max(1, bodyR), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${cr},${cg},${cb},${bodyA.toFixed(3)})`;
        ctx.fill();

        // Bright nucleus (smaller inner circle)
        ctx.beginPath();
        ctx.arc(n.x, n.y, Math.max(0.5, bodyR * 0.45), 0, Math.PI * 2);
        ctx.fillStyle = eff > 0.2
          ? `rgba(93,202,165,0.9)`
          : `rgba(175,169,236,0.8)`;
        ctx.fill();
      }

      // ── DRAW 6: Arrival bursts — radiating spark lines ───────────────────────
      for (const n of nodes) {
        if (!n.burstActive) continue;
        const elapsed = ts - n.burstStartMs;
        if (elapsed > 200) { n.burstActive = false; continue; }

        const lineLen = Math.min(20, (elapsed / 120) * 20);
        const alpha   = Math.max(0, (1 - elapsed / 200) * 0.6);
        ctx.lineWidth   = 1;
        ctx.strokeStyle = `rgba(93,202,165,${alpha.toFixed(3)})`;
        for (const ang of n.burstAngles) {
          ctx.beginPath();
          ctx.moveTo(n.x, n.y);
          ctx.lineTo(n.x + Math.cos(ang) * lineLen, n.y + Math.sin(ang) * lineLen);
          ctx.stroke();
        }
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
      style={{ opacity: 0.30, zIndex: 0 }}
      className="fixed inset-0 w-full h-full pointer-events-none"
    />
  );
}
