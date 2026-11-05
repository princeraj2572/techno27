import type { ReactElement } from "react";

const Bat = ({ className, style }: { className?: string; style?: React.CSSProperties }): ReactElement => (
  <svg viewBox="0 0 64 32" className={className} style={style} fill="#000" stroke="#9d4edd" strokeWidth="1.5" aria-hidden>
    <path d="M32 8l3 5 6-3 3 6 10-8c-1 9-4 15-12 16l-4-4-2 6-2-6-4 4C21 28 18 22 17 14l10 8 3-6 6 3 3-5z" transform="translate(-2 0)" />
  </svg>
);

const Pumpkin = ({ className }: { className?: string }): ReactElement => (
  <svg viewBox="0 0 64 56" className={className} aria-hidden>
    <path d="M32 8c-4-6-12-6-14-3 3 0 6 2 8 5-12-2-22 6-22 20s10 22 28 22 28-8 28-22S46 8 38 10c2-3 5-5 8-5-2-3-10-3-14 3z" fill="#ff7518" />
    <path d="M32 10c-8 6-8 38 0 44M18 14c-8 10-6 34 6 40M46 14c8 10 6 34-6 40" stroke="#c4500a" strokeWidth="2" fill="none" />
    <path d="M28 4c0-3 2-4 4-4v6z" fill="#3a7a1f" />
    <path d="M16 26l8 4-8 2zM48 26l-8 4 8 2zM24 40l4 4 4-4 4 4 4-4-2 6H26z" fill="#12061f" />
  </svg>
);

// Fixed, click-through decoration: bats fly across, pumpkins sit in the corners.
export default function Halloween(): ReactElement {
  return (
    <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden" aria-hidden>
      {[8, 22, 40].map((top, i) => (
        <Bat
          key={top}
          className="absolute left-0 w-16 opacity-90"
          style={{ top: `${top}%`, animation: `bat-fly ${22 + i * 7}s linear ${i * -9}s infinite` }}
        />
      ))}
      <Pumpkin className="absolute bottom-2 left-2 w-14 sm:w-20" />
      <Pumpkin className="absolute bottom-2 right-2 w-10 sm:w-14" />
    </div>
  );
}
