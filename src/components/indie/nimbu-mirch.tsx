// Nimbu-mirch: a lemon, green and red chillies and a lump of coal on a thread,
// hung at doorways in India to ward off the evil eye ("nazar na lage").
// Original drawing. The swaying animation pivots from the top of the thread.

const Chilli = ({ y, fill, stroke, flip = false }: { y: number; fill: string; stroke: string; flip?: boolean }) => (
  <g transform={flip ? `translate(80 0) scale(-1 1)` : undefined}>
    <path d={`M16 ${y + 4} C28 ${y - 10} 54 ${y - 8} 66 ${y + 6} C58 ${y + 14} 34 ${y + 18} 16 ${y + 4} Z`} fill={fill} stroke={stroke} strokeWidth="2.4" strokeLinejoin="round" />
    <path d={`M16 ${y + 4} q-6 -6 -8 -12`} fill="none" stroke="#124a1f" strokeWidth="3" strokeLinecap="round" />
    <path d={`M26 ${y + 2} C36 ${y - 4} 48 ${y - 3} 58 ${y + 2}`} fill="none" stroke="#ffffff" strokeOpacity="0.45" strokeWidth="2" strokeLinecap="round" />
  </g>
);

export function NimbuMirch({ className = "", sway = true, delay = "0s" }: { className?: string; sway?: boolean; delay?: string }) {
  return (
    <svg viewBox="0 0 80 215" className={`${sway ? "indie-sway" : ""} ${className}`} style={{ animationDelay: delay }} aria-hidden>
      <line x1="40" y1="0" x2="40" y2="196" stroke="#2a1208" strokeWidth="2.4" />
      <circle cx="40" cy="6" r="3.4" fill="#2a1208" />

      <Chilli y={36} fill="#2e9a3e" stroke="#124a1f" />

      {/* lemon */}
      <g stroke="#6e5400" strokeWidth="2.4" strokeLinejoin="round">
        <path d="M17 82 l-6 -3 4 6 Z M63 82 l6 -3 -4 6 Z" fill="#ffe033" />
        <ellipse cx="40" cy="82" rx="23" ry="19" fill="#ffe033" />
      </g>
      <path d="M26 74 q6 -8 16 -8" fill="none" stroke="#fff8b0" strokeWidth="3" strokeLinecap="round" />
      <path d="M52 92 q5 -3 8 -9" fill="none" stroke="#e0b800" strokeWidth="2" strokeLinecap="round" opacity="0.7" />

      <Chilli y={118} fill="#d62828" stroke="#6e0b12" flip />
      <Chilli y={140} fill="#2e9a3e" stroke="#124a1f" />
      <Chilli y={162} fill="#d62828" stroke="#6e0b12" flip />

      {/* coal */}
      <circle cx="40" cy="190" r="10" fill="#1a1a1a" stroke="#000" strokeWidth="2" />
      <ellipse cx="37" cy="186" rx="3" ry="2" fill="#fff" opacity="0.35" />
      <path d="M36 199 q-3 8 -5 12 M44 199 q3 8 5 12" fill="none" stroke="#2a1208" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
