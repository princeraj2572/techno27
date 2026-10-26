import type { ReactNode } from "react";

// Original flat illustrations, one per event, each themed on an Indian state / cultural landmark.
// All scenes share a 300 x 400 canvas; the top ~28% stays open sky so the stamp title can sit there.

export interface Culture {
  state: string;
  landmark: string;
  ink: string; // title colour (on sky)
  sub: string; // state line colour (on sky)
  sky: [string, string];
  draw: () => ReactNode;
}

// Round trig results: server and browser can differ in the last digits, which breaks hydration.
const r2 = (n: number) => Math.round(n * 100) / 100;

const Rays = ({ cx, cy, r, color = "#ffb000", n = 12, len = 14 }: { cx: number; cy: number; r: number; color?: string; n?: number; len?: number }) => (
  <g stroke={color} strokeWidth="3" strokeLinecap="round">
    {Array.from({ length: n }).map((_, i) => {
      const a = (Math.PI * 2 * i) / n;
      return <line key={i} x1={r2(cx + Math.cos(a) * (r + 5))} y1={r2(cy + Math.sin(a) * (r + 5))} x2={r2(cx + Math.cos(a) * (r + 5 + len))} y2={r2(cy + Math.sin(a) * (r + 5 + len))} />;
    })}
  </g>
);

const Sun = ({ cx, cy, r, fill = "#ffc42e", rays = "#ffb000" }: { cx: number; cy: number; r: number; fill?: string; rays?: string }) => (
  <g>
    <Rays cx={cx} cy={cy} r={r} color={rays} />
    <circle cx={cx} cy={cy} r={r} fill={fill} />
    <circle cx={cx} cy={cy} r={r * 0.55} fill="none" stroke={rays} strokeWidth="2" opacity="0.7" />
  </g>
);

const Cloud = ({ x, y, s = 1, fill = "#fff6e0" }: { x: number; y: number; s?: number; fill?: string }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} fill={fill}>
    <ellipse cx="0" cy="0" rx="30" ry="9" />
    <ellipse cx="-14" cy="-7" rx="15" ry="10" />
    <ellipse cx="10" cy="-10" rx="18" ry="12" />
  </g>
);

const Pine = ({ x, y, s = 1, c = "#1f5a43" }: { x: number; y: number; s?: number; c?: string }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} fill={c}>
    <polygon points="0,-70 -20,-36 20,-36" />
    <polygon points="0,-52 -26,-12 26,-12" />
    <polygon points="0,-30 -32,14 32,14" />
    <rect x="-4" y="14" width="8" height="12" fill="#4a2c14" />
  </g>
);

const Arch = ({ x, y, w, h, fill = "#2a1208" }: { x: number; y: number; w: number; h: number; fill?: string }) => (
  <path d={`M${x},${y + h} V${y + w / 2} A${w / 2},${w / 2} 0 0 1 ${x + w},${y + w / 2} V${y + h} Z`} fill={fill} />
);

const Dome = ({ cx, cy, r, fill, stroke }: { cx: number; cy: number; r: number; fill: string; stroke: string }) => (
  <g>
    <path d={`M${cx - r},${cy} A${r},${r * 1.1} 0 0 1 ${cx + r},${cy} Z`} fill={fill} stroke={stroke} strokeWidth="2" />
    <line x1={cx} y1={cy - r * 1.1} x2={cx} y2={cy - r * 1.1 - 9} stroke={stroke} strokeWidth="2" />
    <circle cx={cx} cy={cy - r * 1.1 - 10} r="2.4" fill={stroke} />
  </g>
);

const Spokes = ({ cx, cy, r, n, color, w = 3 }: { cx: number; cy: number; r: number; n: number; color: string; w?: number }) => (
  <g stroke={color} strokeWidth={w} strokeLinecap="round">
    {Array.from({ length: n }).map((_, i) => {
      const a = (Math.PI * 2 * i) / n;
      return <line key={i} x1={cx} y1={cy} x2={r2(cx + Math.cos(a) * r)} y2={r2(cy + Math.sin(a) * r)} />;
    })}
  </g>
);

