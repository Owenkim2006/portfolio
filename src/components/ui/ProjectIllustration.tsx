import React from 'react';

// Focal SVG illustrations for each project, all drawn in the site accent (#6C63FF).
// Swap these out by setting project.images[0] in the data file.

const P = '#6C63FF'; // accent

type Props = { className?: string; style?: React.CSSProperties }

function EMGProsthetic({ style }: Props) {
  return (
    <svg viewBox="0 0 800 300" fill="none" aria-hidden="true" style={style}>
      {/* Grid */}
      {[0,1,2,3,4,5,6,7,8].map(i => (
        <line key={`h${i}`} x1="0" y1={i*40} x2="800" y2={i*40} stroke={P} strokeWidth="0.4" opacity="0.07" />
      ))}
      {[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19].map(i => (
        <line key={`v${i}`} x1={i*44} y1="0" x2={i*44} y2="300" stroke={P} strokeWidth="0.4" opacity="0.07" />
      ))}
      {/* EMG waveform, flat baseline with spikes */}
      <polyline
        points="40,150 120,150 132,150 138,60 144,240 150,110 158,150 220,150 232,150 238,70 244,230 250,120 258,150 320,150 332,150 338,80 344,220 350,115 358,150 480,150"
        stroke={P} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.55"
      />
      {/* Flat tail */}
      <line x1="480" y1="150" x2="540" y2="150" stroke={P} strokeWidth="2" opacity="0.55" />
      {/* PCB connector box */}
      <rect x="560" y="110" width="90" height="80" rx="4" stroke={P} strokeWidth="1.2" opacity="0.25" />
      <line x1="540" y1="150" x2="560" y2="150" stroke={P} strokeWidth="1.2" opacity="0.25" />
      {/* IC pins */}
      {[0,1,2,3].map(i => (
        <line key={`pin-t${i}`} x1={572 + i*20} y1="110" x2={572 + i*20} y2="95" stroke={P} strokeWidth="1.2" opacity="0.2" />
      ))}
      {[0,1,2,3].map(i => (
        <line key={`pin-b${i}`} x1={572 + i*20} y1="190" x2={572 + i*20} y2="205" stroke={P} strokeWidth="1.2" opacity="0.2" />
      ))}
      {/* Mechanical gripper */}
      <path d="M680,120 L720,140 L720,160 L680,180" stroke={P} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.35" />
      <path d="M720,140 L750,130 M720,160 L750,170" stroke={P} strokeWidth="1.5" strokeLinecap="round" opacity="0.35" />
      <line x1="650" y1="150" x2="680" y2="150" stroke={P} strokeWidth="2" opacity="0.35" />
      <rect x="630" y="130" width="50" height="40" rx="6" stroke={P} strokeWidth="1" opacity="0.18" />
      {/* Axis labels */}
      <text x="40" y="285" fill={P} opacity="0.2" fontSize="11" fontFamily="monospace">EMG μV</text>
      <text x="420" y="285" fill={P} opacity="0.2" fontSize="11" fontFamily="monospace">t (ms)</text>
    </svg>
  );
}

