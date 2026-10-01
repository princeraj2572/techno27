"use client";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { X } from "lucide-react";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { OTHER_BRANCH_VALUE } from "@/data/opju-academics";

interface Props {
  branches: string[];
  departments: string[];
  semesters: string[];
}

const FIELDS: { key: "branch" | "department" | "semester"; label: string; placeholder: string }[] = [
  { key: "department", label: "department", placeholder: "Dept" },
  { key: "branch", label: "branch", placeholder: "Branch" },
  { key: "semester", label: "semester", placeholder: "Sem" },
];

export default function ExtraFilters({ branches, departments, semesters }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const optionsFor = (key: string) =>
    key === "branch" ? branches : key === "department" ? departments : semesters;

  const setParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "__all") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  };

  const hasAnyFilter = FIELDS.some((f) => searchParams.get(f.key));

  return (
    <div className="flex items-center gap-1.5">
      <div className="grid grid-cols-3 gap-1.5 w-[13.5rem] sm:w-[19.5rem]">
        {FIELDS.map((f) => {
          const value = searchParams.get(f.key) ?? "__all";
          const options = optionsFor(f.key);
          return (
            <Select key={f.key} value={value} onValueChange={(v) => setParam(f.key, v)}>
              <SelectTrigger className="h-7 w-full px-2 text-[11px]">
                <SelectValue placeholder={f.placeholder}>
                  {value === "__all" ? f.placeholder : value === OTHER_BRANCH_VALUE ? "Other" : value}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all">All {f.label}s</SelectItem>
                {options.map((opt) => (
                  <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                ))}
                {f.key === "branch" && (
                  <SelectItem value={OTHER_BRANCH_VALUE}>Other</SelectItem>
                )}
              </SelectContent>
            </Select>
          );
        })}
      </div>
      {hasAnyFilter && (
        <button
          onClick={() => {
            const params = new URLSearchParams(searchParams.toString());
            FIELDS.forEach((f) => params.delete(f.key));
            params.delete("page");
            const qs = params.toString();
            router.push(qs ? `${pathname}?${qs}` : pathname);
          }}
          title="Clear filters"
          className="shrink-0 text-slate-400 hover:text-slate-600 p-1"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}
