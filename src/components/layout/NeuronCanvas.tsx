'use client';

import { useEffect, useRef, memo } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Dendrite { angle: number; length: number; }

interface Connection { toIdx: number; edgeIdx: number; }

interface Node {
  x: number; y: number;
  vx: number; vy: number;
  homeX: number; homeY: number;
  radius: number;
  glowIntensity: number;
  isFiring: boolean;
  fireProgress: number;
  dendrites: Dendrite[];
  connections: Connection[];
  burstActive: boolean;
  burstStartMs: number;
  burstAngles: number[];
}

interface Edge {
  a: number; b: number;
  cpX: number; cpY: number;
  edgeGlow: number;
  lastFiredMs: number;
}

interface Signal {
  edgeIdx: number;
  from: number;
  to: number;
  startMs: number;
  duration: number;
  hop: number;
  intensity: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const CONN_THRESHOLD  = 185;
const MAX_SIGNALS     = 10;
const CHAIN_PROB      = 0.35;
const MAX_HOPS        = 3;
const CURSOR_RADIUS   = 140;
const SPONTANEOUS     = 0.0003; // per frame per node

// ─── Helpers ──────────────────────────────────────────────────────────────────

function bezierPoint(
  t: number,
  ax: number, ay: number,
  cx: number, cy: number,
  bx: number, by: number,
): { x: number; y: number } {
  const mt = 1 - t;
  return {
    x: mt * mt * ax + 2 * mt * t * cx + t * t * bx,
    y: mt * mt * ay + 2 * mt * t * cy + t * t * by,
  };
}

// ─── Component ────────────────────────────────────────────────────────────────

function NeuronCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef  = useRef({ x: -9999, y: -9999 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => { mouseRef.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx    = canvas.getContext('2d')!;

    let W = 0, H = 0;
    let lastMs = 0;
    let rafId  = 0;

    const nodes:   Node[]   = [];
    const edges:   Edge[]   = [];
    const signals: Signal[] = [];

    // ── Scene setup ───────────────────────────────────────────────────────────

    function buildNodes() {
      nodes.length = 0;
      edges.length = 0;
      signals.length = 0;

      const count = Math.max(30, Math.floor(150 * (W / 1920)));

      for (let i = 0; i < count; i++) {
        const x = Math.random() * W;
        const y = Math.random() * H;
        const numD = 3 + Math.floor(Math.random() * 3); // 3–5 dendrites
        const dendrites: Dendrite[] = [];
        for (let d = 0; d < numD; d++) {
          dendrites.push({
            angle:  Math.random() * Math.PI * 2,
            length: 12 + Math.random() * 14,  // 12–26 px
          });
        }
        nodes.push({
          x, y, vx: 0, vy: 0, homeX: x, homeY: y,
          radius: 1.4 + Math.random() * 1.4,  // 1.4–2.8 px
          glowIntensity: 0,
          isFiring: false,
          fireProgress: 0,
          dendrites,
          connections: [],
          burstActive: false, burstStartMs: 0, burstAngles: [],
        });
      }

      // Connections: nearest 2–3 within threshold
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        const neighborMax = 2 + Math.floor(Math.random() * 2); // 2 or 3
        const dists: { idx: number; d: number }[] = [];
        for (let j = 0; j < nodes.length; j++) {
          if (i === j) continue;
          const dx = a.x - nodes[j].x, dy = a.y - nodes[j].y;
          const d  = Math.sqrt(dx * dx + dy * dy);
          if (d < CONN_THRESHOLD) dists.push({ idx: j, d });
        }
        dists.sort((p, q) => p.d - q.d);
        for (const { idx } of dists.slice(0, neighborMax)) {
          a.connections.push({ toIdx: idx, edgeIdx: -1 });
        }
      }

      // Edges with bezier control points (10–22 px perpendicular offset)
      const seen = new Map<string, number>();
      for (let i = 0; i < nodes.length; i++) {
        for (const conn of nodes[i].connections) {
          const j   = conn.toIdx;
          const key = i < j ? `${i},${j}` : `${j},${i}`;
          if (!seen.has(key)) {
            const na = nodes[i], nb = nodes[j];
            const mx = (na.x + nb.x) / 2, my = (na.y + nb.y) / 2;
            const dx = nb.x - na.x,        dy = nb.y - na.y;
            const len = Math.sqrt(dx * dx + dy * dy) || 1;
            const nx = -dy / len, ny = dx / len;
            const offset = (10 + Math.random() * 12) * (Math.random() < 0.5 ? 1 : -1);
            const eidx = edges.length;
            edges.push({
              a: i, b: j,
              cpX: mx + nx * offset,
              cpY: my + ny * offset,
              edgeGlow: 0,
              lastFiredMs: -9999,
            });
            seen.set(key, eidx);
          }
          conn.edgeIdx = seen.get(key)!;
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
      node.isFiring     = true;
      node.fireProgress = Math.max(node.fireProgress, intensity);
      if (node.connections.length === 0) return;
      const conn  = node.connections[Math.floor(Math.random() * node.connections.length)];
      const eidx  = conn.edgeIdx;
      signals.push({
        edgeIdx:  eidx,
        from:     nodeIdx,
        to:       conn.toIdx,
        startMs:  lastMs,
        duration: 280 + Math.random() * 180,  // 280–460 ms
        hop,
        intensity,
      });
      edges[eidx].edgeGlow      = 1;
      edges[eidx].lastFiredMs   = lastMs;
    }

    function triggerBurst(nodeIdx: number, ts: number) {
      const n = nodes[nodeIdx];
      n.burstActive  = true;
      n.burstStartMs = ts;
      const count = 4 + Math.floor(Math.random() * 3); // 4–6 spokes
      n.burstAngles = Array.from({ length: count }, () => Math.random() * Math.PI * 2);
    }

    // ── Animation loop ────────────────────────────────────────────────────────

    function tick(ts: number) {
      if (!lastMs) lastMs = ts;
      const dt = Math.min(ts - lastMs, 50);
      lastMs = ts;

      ctx.clearRect(0, 0, W, H);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      // Update nodes
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];

        // Fire progress decay
        if (n.fireProgress > 0) {
          n.fireProgress = Math.max(0, n.fireProgress - dt / 400);
          if (n.fireProgress === 0) n.isFiring = false;
        }

        // Spontaneous firing
        if (!n.isFiring && Math.random() < SPONTANEOUS) {
          fireNode(i, 1, 0);
        }

        // Cursor proximity → glow + triggered firing
        const dx   = n.x - mx, dy = n.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CURSOR_RADIUS) {
          const proximity = 1 - dist / CURSOR_RADIUS;
          n.glowIntensity = Math.min(1, n.glowIntensity + proximity * 0.06);
          if (proximity > 0.55 && !n.isFiring && Math.random() < 0.025) {
            fireNode(i, 1, 0);
          }
        } else {
          n.glowIntensity = Math.max(0, n.glowIntensity - 0.025);
        }
      }

      // Edge glow decay
      for (const e of edges) {
        e.edgeGlow = Math.max(0, e.edgeGlow - dt * 0.003);
      }

      // Advance signals → arrival
      for (let i = signals.length - 1; i >= 0; i--) {
        const s        = signals[i];
        const progress = (ts - s.startMs) / s.duration;
        if (progress >= 1) {
          const destIntensity = s.intensity * 0.75;
          const dest = nodes[s.to];
          dest.fireProgress = Math.max(dest.fireProgress, destIntensity);
          dest.isFiring     = true;
          if (s.hop < MAX_HOPS && Math.random() < CHAIN_PROB) {
            fireNode(s.to, destIntensity, s.hop + 1);
          }
          triggerBurst(s.to, ts);
          signals.splice(i, 1);
        }
      }

      // ════════════════════ DRAW PHASE ════════════════════

      // DRAW 1: Axons
      for (const e of edges) {
        const na = nodes[e.a], nb = nodes[e.b];
        ctx.beginPath();
        ctx.moveTo(na.x, na.y);
        ctx.quadraticCurveTo(e.cpX, e.cpY, nb.x, nb.y);
        if (e.edgeGlow > 0.15) {
          ctx.strokeStyle = `rgba(155,148,255,${Math.min(0.52, 0.12 + e.edgeGlow * 0.38).toFixed(3)})`;
          ctx.lineWidth   = Math.min(1.2, 0.5 + e.edgeGlow * 0.65);
        } else {
          ctx.strokeStyle = 'rgba(108,99,255,0.07)';
          ctx.lineWidth   = 0.5;
        }
        ctx.stroke();
      }

      // DRAW 2: Signal particles, pulse train (leading 2.8 px + 3 trailing dots)
      ctx.shadowColor = '#9B94FF';
      for (const s of signals) {
        const tRaw = Math.min(1, (ts - s.startMs) / s.duration);
        const edge  = edges[s.edgeIdx];
        const na    = nodes[s.from], nb = nodes[s.to];

        const pulses: [number, number, number][] = [
          [0.00, 2.8, 1.00],
          [0.07, 1.8, 0.48],
          [0.14, 1.1, 0.22],
          [0.22, 0.6, 0.09],
        ];

        for (let p = 0; p < pulses.length; p++) {
          const [offset, r, alpha] = pulses[p];
          const tSample = Math.max(0, tRaw - offset);
          const pt      = bezierPoint(tSample, na.x, na.y, edge.cpX, edge.cpY, nb.x, nb.y);
          ctx.shadowBlur = p === 0 ? 8 : 0;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(155,148,255,${alpha})`;
          ctx.fill();
        }
      }
      ctx.shadowBlur = 0;

      // DRAW 3: Nodes, dendrites → halo → soma → nucleus → burst
      for (const n of nodes) {
        const eff = Math.max(n.glowIntensity, n.fireProgress);

        // Dendrites
        ctx.lineWidth = 0.5;
        const dLen = eff > 0.1 ? 1.25 : 1;
        ctx.strokeStyle = eff > 0.1 ? 'rgba(155,148,255,0.18)' : 'rgba(155,148,255,0.13)';
        for (const d of n.dendrites) {
          ctx.beginPath();
          ctx.moveTo(n.x, n.y);
          ctx.lineTo(n.x + Math.cos(d.angle) * d.length * dLen, n.y + Math.sin(d.angle) * d.length * dLen);
          ctx.stroke();
        }

        // Halo
        const haloR = n.radius * (eff > 0.1 ? 5 : 3.5);
        const haloA = (0.035 + eff * 0.04).toFixed(3);
        ctx.beginPath();
        ctx.arc(n.x, n.y, Math.max(2, haloR), 0, Math.PI * 2);
        ctx.fillStyle = eff > 0.1
          ? `rgba(155,148,255,${haloA})`
          : `rgba(108,99,255,${haloA})`;
        ctx.fill();

        // Soma
        const bodyR = n.radius + eff * 1.6;
        const bodyA = Math.min(1, 0.52 + eff * 0.3);
        const cr = Math.round(108 + (155 - 108) * eff);
        const cg = Math.round(99  + (148 - 99)  * eff);
        const cb = Math.round(255 + (255 - 255) * eff);
        ctx.beginPath();
        ctx.arc(n.x, n.y, Math.max(1, bodyR), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${cr},${cg},${cb},${bodyA.toFixed(3)})`;
        ctx.fill();

        // Nucleus
        ctx.beginPath();
        ctx.arc(n.x, n.y, Math.max(0.5, bodyR * 0.45), 0, Math.PI * 2);
        ctx.fillStyle = eff > 0.2 ? 'rgba(155,148,255,0.9)' : 'rgba(155,148,255,0.75)';
        ctx.fill();

        // Burst
        if (n.burstActive) {
          const elapsed = ts - n.burstStartMs;
          if (elapsed > 220) {
            n.burstActive = false;
          } else {
            const lineLen = Math.min(18, (elapsed / 110) * 18);
            const alpha   = Math.max(0, (1 - elapsed / 220) * 0.55).toFixed(3);
            ctx.lineWidth   = 1;
            ctx.strokeStyle = `rgba(155,148,255,${alpha})`;
            for (const ang of n.burstAngles) {
              ctx.beginPath();
              ctx.moveTo(n.x, n.y);
              ctx.lineTo(n.x + Math.cos(ang) * lineLen, n.y + Math.sin(ang) * lineLen);
              ctx.stroke();
            }
          }
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
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
        opacity: 0.22,
      }}
    />
  );
}

export default memo(NeuronCanvas);
