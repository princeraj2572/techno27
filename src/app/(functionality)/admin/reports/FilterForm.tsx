"use client";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2 } from "lucide-react";

type Option = { label: string; value: string };

interface Props {
  view: string;
  eventOptions?: Option[];
}

const LIMITS = [
  { label: "25 / page", value: "25" },
  { label: "50 / page", value: "50" },
  { label: "100 / page", value: "100" },
];

const VIEW_PATH: Record<string, string> = {
  "event-participants": "/admin/reports/event-participants",
  "payments":           "/admin/reports/payments",
  "accommodation":      "/admin/reports/accommodation",
  "registrations":      "/admin/reports/registrations",
};

export default function FilterForm({ view, eventOptions = [] }: Props) {
  const router = useRouter();
  const sp     = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [q,      setQ]      = useState(sp.get("q")      ?? "");
  const [event,  setEvent]  = useState(sp.get("event")  ?? "");
  const [type,   setType]   = useState(sp.get("type")   ?? "");
  const [status, setStatus] = useState(sp.get("status") ?? "");
  const [gender, setGender] = useState(sp.get("gender") ?? "");
  const [limit,  setLimit]  = useState(sp.get("limit")  ?? "25");

  const basePath = VIEW_PATH[view] ?? `/admin/reports/${view}`;

  const push = useCallback((overrides: Record<string, string>) => {
    const params = new URLSearchParams({
      q, event, type, status, gender, limit,
      ...overrides,
      page: overrides.page ?? "1",
    });
    // strip empty params and default page
    for (const [k, v] of [...params]) { if (!v || (v === "1" && k === "page")) params.delete(k); }
    startTransition(() => router.push(`${basePath}?${params}`));
  }, [basePath, q, event, type, status, gender, limit, router]);

  function onSearch(val: string) {
    setQ(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => push({ q: val }), 400);
  }

  function onSelect(key: string, val: string, setter: (v: string) => void) {
    setter(val);
    push({ [key]: val });
  }

  useEffect(() => {
    setQ(sp.get("q") ?? "");
    setEvent(sp.get("event") ?? "");
    setType(sp.get("type") ?? "");
    setStatus(sp.get("status") ?? "");
    setGender(sp.get("gender") ?? "");
    setLimit(sp.get("limit") ?? "25");
  }, [sp]);

  const selectClass = "h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-400 cursor-pointer";

  return (
    <div className="flex flex-wrap items-center gap-2">

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
        <Input
          value={q}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search…"
          className="pl-8 h-9 w-52 text-sm"
        />
      </div>

      {/* Event filter */}
      {eventOptions.length > 0 && (
        <select value={event} onChange={(e) => onSelect("event", e.target.value, setEvent)} className={selectClass}>
          <option value="">All events</option>
          {eventOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      )}

      {/* Participant type (registrations view) */}
      {view === "registrations" && (
        <select value={type} onChange={(e) => onSelect("type", e.target.value, setType)} className={selectClass}>
          <option value="">All types</option>
          <option value="internal">OPJU (internal)</option>
          <option value="external">External</option>
        </select>
      )}

      {/* Payment status */}
      {view === "payments" && (
        <select value={status} onChange={(e) => onSelect("status", e.target.value, setStatus)} className={selectClass}>
          <option value="">All statuses</option>
          <option value="cleared">Cleared</option>
          <option value="pending">Pending</option>
        </select>
      )}

      {/* Gender (accommodation) */}
      {view === "accommodation" && (
        <select value={gender} onChange={(e) => onSelect("gender", e.target.value, setGender)} className={selectClass}>
          <option value="">All genders</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
      )}

      {/* Rows per page */}
      <select value={limit} onChange={(e) => onSelect("limit", e.target.value, setLimit)} className={selectClass}>
        {LIMITS.map((l) => <option key={l.value} value={l.value}>{l.label}</option>)}
      </select>

      {isPending && <Loader2 className="h-4 w-4 animate-spin text-slate-400" />}

      {/* Clear */}
      {(q || event || type || status || gender) && (
        <Button
          variant="ghost"
          size="sm"
          className="h-9 text-xs text-slate-400"
          onClick={() => {
            setQ(""); setEvent(""); setType(""); setStatus(""); setGender("");
            push({ q: "", event: "", type: "", status: "", gender: "" });
          }}
        >
          Clear filters
        </Button>
      )}
    </div>
  );
}
