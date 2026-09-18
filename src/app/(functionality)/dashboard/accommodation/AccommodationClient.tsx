"use client";
import { useState } from "react";
import { setAccommodationDetailsAction } from "@/actions/accommodation-actions";
import {
  Hotel, CheckCircle2, Pencil, Calendar, User2, Building2,
  AlignLeft, Users, Phone,
} from "lucide-react";

interface AccomData {
  _id?: string;
  arrivalTime?: string;
  departureTime?: string;
  universityName?: string;
  gender?: string;
  additionalDetails?: string;
  groupName?: string;
}

interface Props {
  initial: AccomData | null;
  userUniversity?: string;
  userGender?: string;
  userPhone?: string;
}

const GENDER_OPTIONS = ["Male", "Female", "Other"] as const;

function fmt(d?: string) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function fmtTime(d?: string) {
  if (!d) return "";
  return new Date(d).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
}

function toLocalInput(d?: string) {
  if (!d) return "";
  return new Date(d).toISOString().slice(0, 16);
}

export default function AccommodationClient({ initial, userUniversity, userGender, userPhone }: Props) {
  const [accom, setAccom] = useState<AccomData | null>(initial);
  const [editing, setEditing] = useState(!initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [arrivalTime, setArrivalTime]               = useState(toLocalInput(initial?.arrivalTime));
  const [departureTime, setDepartureTime]           = useState(toLocalInput(initial?.departureTime));
  const [universityName, setUniversityName]         = useState(initial?.universityName ?? userUniversity ?? "");
  const [gender, setGender]                         = useState<string>(initial?.gender ?? userGender ?? "");
  const [additionalDetails, setAdditionalDetails]   = useState(initial?.additionalDetails ?? "");
  const [groupName, setGroupName]                   = useState(initial?.groupName ?? "");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!arrivalTime || !departureTime || !universityName || !gender) {
      setError("Please fill all required fields.");
      return;
    }
    if (new Date(departureTime) <= new Date(arrivalTime)) {
      setError("Departure must be after arrival.");
      return;
    }
    setSaving(true);
    try {
      const saved = await setAccommodationDetailsAction({
        arrivalTime: new Date(arrivalTime),
        departureTime: new Date(departureTime),
        universityName,
        gender: gender as "Male" | "Female" | "Other",
        additionalDetails: additionalDetails || undefined,
        groupName: groupName.trim() || undefined,
      });
      setAccom(saved as unknown as AccomData);
      setEditing(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      setError("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  function handleEdit() {
    setArrivalTime(toLocalInput(accom?.arrivalTime));
    setDepartureTime(toLocalInput(accom?.departureTime));
    setUniversityName(accom?.universityName ?? userUniversity ?? "");
    setGender(accom?.gender ?? userGender ?? "");
    setAdditionalDetails(accom?.additionalDetails ?? "");
    setGroupName(accom?.groupName ?? "");
    setEditing(true);
  }

  const GENDER_COLOR: Record<string, string> = {
    Male:   "bg-sky-50 text-sky-700 border border-sky-200",
    Female: "bg-pink-50 text-pink-700 border border-pink-200",
    Other:  "bg-slate-50 text-slate-600 border border-slate-200",
  };

  if (!editing && accom) {
    return (
      <div className="space-y-5">
        {success && (
          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 animate-slide-up">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <p className="text-sm text-emerald-800 font-medium">Accommodation request saved.</p>
          </div>
        )}

        {/* Summary card */}
        <div className="bg-white border border-slate-100 border-l-4 border-l-violet-400 rounded-2xl px-5 py-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-violet-50 flex items-center justify-center">
                <Hotel className="h-4 w-4 text-violet-600" />
              </div>
              <p className="text-sm font-semibold text-slate-900">Accommodation requested</p>
            </div>
            <button
              onClick={handleEdit}
              className="inline-flex items-center gap-1.5 text-xs text-violet-600 hover:text-violet-700 font-medium"
            >
              <Pencil className="h-3.5 w-3.5" /> Edit
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 rounded-xl px-3 py-2.5">
              <p className="text-[10px] text-slate-400 font-medium mb-0.5">Arrival</p>
              <p className="text-sm font-semibold text-slate-900">{fmt(accom.arrivalTime)}</p>
              <p className="text-xs text-slate-400">{fmtTime(accom.arrivalTime)}</p>
            </div>
            <div className="bg-slate-50 rounded-xl px-3 py-2.5">
              <p className="text-[10px] text-slate-400 font-medium mb-0.5">Departure</p>
              <p className="text-sm font-semibold text-slate-900">{fmt(accom.departureTime)}</p>
              <p className="text-xs text-slate-400">{fmtTime(accom.departureTime)}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {accom.gender && (
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${GENDER_COLOR[accom.gender] ?? "bg-slate-50 text-slate-600 border border-slate-200"}`}>
                {accom.gender}
              </span>
            )}
            {accom.universityName && (
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <Building2 className="h-3.5 w-3.5 shrink-0" />
                {accom.universityName}
              </div>
            )}
          </div>

          {accom.groupName && (
            <div className="flex items-center gap-2 bg-violet-50 rounded-xl px-3 py-2">
              <Users className="h-3.5 w-3.5 text-violet-500 shrink-0" />
              <div>
                <p className="text-[10px] text-violet-400 font-medium">Group</p>
                <p className="text-xs font-semibold text-violet-800">{accom.groupName}</p>
              </div>
            </div>
          )}

          {userPhone && (
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Phone className="h-3.5 w-3.5 shrink-0" />
              {userPhone}
            </div>
          )}

          {accom.additionalDetails && (
            <div className="flex items-start gap-1.5 text-xs text-slate-400">
              <AlignLeft className="h-3.5 w-3.5 shrink-0 mt-0.5" />
              <p>{accom.additionalDetails}</p>
            </div>
          )}
        </div>

        <p className="text-xs text-slate-400 text-center">
          Accommodation is provided for external participants only. Contact the organiser for any changes.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Arrival */}
      <div>
        <label className="block text-xs font-medium text-slate-700 mb-1.5">
          <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> Arrival date &amp; time <span className="text-red-400">*</span></span>
        </label>
        <input
          type="datetime-local"
          value={arrivalTime}
          onChange={(e) => setArrivalTime(e.target.value)}
          required
          className="w-full text-sm bg-white border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-400 transition"
        />
      </div>

      {/* Departure */}
      <div>
        <label className="block text-xs font-medium text-slate-700 mb-1.5">
          <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> Departure date &amp; time <span className="text-red-400">*</span></span>
        </label>
        <input
          type="datetime-local"
          value={departureTime}
          onChange={(e) => setDepartureTime(e.target.value)}
          required
          className="w-full text-sm bg-white border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-400 transition"
        />
      </div>

      {/* University name */}
      <div>
        <label className="block text-xs font-medium text-slate-700 mb-1.5">
          <span className="flex items-center gap-1.5"><Building2 className="h-3.5 w-3.5" /> College / University <span className="text-red-400">*</span></span>
        </label>
        <input
          type="text"
          value={universityName}
          onChange={(e) => setUniversityName(e.target.value)}
          placeholder="e.g. ABC Institute of Technology"
          required
          className="w-full text-sm bg-white border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-400 transition"
        />
      </div>

      {/* Gender */}
      <div>
        <label className="block text-xs font-medium text-slate-700 mb-1.5">
          <span className="flex items-center gap-1.5"><User2 className="h-3.5 w-3.5" /> Gender <span className="text-red-400">*</span></span>
        </label>
        <div className="flex gap-2">
          {GENDER_OPTIONS.map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => setGender(g)}
              className={`flex-1 py-2 rounded-xl text-sm font-medium border transition ${
                gender === g
                  ? g === "Male"   ? "bg-sky-500 text-white border-sky-500"
                  : g === "Female" ? "bg-pink-500 text-white border-pink-500"
                  :                  "bg-slate-700 text-white border-slate-700"
                  : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Group name */}
      <div>
        <label className="block text-xs font-medium text-slate-700 mb-1.5">
          <span className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5" /> Group name <span className="text-slate-400 font-normal">(optional)</span></span>
        </label>
        <input
          type="text"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          placeholder="e.g. Team Alpha, or your team name"
          className="w-full text-sm bg-white border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-400 transition"
        />
        <p className="text-xs text-slate-400 mt-1">
          Want to stay with your teammates? Enter the same group name — each person must apply separately.
        </p>
      </div>

      {/* Additional details */}
      <div>
        <label className="block text-xs font-medium text-slate-700 mb-1.5">
          <span className="flex items-center gap-1.5"><AlignLeft className="h-3.5 w-3.5" /> Additional notes <span className="text-slate-400 font-normal">(optional)</span></span>
        </label>
        <textarea
          value={additionalDetails}
          onChange={(e) => setAdditionalDetails(e.target.value)}
          placeholder="Any dietary requirements, room preferences, or other needs…"
          rows={3}
          className="w-full text-sm bg-white border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-400 transition resize-none"
        />
      </div>

      <div className="flex gap-3">
        {accom && (
          <button
            type="button"
            onClick={() => setEditing(false)}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-600 font-medium hover:bg-slate-50 transition"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={saving}
          className="flex-1 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold disabled:opacity-60 transition flex items-center justify-center gap-2"
        >
          {saving ? (
            <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Saving…</>
          ) : (
            <><Hotel className="h-4 w-4" /> {accom ? "Update request" : "Submit request"}</>
          )}
        </button>
      </div>
    </form>
  );
}