const Palm = ({ x, y, lean = 0, s = 1 }: { x: number; y: number; lean?: number; s?: number }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d={`M0,0 Q${lean * 0.5},-50 ${lean},-100`} stroke="#6b4423" strokeWidth="7" fill="none" strokeLinecap="round" />
    <g transform={`translate(${lean} -100)`} stroke="#1f7a3d" strokeWidth="6" strokeLinecap="round" fill="none">
      {[-70, -35, 0, 35, 70, 110, -110].map((a) => (
        <path key={a} d={`M0,0 Q${r2(Math.sin((a * Math.PI) / 180) * 22)},${r2(-14 + Math.abs(a) * 0.12)} ${r2(Math.sin((a * Math.PI) / 180) * 44)},${r2(4 + Math.abs(a) * 0.2)}`} />
      ))}
    </g>
    <circle cx={lean - 4} cy="-96" r="4" fill="#5a3a14" />
    <circle cx={lean + 4} cy="-94" r="4" fill="#5a3a14" />
  </g>
);

export const CULTURES: Record<string, Culture> = {
  // Backtrace — a trail of clues through ruins: Hampi's stone chariot
  "game-paradise": {
    state: "Karnataka", landmark: "Hampi stone chariot", ink: "#5a2a10", sub: "#9a3d12", sky: ["#ffe2b0", "#f6a65a"],
    draw: () => (
      <>
        <Sun cx={240} cy={150} r={20} />
        <g fill="#8a5a3c" stroke="#5a3418" strokeWidth="2">
          <ellipse cx="40" cy="318" rx="58" ry="40" /><ellipse cx="262" cy="322" rx="52" ry="34" /><ellipse cx="90" cy="332" rx="40" ry="26" />
        </g>
        <rect y="338" width="300" height="62" fill="#b8793f" />
        <g stroke="#4a2810" strokeWidth="2.5" strokeLinejoin="round">
          <rect x="92" y="292" width="116" height="48" fill="#cf9456" />
          <rect x="104" y="256" width="92" height="38" fill="#d89c5c" />
          <polygon points="114,256 150,200 186,256" fill="#c98a4b" />
          <polygon points="130,256 150,222 170,256" fill="#dca867" />
          <circle cx="150" cy="195" r="6" fill="#e6b25e" />
          <path d="M126 340 V312 Q126 300 138 300 H162 Q174 300 174 312 V340" fill="#3a1c0a" />
          {[112, 188].map((cx) => (
            <g key={cx}>
              <circle cx={cx} cy="344" r="24" fill="#e0a862" />
              <circle cx={cx} cy="344" r="17" fill="#cf9456" />
              <Spokes cx={cx} cy={344} r={24} n={8} color="#4a2810" w={2.5} />
              <circle cx={cx} cy="344" r="5" fill="#4a2810" />
            </g>
          ))}
        </g>
      </>
    ),
  },
  // Kalakriti — folk art: Bihar's Madhubani peacock
  kalakriti: {
    state: "Bihar", landmark: "Madhubani peacock", ink: "#7a1c1c", sub: "#b3421a", sky: ["#fff3c8", "#ffd27a"],
    draw: () => (
      <>
        <g fill="#e8a33a" opacity="0.55">
          {Array.from({ length: 6 }).flatMap((_, r) => Array.from({ length: 8 }).map((__, c) => <circle key={`${r}-${c}`} cx={20 + c * 37 + (r % 2) * 18} cy={150 + r * 42} r="2.4" />))}
        </g>
        <g transform="translate(150 300)">
          {Array.from({ length: 11 }).map((_, i) => (
            <g key={i} transform={`rotate(${(i - 5) * 15})`}>
              <ellipse cx="0" cy="-92" rx="13" ry="40" fill="#1d6fa5" stroke="#12385a" strokeWidth="2" />
              <ellipse cx="0" cy="-100" rx="8" ry="22" fill="#2ea66b" />
              <circle cx="0" cy="-108" r="6" fill="#ffd23a" stroke="#12385a" strokeWidth="1.5" />
              <circle cx="0" cy="-108" r="2.4" fill="#12385a" />
            </g>
          ))}
          <path d="M-22,0 Q-26,-40 0,-56 Q26,-40 22,0 Z" fill="#1d4ea0" stroke="#0e2a63" strokeWidth="2.5" />
          <circle cx="0" cy="-66" r="12" fill="#1d4ea0" stroke="#0e2a63" strokeWidth="2.5" />
          <path d="M0,-78 l-4,-12 M0,-78 l0,-14 M0,-78 l4,-12" stroke="#e53935" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M12,-66 l12,3 -12,3 Z" fill="#ff9f1c" />
          <circle cx="4" cy="-68" r="2" fill="#fff" />
        </g>
        <path d="M0 372 Q40 356 80 372 T160 372 T240 372 T320 372 V400 H0 Z" fill="#c8421f" />
      </>
    ),
  },
  // Robovation — wheels and gears: Odisha's Konark Sun Temple wheel
  robovation: {
    state: "Odisha", landmark: "Konark wheel", ink: "#5a1a08", sub: "#b0360d", sky: ["#ffa24a", "#ffe19a"],
    draw: () => (
      <>
        <circle cx="150" cy="230" r="92" fill="#ffb64d" opacity="0.8" />
        <g fill="#6b2a12" stroke="#4a1a08" strokeWidth="2">
          <rect x="66" y="300" width="168" height="44" /><rect x="86" y="268" width="128" height="34" /><rect x="108" y="238" width="84" height="32" /><rect x="126" y="212" width="48" height="28" />
          <polygon points="136,212 150,182 164,212" />
        </g>
        <rect y="344" width="300" height="56" fill="#8a3a14" />
        <g transform="translate(150 344)">
          <circle r="82" fill="#e8892a" stroke="#4a1a08" strokeWidth="4" />
          <circle r="70" fill="#f2a24a" stroke="#4a1a08" strokeWidth="2.5" />
          {Array.from({ length: 24 }).map((_, i) => {
            const a = (Math.PI * 2 * i) / 24;
            return <circle key={i} cx={r2(Math.cos(a) * 76)} cy={r2(Math.sin(a) * 76)} r="3" fill="#4a1a08" />;
          })}
          <Spokes cx={0} cy={0} r={70} n={16} color="#4a1a08" w={4} />
          <circle r="34" fill="none" stroke="#4a1a08" strokeWidth="3" />
          <circle r="14" fill="#c8421f" stroke="#4a1a08" strokeWidth="3" />
        </g>
      </>
    ),
  },
  // Masterchef — spice coast: Kerala backwaters
  masterchef: {
    state: "Kerala", landmark: "Backwater houseboat", ink: "#08454f", sub: "#0f7a8a", sky: ["#c4ecf3", "#fff2c9"],
    draw: () => (
      <>
        <Sun cx={62} cy={150} r={18} />
        <Cloud x={220} y={140} s={0.9} />
        <rect y="292" width="300" height="108" fill="#1c7f8e" />
        <g stroke="#7fd0da" strokeWidth="2.5" fill="none" strokeLinecap="round">
          <path d="M20 322 q10 -6 20 0 t20 0" /><path d="M210 336 q10 -6 20 0 t20 0" /><path d="M90 356 q10 -6 20 0 t20 0" /><path d="M40 380 q10 -6 20 0 t20 0" />
        </g>
        <Palm x={36} y={300} lean={-14} s={1.1} />
        <Palm x={266} y={304} lean={16} s={1.25} />
        <g stroke="#4a2810" strokeWidth="2.5" strokeLinejoin="round">
          <path d="M92 306 H208 L192 330 H108 Z" fill="#7a3a16" />
          <path d="M100 306 Q150 252 200 306 Z" fill="#d9a441" />
          <path d="M118 300 Q150 270 182 300" fill="none" stroke="#8a5a1a" />
          <rect x="132" y="294" width="36" height="12" fill="#f5edd8" />
        </g>
        <rect x="148" y="262" width="3" height="32" fill="#4a2810" />
        <polygon points="151,262 151,276 168,269" fill="#e53935" />
      </>
    ),
  },
  // Antaragni — inner fire, dance: Gujarat's Garba under the moon
  antaragni: {
    state: "Gujarat", landmark: "Garba circle", ink: "#ffe9a8", sub: "#ffb347", sky: ["#2a1055", "#8a2f8f"],
    draw: () => (
      <>
        <g fill="#fff" opacity="0.85">{[[30, 130], [70, 175], [120, 150], [200, 168], [270, 215], [40, 240], [255, 140]].map(([x, y]) => <circle key={`${x}`} cx={x} cy={y} r="1.8" />)}</g>
        <circle cx="236" cy="150" r="26" fill="#ffe9a8" />
        <circle cx="246" cy="143" r="22" fill="#2a1055" opacity="0.25" />
        <rect y="332" width="300" height="68" fill="#3b1160" />
        <g>
          {[
            { x: 58, c: "#ff4d6d", y: 346 }, { x: 104, c: "#ffd23a", y: 356 }, { x: 150, c: "#2ec4b6", y: 364 }, { x: 196, c: "#ffd23a", y: 356 }, { x: 242, c: "#ff4d6d", y: 346 },
          ].map(({ x, c, y }, i) => (
            <g key={i}>
              <path d={`M${x - 24},${y} L${x},${y - 56} L${x + 24},${y} Z`} fill={c} stroke="#1a0838" strokeWidth="2" />
              <circle cx={x} cy={y - 64} r="8" fill="#f2b48a" stroke="#1a0838" strokeWidth="2" />
              <path d={`M${x - 20},${y - 80} L${x - 8},${y - 52} M${x + 20},${y - 80} L${x + 8},${y - 52}`} stroke="#f2b48a" strokeWidth="4" strokeLinecap="round" />
              <path d={`M${x - 24},${y - 90} L${x - 17},${y - 74} M${x + 24},${y - 90} L${x + 17},${y - 74}`} stroke="#ffe9a8" strokeWidth="3" strokeLinecap="round" />
            </g>
          ))}
        </g>
        <ellipse cx="150" cy="330" rx="46" ry="9" fill="#ffb347" opacity="0.5" />
        <path d="M143 332 q7 -22 14 0 Z" fill="#ffd23a" /><path d="M146 332 q4 -12 8 0 Z" fill="#ff6a00" />
      </>
    ),
  },
  // Ideathon — palaces of ideas: Rajasthan's Hawa Mahal
  ideathon: {
    state: "Rajasthan", landmark: "Hawa Mahal", ink: "#7a1c1c", sub: "#c0392b", sky: ["#8dd4ea", "#fff1cf"],
    draw: () => (
      <>
        <Sun cx={246} cy={150} r={18} />
        <Cloud x={52} y={148} s={0.8} />
        <rect y="346" width="300" height="54" fill="#d9a35a" />
        <g stroke="#8a3a2a" strokeWidth="2.5" strokeLinejoin="round">
          {[
            { x: 66, y: 296, w: 168, h: 50 }, { x: 80, y: 252, w: 140, h: 46 }, { x: 96, y: 210, w: 108, h: 44 }, { x: 112, y: 172, w: 76, h: 40 }, { x: 128, y: 142, w: 44, h: 32 },
          ].map((t, i) => (
            <g key={i}>
              <rect x={t.x} y={t.y} width={t.w} height={t.h} fill={i % 2 ? "#f4a08a" : "#ee8f78"} />
              {Array.from({ length: Math.max(2, Math.floor(t.w / 24)) }).map((_, k, arr) => {
                const gap = t.w / arr.length;
                return <Arch key={k} x={t.x + gap * k + gap / 2 - 7} y={t.y + 10} w={14} h={t.h - 14} fill="#6e2a1e" />;
              })}
              <Dome cx={t.x + t.w / 2} cy={t.y} r={Math.min(16, t.w / 6)} fill="#f8c3b3" stroke="#8a3a2a" />
            </g>
          ))}
        </g>
      </>
    ),
  },
  // Beat Battle — rhythm: Punjab's dhol in the wheat fields
  "beat-battle": {
    state: "Punjab", landmark: "Dhol & wheat fields", ink: "#5a3a05", sub: "#a8650a", sky: ["#8fd3f5", "#fff3c4"],
    draw: () => (
      <>
        <Sun cx={58} cy={150} r={18} />
        <rect y="250" width="300" height="150" fill="#e8b730" />
        <g stroke="#b8860b" strokeWidth="2" strokeLinecap="round">
          {Array.from({ length: 6 }).flatMap((_, r) => Array.from({ length: 24 }).map((__, c) => {
            const x = 6 + c * 12.5 + (r % 2) * 6;
            const y = 262 + r * 22;
            return <path key={`${r}-${c}`} d={`M${x},${y + 14} L${x},${y} M${x},${y + 4} l-4,-5 M${x},${y + 4} l4,-5`} />;
          }))}
        </g>
        <g stroke="#3a1c08" strokeWidth="3" strokeLinejoin="round">
          <rect x="92" y="296" width="116" height="56" rx="26" fill="#a65a22" />
          <ellipse cx="94" cy="324" rx="10" ry="28" fill="#f3e2b6" />
          <ellipse cx="206" cy="324" rx="10" ry="28" fill="#f3e2b6" />
          <path d="M100 300 L116 348 L132 300 L148 348 L164 300 L180 348 L196 300" fill="none" stroke="#f5edd8" strokeWidth="3.5" />
          <path d="M60 262 L120 306 M240 262 L186 306" stroke="#5a3418" strokeWidth="5" strokeLinecap="round" />
          <circle cx="60" cy="262" r="6" fill="#c8421f" /><circle cx="240" cy="262" r="6" fill="#c8421f" />
        </g>
      </>
    ),
  },
  // Techlab — craft and engineering: Tamil Nadu's gopuram
  techlab: {
    state: "Tamil Nadu", landmark: "Temple gopuram", ink: "#0a4a52", sub: "#118a99", sky: ["#3dbcc9", "#ffe9b0"],
    draw: () => (
      <>
        <Sun cx={240} cy={150} r={16} />
        <rect y="352" width="300" height="48" fill="#c98a4b" />
        <g stroke="#4a1a14" strokeWidth="2" strokeLinejoin="round">
          {Array.from({ length: 7 }).map((_, i) => {
            const w = 150 - i * 15;
            const y = 352 - (i + 1) * 28;
            return (
              <g key={i}>
                <rect x={150 - w / 2} y={y} width={w} height={28} fill={i % 2 ? "#f0a830" : "#d9534f"} />
                <rect x={150 - w / 2 - 4} y={y - 3} width={w + 8} height={6} fill="#f5edd8" />
                {Array.from({ length: Math.floor(w / 16) }).map((_, k) => <circle key={k} cx={150 - w / 2 + 12 + k * 16} cy={y + 15} r="3" fill="#fff3d6" stroke="none" />)}
              </g>
            );
          })}
          <path d="M112 196 q38 -34 76 0 Z" fill="#c0392b" />
          {[126, 150, 174].map((x) => <g key={x}><line x1={x} y1="176" x2={x} y2="164" /><circle cx={x} cy="161" r="3.5" fill="#f0a830" /></g>)}
          <Arch x={130} y={310} w={40} h={42} fill="#3a1208" />
        </g>
      </>
    ),
  },
  // Startup Business Plan — gateway to trade: Maharashtra's Gateway of India
  "startup-business-plan": {
    state: "Maharashtra", landmark: "Gateway of India", ink: "#5a2a0e", sub: "#b0481a", sky: ["#ff9a6c", "#ffe3a8"],
    draw: () => (
      <>
        <Sun cx={228} cy={150} r={20} fill="#fff1b8" rays="#ffd166" />
        <rect y="318" width="300" height="82" fill="#1b6aa5" />
        <g stroke="#6bb4e6" strokeWidth="2.5" fill="none" strokeLinecap="round">
          <path d="M10 346 q10 -6 20 0 t20 0" /><path d="M220 360 q10 -6 20 0 t20 0" /><path d="M120 380 q10 -6 20 0 t20 0" />
        </g>
        <g stroke="#5a3a1c" strokeWidth="2.5" strokeLinejoin="round">
          <rect x="74" y="232" width="152" height="88" fill="#d4ab7c" />
          <rect x="84" y="204" width="132" height="30" fill="#c9a074" />
          {[86, 124, 162, 200].map((x) => <g key={x}><rect x={x} y="190" width="14" height="16" fill="#c9a074" /><Dome cx={x + 7} cy={190} r={8} fill="#d4ab7c" stroke="#5a3a1c" /></g>)}
          <Arch x={118} y={246} w={64} h={74} fill="#3a2410" />
          <Arch x={84} y={268} w={22} h={52} fill="#3a2410" />
          <Arch x={194} y={268} w={22} h={52} fill="#3a2410" />
          <Dome cx={150} cy={204} r={20} fill="#d4ab7c" stroke="#5a3a1c" />
        </g>
        <g fill="#f5edd8" stroke="#3a2410" strokeWidth="2"><polygon points="40,352 40,332 64,352" /><polygon points="246,364 246,342 270,364" /></g>
      </>
    ),
  },
  // Riwayat Fashion Show — heritage and grace: Uttar Pradesh's Taj Mahal
  "riwayat-fashion-show": {
    state: "Uttar Pradesh", landmark: "Taj Mahal", ink: "#6e2a3a", sub: "#b3496a", sky: ["#ffb3a0", "#ffeccb"],
    draw: () => (
      <>
        <circle cx="60" cy="150" r="22" fill="#fff4d0" opacity="0.9" />
        <rect x="60" y="318" width="180" height="16" fill="#f1e6d3" stroke="#a89880" strokeWidth="2" />
        <g stroke="#a89880" strokeWidth="2.5" strokeLinejoin="round">
          {[78, 222].map((x) => <g key={x}><rect x={x - 7} y="214" width="14" height="104" fill="#fff7ea" /><rect x={x - 10} y="206" width="20" height="10" fill="#f1e6d3" /><Dome cx={x} cy={206} r={8} fill="#fff7ea" stroke="#a89880" /></g>)}
          <rect x="108" y="252" width="84" height="66" fill="#fff7ea" />
          <Dome cx={150} cy={252} r={34} fill="#fff7ea" stroke="#a89880" />
          <Dome cx={118} cy={252} r={9} fill="#fff7ea" stroke="#a89880" />
          <Dome cx={182} cy={252} r={9} fill="#fff7ea" stroke="#a89880" />
          <Arch x={134} y={266} w={32} h={52} fill="#5a3a4a" />
        </g>
        <rect y="334" width="300" height="66" fill="#79bcd8" />
        <g opacity="0.55" transform="translate(0 668) scale(1 -1)"><rect x="108" y="252" width="84" height="40" fill="#fff7ea" /></g>
        <g stroke="#bfe3f2" strokeWidth="2.5" fill="none" strokeLinecap="round"><path d="M30 362 q10 -5 20 0 t20 0" /><path d="M200 376 q10 -5 20 0 t20 0" /></g>
      </>
    ),
  },
  // Roadies — mountain trails: Himachal Pradesh's wooden pagoda temple
  roadies: {
    state: "Himachal Pradesh", landmark: "Hill temple", ink: "#0f2d52", sub: "#1b6aa5", sky: ["#8fd1ee", "#dff1f7"],
    draw: () => (
      <>
        <g>
          <circle cx="238" cy="148" r="20" fill="#ffc42e" /><circle cx="238" cy="148" r="9" fill="none" stroke="#ffb000" strokeWidth="3" />
          <Rays cx={238} cy={148} r={20} />
        </g>
        <Cloud x={70} y={150} s={0.9} /><Cloud x={210} y={196} s={0.7} />
        <polygon points="0,300 70,196 130,300" fill="#cfe3f0" /><polygon points="180,300 250,210 300,300" fill="#cfe3f0" />
        <polygon points="70,196 54,222 70,214 84,224" fill="#fff" />
        <Pine x={28} y={310} s={1.3} /><Pine x={262} y={312} s={1.25} /><Pine x={64} y={326} s={1} c="#17483a" /><Pine x={232} y={328} s={1} c="#17483a" />
        <g stroke="#3a1c08" strokeWidth="2.5" strokeLinejoin="round">
          <rect x="102" y="300" width="96" height="40" fill="#7a3d18" />
          <polygon points="86,300 214,300 190,268 110,268" fill="#e8742a" />
          <rect x="116" y="248" width="68" height="22" fill="#7a3d18" />
          <polygon points="100,252 200,252 178,226 122,226" fill="#f08a34" />
          <rect x="128" y="204" width="44" height="24" fill="#7a3d18" />
          <polygon points="116,208 184,208 166,182 134,182" fill="#e8742a" />
          <line x1="150" y1="182" x2="150" y2="162" /><circle cx="150" cy="158" r="4" fill="#f5c928" />
          <Arch x={138} y={316} w={24} h={24} fill="#2a1208" />
        </g>
        <rect y="340" width="300" height="60" fill="#2f7a4a" />
        <path d="M120 400 Q150 362 180 340" stroke="#d9c79a" strokeWidth="14" fill="none" strokeLinecap="round" />
      </>
    ),
  },
  // Voice of Youth — a nation's voice: Delhi's Red Fort
  "voice-of-youth": {
    state: "Delhi", landmark: "Red Fort", ink: "#5a1a14", sub: "#b0361f", sky: ["#8fd0ee", "#fff0cf"],
    draw: () => (
      <>
        <Cloud x={60} y={150} s={0.9} /><Cloud x={236} y={176} s={0.7} />
        <rect y="352" width="300" height="48" fill="#6aa86e" />
        <g stroke="#4a1208" strokeWidth="2.5" strokeLinejoin="round">
          <rect x="14" y="290" width="272" height="62" fill="#b5402a" />
          {Array.from({ length: 22 }).map((_, i) => <rect key={i} x={16 + i * 12.4} y="282" width="8" height="9" fill="#b5402a" />)}
          <rect x="108" y="236" width="84" height="116" fill="#c24a32" />
          <Arch x={126} y={262} w={48} h={90} fill="#2a0e08" />
          {[96, 192].map((x) => <g key={x}><rect x={x - 6} y="222" width="20" height="130" fill="#c24a32" /><Dome cx={x + 4} cy={222} r={14} fill="#fff7ea" stroke="#4a1208" /></g>)}
          {[122, 146, 170].map((x) => <g key={x}><rect x={x - 3} y="226" width="8" height="12" fill="#fff7ea" /><Dome cx={x + 1} cy={226} r={6} fill="#fff7ea" stroke="#4a1208" /></g>)}
          <line x1="150" y1="226" x2="150" y2="178" /><polygon points="150,178 150,194 176,186" fill="#ff9933" stroke="none" /><polygon points="150,194 150,200 176,192 176,186" fill="#138808" stroke="none" />
        </g>
      </>
    ),
  },
  // AIMA — strategy and city planning: Telangana's Charminar
  "business-quiz": {
    state: "Telangana", landmark: "Charminar", ink: "#6a3a16", sub: "#a8601e", sky: ["#6fc3e8", "#ffe6b8"],
    draw: () => (
      <>
        <Sun cx={248} cy={150} r={16} />
        <rect y="352" width="300" height="48" fill="#d8b678" />
        <g stroke="#6a4a22" strokeWidth="2.5" strokeLinejoin="round">
          <rect x="82" y="276" width="136" height="76" fill="#ecdcbc" />
          <rect x="94" y="206" width="112" height="72" fill="#f3e6c8" />
          <Arch x={124} y={292} w={52} h={60} fill="#3a2410" />
          {[112, 138, 164].map((x) => <Arch key={x} x={x - 3} y={220} w={20} h={42} fill="#7a5a30" />)}
          {[74, 226].map((x) => <g key={x}><rect x={x - 8} y="164" width="16" height="188" fill="#f3e6c8" /><rect x={x - 11} y="160" width="22" height="9" fill="#ecdcbc" /><rect x={x - 11} y="226" width="22" height="7" fill="#ecdcbc" /><Dome cx={x} cy={160} r={10} fill="#f3e6c8" stroke="#6a4a22" /></g>)}
          {[108, 192].map((x) => <g key={x}><rect x={x - 6} y="176" width="12" height="32" fill="#f3e6c8" /><Dome cx={x} cy={176} r={8} fill="#f3e6c8" stroke="#6a4a22" /></g>)}
        </g>
      </>
    ),
  },
  // Retail Sale & Visual Merchandise — a bazaar of striped stalls
  "retail-sale-visual-merchandise": {
    state: "Bazaar", landmark: "Stalls & displays", ink: "#5a1a3a", sub: "#b0366f", sky: ["#ffd0e6", "#fff0cf"],
    draw: () => (
      <>
        <Cloud x={64} y={152} s={0.8} />
        <rect y="352" width="300" height="48" fill="#c9a36a" />
        <g stroke="#4a1230" strokeWidth="2.5" strokeLinejoin="round">
          {[[34, "#e8479a"], [158, "#ffb800"]].map(([x, c]) => (
            <g key={x as number}>
              <rect x={(x as number) + 6} y="262" width="92" height="90" fill="#f3e6c8" />
              <path d={`M${x} 262 L${(x as number) + 104} 262 L${(x as number) + 96} 222 L${(x as number) + 8} 222 Z`} fill={c as string} />
              {[0, 1, 2, 3].map((i) => <path key={i} d={`M${(x as number) + 8 + i * 22} 222 L${(x as number) + 30 + i * 22} 222 L${(x as number) + 26 + i * 26} 262 L${(x as number) + i * 26} 262 Z`} fill="#fff7ea" />)}
              {[0, 1, 2].map((i) => <rect key={i} x={(x as number) + 16 + i * 28} y="300" width="20" height="24" fill={["#5b2a8c", "#1f6b3a", "#c1121f"][i]} />)}
            </g>
          ))}
        </g>
      </>
    ),
  },
  // Codigo — the green hills: Assam's tea gardens and rhino
  codigo: {
    state: "Assam", landmark: "Tea gardens & rhino", ink: "#1f5a3a", sub: "#2e8a56", sky: ["#a8e0c4", "#fff2c4"],
    draw: () => (
      <>
        <Sun cx={236} cy={150} r={18} fill="#ffb347" rays="#ff9f1c" />
        <Cloud x={66} y={152} s={0.8} />
        <rect y="240" width="300" height="160" fill="#3a9c5a" />
        <g stroke="#1f6e3c" strokeWidth="7" fill="none" strokeLinecap="round" opacity="0.8">
          {[262, 284, 306, 328, 350, 372].map((y, i) => <path key={y} d={`M-10 ${y} Q80 ${y - 14 - i * 2} 150 ${y} T310 ${y}`} />)}
        </g>
        <g stroke="#2a2a2a" strokeWidth="2.5" strokeLinejoin="round" fill="#7a7a82">
          <rect x="96" y="282" width="118" height="52" rx="24" />
          <rect x="108" y="322" width="16" height="26" /><rect x="132" y="324" width="16" height="24" /><rect x="170" y="324" width="16" height="24" /><rect x="192" y="322" width="16" height="26" />
          <path d="M96 296 Q70 292 64 316 Q82 330 104 322 Z" />
          <path d="M66 312 L52 286 L74 304 Z" fill="#cfcfd4" />
          <ellipse cx="108" cy="292" rx="7" ry="9" fill="#5e5e66" />
          <path d="M214 300 q22 -4 18 22" fill="none" />
        </g>
        <circle cx="86" cy="308" r="2.4" fill="#111" />
      </>
    ),
  },
  // Designathon — craft meets design: Chhattisgarh's Dhokra brass figure and sal forest
  designathon: {
    state: "Chhattisgarh", landmark: "Dhokra craft", ink: "#5a3a05", sub: "#a8650a", sky: ["#ffe0a0", "#ffb360"],
    draw: () => (
      <>
        <g fill="#2f6b3a" stroke="#1d4a28" strokeWidth="2.5">
          {[[26, 250], [270, 258], [62, 278], [236, 282]].map(([x, y], i) => (
            <g key={i}><rect x={x - 4} y={y} width="8" height="86" fill="#5a3418" stroke="none" /><circle cx={x} cy={y} r={i < 2 ? 32 : 26} /><circle cx={x - 14} cy={y + 10} r="18" /><circle cx={x + 14} cy={y + 12} r="18" /></g>
          ))}
        </g>
        <rect y="352" width="300" height="48" fill="#6b4a1c" />
        <circle cx="150" cy="268" r="88" fill="none" stroke="#a8650a" strokeWidth="3" strokeDasharray="3 8" strokeLinecap="round" />
        <circle cx="150" cy="268" r="74" fill="#ffd27a" opacity="0.55" />
        <g stroke="#6e4a0c" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="#c8932f">
          <circle cx="150" cy="214" r="14" />
          <path d="M136 232 Q150 224 164 232 L172 296 L128 296 Z" />
          <path d="M136 238 Q104 222 98 196 M164 238 Q196 222 202 196" fill="none" strokeWidth="9" stroke="#c8932f" />
          <path d="M128 296 Q122 330 112 346 M172 296 Q178 330 188 346" fill="none" strokeWidth="11" stroke="#c8932f" />
          <g fill="none" stroke="#6e4a0c" strokeWidth="1.8">
            <circle cx="150" cy="214" r="8" /><path d="M138 246 q12 6 24 0 M136 262 q14 7 28 0 M134 278 q16 8 32 0" />
          </g>
          <circle cx="150" cy="198" r="4" fill="#6e4a0c" stroke="none" />
        </g>
        <g fill="#6e4a0c" opacity="0.7">{[0, 1, 2, 3, 4, 5, 6, 7].map((i) => <circle key={i} cx={30 + i * 34} cy="374" r="3" />)}</g>
      </>
    ),
  },
};

export function CultureScene({ slug, className = "" }: { slug: string; className?: string }) {
  const c = CULTURES[slug];
  if (!c) return null;
  const id = `sky-${slug}`;
  return (
    <svg viewBox="0 0 300 400" preserveAspectRatio="xMidYMid slice" className={className} aria-hidden>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={c.sky[0]} />
          <stop offset="1" stopColor={c.sky[1]} />
        </linearGradient>
      </defs>
      <rect width="300" height="400" fill={`url(#${id})`} />
      {c.draw()}
    </svg>
  );
}