function FORTifAI({ style }: Props) {
  return (
    <svg viewBox="0 0 800 300" fill="none" aria-hidden="true" style={style}>
      {/* Ground line */}
      <line x1="100" y1="260" x2="700" y2="260" stroke={P} strokeWidth="0.5" opacity="0.12" />
      {/* Figure 1, left, walking */}
      <circle cx="220" cy="80" r="18" stroke={P} strokeWidth="1.5" opacity="0.4" />
      <line x1="220" y1="98" x2="220" y2="180" stroke={P} strokeWidth="1.5" opacity="0.4" />
      <line x1="220" y1="130" x2="190" y2="160" stroke={P} strokeWidth="1.5" opacity="0.4" />
      <line x1="220" y1="130" x2="248" y2="155" stroke={P} strokeWidth="1.5" opacity="0.4" />
      <line x1="220" y1="180" x2="196" y2="230" stroke={P} strokeWidth="1.5" opacity="0.4" />
      <line x1="220" y1="180" x2="244" y2="228" stroke={P} strokeWidth="1.5" opacity="0.4" />
      {/* Figure 1 keypoints */}
      {[[220,80],[220,130],[190,160],[248,155],[220,180],[196,230],[244,228]].map(([cx,cy],i) => (
        <circle key={i} cx={cx} cy={cy} r="4" fill={P} opacity="0.5" />
      ))}
      {/* Figure 2, centre, upright */}
      <circle cx="400" cy="72" r="18" stroke={P} strokeWidth="1.5" opacity="0.55" />
      <line x1="400" y1="90" x2="400" y2="175" stroke={P} strokeWidth="1.5" opacity="0.55" />
      <line x1="400" y1="125" x2="372" y2="152" stroke={P} strokeWidth="1.5" opacity="0.55" />
      <line x1="400" y1="125" x2="428" y2="152" stroke={P} strokeWidth="1.5" opacity="0.55" />
      <line x1="400" y1="175" x2="382" y2="240" stroke={P} strokeWidth="1.5" opacity="0.55" />
      <line x1="400" y1="175" x2="418" y2="240" stroke={P} strokeWidth="1.5" opacity="0.55" />
      {[[400,72],[400,125],[372,152],[428,152],[400,175],[382,240],[418,240]].map(([cx,cy],i) => (
        <circle key={i} cx={cx} cy={cy} r="4.5" fill={P} opacity="0.65" />
      ))}
      {/* Gait path arc */}
      <path d="M150,265 Q280,250 400,265 Q520,280 650,265" stroke={P} strokeWidth="1" opacity="0.18" strokeDasharray="4 6" />
      {/* Risk score bar */}
      <rect x="590" y="100" width="12" height="160" rx="4" fill={P} opacity="0.05" />
      <rect x="590" y="180" width="12" height="80" rx="4" fill={P} opacity="0.3" />
      <text x="582" y="95" fill={P} opacity="0.25" fontSize="10" fontFamily="monospace" textAnchor="middle">risk</text>
      {/* Alert indicator */}
      <circle cx="680" cy="80" r="22" stroke={P} strokeWidth="1.2" opacity="0.2" />
      <text x="680" y="76" fill={P} opacity="0.35" fontSize="13" fontFamily="monospace" textAnchor="middle" fontWeight="600">!</text>
      <text x="680" y="92" fill={P} opacity="0.25" fontSize="9" fontFamily="monospace" textAnchor="middle">LOW</text>
    </svg>
  );
}

function UnitedMobility({ style }: Props) {
  return (
    <svg viewBox="0 0 800 300" fill="none" aria-hidden="true" style={style}>
      {/* Node network, decentralised */}
      {/* Nodes */}
      {[
        [120,150],[280,90],[280,210],[440,150],[600,90],[600,210],[720,150]
      ].map(([cx,cy],i) => (
        <circle key={i} cx={cx} cy={cy} r={i === 3 ? 10 : 7} fill={P}
          opacity={i === 3 ? 0.45 : 0.25} />
      ))}
      {/* Edges */}
      {[
        [120,150,280,90],[120,150,280,210],
        [280,90,440,150],[280,210,440,150],
        [440,150,600,90],[440,150,600,210],
        [600,90,720,150],[600,210,720,150],
        [280,90,280,210],[600,90,600,210],
      ].map(([x1,y1,x2,y2],i) => (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={P} strokeWidth="1" opacity="0.15" />
      ))}
      {/* Scooter outlines (simplified) at two nodes */}
      {/* Left scooter at node [280,90] */}
      <circle cx="270" cy="60" r="10" stroke={P} strokeWidth="1.2" opacity="0.3" />
      <circle cx="300" cy="60" r="10" stroke={P} strokeWidth="1.2" opacity="0.3" />
      <line x1="270" y1="60" x2="300" y2="60" stroke={P} strokeWidth="1.2" opacity="0.3" />
      <line x1="280" y1="60" x2="280" y2="40" stroke={P} strokeWidth="1.2" opacity="0.3" />
      <line x1="274" y1="40" x2="292" y2="40" stroke={P} strokeWidth="1.2" opacity="0.3" />
      {/* Right scooter at [600,90] */}
      <circle cx="590" cy="60" r="10" stroke={P} strokeWidth="1.2" opacity="0.3" />
      <circle cx="620" cy="60" r="10" stroke={P} strokeWidth="1.2" opacity="0.3" />
      <line x1="590" y1="60" x2="620" y2="60" stroke={P} strokeWidth="1.2" opacity="0.3" />
      <line x1="600" y1="60" x2="600" y2="40" stroke={P} strokeWidth="1.2" opacity="0.3" />
      <line x1="594" y1="40" x2="612" y2="40" stroke={P} strokeWidth="1.2" opacity="0.3" />
      {/* People's Choice badge */}
      <text x="400" y="275" fill={P} opacity="0.2" fontSize="11" fontFamily="monospace" textAnchor="middle">
        UW Velocity · People&apos;s Choice
      </text>
    </svg>
  );
}

