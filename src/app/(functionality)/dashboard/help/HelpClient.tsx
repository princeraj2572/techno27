"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Clock, Send } from "lucide-react";
import { CARD_UI, INSET } from "@/components/indie/gold-poster";
import { createHelpQueryAction, type HelpQueryRow } from "@/features/helpdesk/help-actions";
import { HELP_TOPICS } from "@/features/helpdesk/help-topics";

const FIELD = "w-full rounded-xl border-2 border-[#1c1812] bg-white px-3 py-2.5 text-base text-[#1c1812] placeholder:text-black/40 focus:outline-none focus:ring-4 focus:ring-[#f5c928]";
const LABEL = "mb-1 block text-xs font-bold uppercase tracking-widest text-[#1c1812]";
const when = (d: string) => new Date(d).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" });

export default function HelpClient({ initial }: { initial: HelpQueryRow[] }) {
  const router = useRouter();
  const [topic, setTopic] = useState<string>(HELP_TOPICS[0]);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [pending, start] = useTransition();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    start(async () => {
      const res = await createHelpQueryAction({ topic, subject, message });
      if (!res.ok) return setMsg({ ok: false, text: res.error ?? "Could not send." });
      setSubject(""); setMessage("");
      setMsg({ ok: true, text: "Sent! You'll see the reply below." });
      router.refresh();
    });
  };

  return (
    <>
      <form onSubmit={submit} className={`${CARD_UI} space-y-4 p-5 sm:p-6`}>
        <p className="text-xl font-extrabold text-[#1c1812]">Ask a question</p>
        <div className="grid gap-4 sm:grid-cols-[12rem_1fr]">
          <label>
            <span className={LABEL}>Topic</span>
            <select value={topic} onChange={(e) => setTopic(e.target.value)} className={FIELD}>
              {HELP_TOPICS.map((t) => <option key={t}>{t}</option>)}
            </select>
          </label>
          <label>
            <span className={LABEL}>Subject</span>
            <input required minLength={3} maxLength={120} value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="e.g. Payment not showing as cleared" className={FIELD} />
          </label>
        </div>
        <label className="block">
          <span className={LABEL}>Your question</span>
          <textarea required minLength={10} maxLength={2000} rows={5} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Tell us what happened and which event it's about." className={FIELD} />
        </label>
        {msg && <p className={`rounded-xl px-3 py-2 text-sm font-semibold ${msg.ok ? "bg-[#d9f2df] text-[#0d3d1a]" : "bg-[#ffd0d0] text-[#6b0010]"}`}>{msg.text}</p>}
        <button disabled={pending} className="inline-flex items-center gap-2 rounded-full border-[3px] border-[#1c1812] bg-[#0f6b63] px-6 py-2.5 font-extrabold uppercase tracking-wider text-white shadow-[0_4px_0_#1c1812] transition hover:-translate-y-0.5 disabled:opacity-60">
          <Send className="h-4 w-4" /> {pending ? "Sending…" : "Send question"}
        </button>
      </form>

      <section className="space-y-3">
        <p className="text-xl font-extrabold text-[#1c1812]">Your questions</p>
        {initial.length === 0 ? (
          <p className="rounded-2xl border-[3px] border-dashed border-[#1c1812]/30 bg-white/60 py-10 text-center text-black/60">No questions yet.</p>
        ) : (
          initial.map((q) => (
            <article key={q._id} className={`${CARD_UI} p-5`}>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-[#fde9a8] px-2.5 py-0.5 text-xs font-bold uppercase text-[#1c1812]">{q.topic}</span>
                {q.status === "OPEN" ? (
                  <span className="inline-flex items-center gap-1 text-xs font-bold uppercase text-[#c8421f]"><Clock className="h-3.5 w-3.5" /> Waiting for reply</span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs font-bold uppercase text-[#0f6b63]"><CheckCircle2 className="h-3.5 w-3.5" /> Answered</span>
                )}
                <span className="ml-auto text-xs text-black/50">{when(q.createdAt)}</span>
              </div>
              <p className="mt-2 font-bold text-[#1c1812]">{q.subject}</p>
              <p className="mt-1 whitespace-pre-wrap text-sm text-black/70">{q.message}</p>
              {q.reply && (
                <div className={`${INSET} mt-3 px-4 py-3`}>
                  <p className="text-xs font-bold uppercase tracking-widest text-[#0f6b63]">Reply from {q.repliedBy ?? "the organisers"}{q.repliedAt ? ` · ${when(q.repliedAt)}` : ""}</p>
                  <p className="mt-1 whitespace-pre-wrap text-sm text-[#1c1812]">{q.reply}</p>
                </div>
              )}
            </article>
          ))
        )}
      </section>
    </>
  );
}
