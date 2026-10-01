import type { ReactNode } from "react";

interface Props {
  label: string;
  value: ReactNode;
  icon?: ReactNode;
  bg: string;
  labelColor: string;
  valueColor: string;
  wide?: boolean;
}

export default function StatTile({ label, value, icon, bg, labelColor, valueColor, wide }: Props) {
  return (
    <div className={`rounded-xl px-3 py-2.5 ${bg} ${wide ? "col-span-2" : ""}`}>
      <p className={`text-[10px] font-medium mb-0.5 ${labelColor}`}>{label}</p>
      <p className={`text-lg font-bold tabular-nums flex items-center gap-1 ${valueColor}`}>
        {icon}
        {value}
      </p>
    </div>
  );
}