function StrokeAlert({ style }: Props) {
  return (
    <svg viewBox="0 0 800 300" fill="none" aria-hidden="true" style={style}>
      {/* Left face, normal */}
      <ellipse cx="220" cy="150" rx="80" ry="100" stroke={P} strokeWidth="1.5" opacity="0.35" />
      {/* Eyes */}
      <ellipse cx="195" cy="120" rx="9" ry="7" stroke={P} strokeWidth="1" opacity="0.4" />
      <ellipse cx="245" cy="120" rx="9" ry="7" stroke={P} strokeWidth="1" opacity="0.4" />
      {/* Mouth, level */}
      <path d="M196,185 Q220,198 244,185" stroke={P} strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
      {/* Eyebrows, level */}
      <line x1="186" y1="108" x2="208" y2="106" stroke={P} strokeWidth="1.2" strokeLinecap="round" opacity="0.3" />
      <line x1="232" y1="106" x2="254" y2="108" stroke={P} strokeWidth="1.2" strokeLinecap="round" opacity="0.3" />
      <text x="220" y="265" fill={P} opacity="0.2" fontSize="11" fontFamily="monospace" textAnchor="middle">Normal</text>

      {/* Divider */}
      <line x1="400" y1="30" x2="400" y2="270" stroke={P} strokeWidth="0.5" opacity="0.12" strokeDasharray="4 6" />

      {/* Right face, drooping (stroke) */}
      <ellipse cx="580" cy="150" rx="80" ry="100" stroke={P} strokeWidth="1.5" opacity="0.55" />
      {/* Eyes, one slightly drooping */}
      <ellipse cx="555" cy="120" rx="9" ry="7" stroke={P} strokeWidth="1" opacity="0.5" />
      <ellipse cx="605" cy="124" rx="9" ry="6" stroke={P} strokeWidth="1" opacity="0.5" />
      {/* Mouth, drooping right */}
      <path d="M556,185 Q580,194 604,200" stroke={P} strokeWidth="1.5" strokeLinecap="round" opacity="0.55" />
      {/* Eyebrow right, lower */}
      <line x1="546" y1="108" x2="568" y2="106" stroke={P} strokeWidth="1.2" strokeLinecap="round" opacity="0.4" />
      <line x1="592" y1="112" x2="614" y2="116" stroke={P} strokeWidth="1.2" strokeLinecap="round" opacity="0.4" />
      {/* Alert lines */}
      <line x1="640" y1="70" x2="680" y2="50" stroke={P} strokeWidth="1" opacity="0.3" />
      <line x1="650" y1="80" x2="695" y2="68" stroke={P} strokeWidth="1" opacity="0.3" />
      <circle cx="700" cy="55" r="16" stroke={P} strokeWidth="1.5" opacity="0.4" />
      <text x="700" y="51" fill={P} opacity="0.5" fontSize="14" fontFamily="monospace" textAnchor="middle" fontWeight="700">!</text>
      <text x="700" y="66" fill={P} opacity="0.3" fontSize="8" fontFamily="monospace" textAnchor="middle">FAST</text>
      <text x="580" y="265" fill={P} opacity="0.3" fontSize="11" fontFamily="monospace" textAnchor="middle">Detected</text>
    </svg>
  );
}

