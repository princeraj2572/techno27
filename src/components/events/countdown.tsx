"use client";

import { useEffect, useState } from "react";
import { display } from "@/components/indie";

function parts(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return {
    Days: Math.floor(s / 86400),
    Hours: Math.floor((s % 86400) / 3600),
    Minutes: Math.floor((s % 3600) / 60),
    Seconds: s % 60,
  };
}

// Live countdown. Renders zeros on the server and fills in after mount (no hydration mismatch).
export function Countdown({ to, label = "Time until the festival starts", big = false, stacked = false }: { to: string; label?: string; big?: boolean; stacked?: boolean }) {
  const [left, setLeft] = useState<ReturnType<typeof parts> | null>(null);

  useEffect(() => {
    const target = new Date(to).getTime();
    const tick = () => setLeft(parts(target - Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [to]);

  const shown = left ?? { Days: 0, Hours: 0, Minutes: 0, Seconds: 0 };
  return (
    <div className={stacked ? "grid grid-cols-2 gap-4" : `flex justify-center ${big ? "gap-3 sm:gap-6" : "gap-3"}`} role="timer" aria-label={label}>
      {Object.entries(shown).map(([label, value]) => (
        <div key={label} className={`${stacked ? "px-4 py-6 shadow-[5px_5px_0_0_#000]" : big ? "min-w-[4.5rem] sm:min-w-[8rem] sm:px-6 sm:py-5" : "min-w-[4.5rem]"} border-2 border-black bg-[#f5edd8] px-3 py-2 text-center text-black shadow-[3px_3px_0_0_#000]`}>
          <p className={`${stacked ? "text-6xl sm:text-7xl" : big ? "text-4xl sm:text-7xl" : "text-3xl sm:text-4xl"} leading-none tabular-nums ${display.className}`}>{String(value).padStart(2, "0")}</p>
          <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-black/60">{label}</p>
        </div>
      ))}
    </div>
  );
}