function KidsAbility({ style }: Props) {
  return (
    <svg viewBox="0 0 800 300" fill="none" aria-hidden="true" style={style}>
      {/* Activity arcs, concentric motion */}
      <path d="M250,200 Q310,100 370,200" stroke={P} strokeWidth="1.5" opacity="0.2" />
      <path d="M220,220 Q310,80 400,220" stroke={P} strokeWidth="1.5" opacity="0.15" />
      <path d="M190,240 Q310,60 430,240" stroke={P} strokeWidth="1.2" opacity="0.1" />
      {/* Child figure */}
      <circle cx="310" cy="90" r="20" stroke={P} strokeWidth="1.5" opacity="0.5" />
      <line x1="310" y1="110" x2="310" y2="170" stroke={P} strokeWidth="1.5" opacity="0.5" />
      <line x1="310" y1="135" x2="285" y2="160" stroke={P} strokeWidth="1.5" opacity="0.5" />
      <line x1="310" y1="135" x2="335" y2="160" stroke={P} strokeWidth="1.5" opacity="0.5" />
      <line x1="310" y1="170" x2="290" y2="215" stroke={P} strokeWidth="1.5" opacity="0.5" />
      <line x1="310" y1="170" x2="330" y2="215" stroke={P} strokeWidth="1.5" opacity="0.5" />
      {/* Adult figure (taller, supporting hand) */}
      <circle cx="420" cy="70" r="22" stroke={P} strokeWidth="1.5" opacity="0.35" />
      <line x1="420" y1="92" x2="420" y2="180" stroke={P} strokeWidth="1.5" opacity="0.35" />
      <line x1="420" y1="130" x2="370" y2="160" stroke={P} strokeWidth="1.5" opacity="0.35" />
      <line x1="420" y1="130" x2="450" y2="160" stroke={P} strokeWidth="1.5" opacity="0.35" />
      <line x1="420" y1="180" x2="400" y2="235" stroke={P} strokeWidth="1.5" opacity="0.35" />
      <line x1="420" y1="180" x2="440" y2="235" stroke={P} strokeWidth="1.5" opacity="0.35" />
      {/* Connecting hand */}
      <line x1="370" y1="160" x2="335" y2="160" stroke={P} strokeWidth="1.2" opacity="0.35" strokeDasharray="3 4" />
      {/* QFD matrix (small) */}
      <rect x="570" y="80" width="160" height="140" rx="4" stroke={P} strokeWidth="0.8" opacity="0.12" />
      {[0,1,2,3].map(i => (
        <line key={i} x1="570" y1={80+i*35} x2="730" y2={80+i*35} stroke={P} strokeWidth="0.4" opacity="0.12" />
      ))}
      {[0,1,2,3].map(i => (
        <line key={i} x1={570+i*40} y1="80" x2={570+i*40} y2="220" stroke={P} strokeWidth="0.4" opacity="0.12" />
      ))}
      <text x="650" y="250" fill={P} opacity="0.2" fontSize="10" fontFamily="monospace" textAnchor="middle">QFD Matrix</text>
      <text x="310" y="265" fill={P} opacity="0.2" fontSize="10" fontFamily="monospace" textAnchor="middle">KidsAbility · Partnership</text>
    </svg>
  );
}

function CryptoCompanion({ style }: Props) {
  return (
    <svg viewBox="0 0 800 300" fill="none" aria-hidden="true" style={style}>
      {/* Grid */}
      {[0,1,2,3,4].map(i => (
        <line key={i} x1="80" y1={60+i*48} x2="720" y2={60+i*48} stroke={P} strokeWidth="0.4" opacity="0.08" />
      ))}
      {/* Main price line, ascending */}
      <polyline
        points="80,240 130,220 180,230 230,195 280,200 330,170 380,160 430,145 480,130 530,120 580,100 630,110 680,85 720,75"
        stroke={P} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.55"
      />
      {/* Area fill */}
      <path d="M80,240 130,220 180,230 230,195 280,200 330,170 380,160 430,145 480,130 530,120 580,100 630,110 680,85 720,75 V280 H80Z"
        fill={P} opacity="0.05" />
      {/* Candlesticks */}
      {[
        [130,215,235],[230,190,205],[330,162,180],[430,138,155],[530,112,130],[630,100,118],[680,78,96]
      ].map(([x,open,close],i) => (
        <g key={i}>
          <rect x={x-5} y={Math.min(open,close)} width="10" height={Math.abs(close-open)+4} fill={P} opacity="0.18" />
          <line x1={x} y1={close-8} x2={x} y2={close+14} stroke={P} strokeWidth="1" opacity="0.18" />
        </g>
      ))}
      {/* Risk labels */}
      <rect x="580" y="60" width="60" height="18" rx="3" fill={P} opacity="0.08" />
      <text x="610" y="73" fill={P} opacity="0.3" fontSize="9" fontFamily="monospace" textAnchor="middle">LOW RISK</text>
      <text x="400" y="285" fill={P} opacity="0.2" fontSize="10" fontFamily="monospace" textAnchor="middle">GeeseHacks · 24 hrs</text>
    </svg>
  );
}

function QRGenerator({ style }: Props) {
  return (
    <svg viewBox="0 0 800 300" fill="none" aria-hidden="true" style={style}>
      {/* QR corner modules */}
      {/* Top-left corner */}
      <rect x="180" y="60" width="110" height="110" rx="4" stroke={P} strokeWidth="1.5" opacity="0.35" />
      <rect x="196" y="76" width="78" height="78" rx="2" fill={P} opacity="0.06" stroke={P} strokeWidth="1" />
      <rect x="212" y="92" width="46" height="46" rx="1" fill={P} opacity="0.25" />
      {/* Top-right corner */}
      <rect x="510" y="60" width="110" height="110" rx="4" stroke={P} strokeWidth="1.5" opacity="0.35" />
      <rect x="526" y="76" width="78" height="78" rx="2" fill={P} opacity="0.06" stroke={P} strokeWidth="1" />
      <rect x="542" y="92" width="46" height="46" rx="1" fill={P} opacity="0.25" />
      {/* Bottom-left corner */}
      <rect x="180" y="200" width="110" height="80" rx="4" stroke={P} strokeWidth="1.5" opacity="0.35" />
      <rect x="196" y="214" width="78" height="48" rx="2" fill={P} opacity="0.06" stroke={P} strokeWidth="1" />
      <rect x="212" y="228" width="46" height="22" rx="1" fill={P} opacity="0.25" />
      {/* Data modules (random dots in centre area) */}
      {[
        [345,80],[368,80],[391,80],[345,103],[391,103],[368,126],[345,149],[368,149],[391,149],
        [345,172],[368,172],[345,195],[391,195],[368,218],[345,241],[391,241],
        [345,218],[391,172],[368,195],
      ].map(([x,y],i) => (
        <rect key={i} x={x} y={y} width="16" height="16" rx="1" fill={P} opacity={0.12 + (i % 4) * 0.06} />
      ))}
      {/* Scan line */}
      <line x1="160" y1="170" x2="640" y2="170" stroke={P} strokeWidth="1" opacity="0.15" strokeDasharray="6 4" />
      <text x="400" y="285" fill={P} opacity="0.2" fontSize="10" fontFamily="monospace" textAnchor="middle">Java · Swing · File I/O</text>
    </svg>
  );
}

const ILLUSTRATIONS: Record<string, (props: Props) => React.ReactElement> = {
  'emg-prosthetic':  EMGProsthetic,
  'fortifai':        FORTifAI,
  'united-mobility': UnitedMobility,
  'strokealert':     StrokeAlert,
  'kidsability':     KidsAbility,
  'cryptocompanion': CryptoCompanion,
  'qr-generator':    QRGenerator,
};

interface ProjectIllustrationProps {
  projectId: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function ProjectIllustration({ projectId, style }: ProjectIllustrationProps) {
  const Component = ILLUSTRATIONS[projectId];
  if (!Component) return null;

  const defaultStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    ...style,
  };

  return <Component style={defaultStyle} />;
}
