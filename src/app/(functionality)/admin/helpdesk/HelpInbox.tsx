"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CARD_UI, INSET } from "@/components/indie/gold-poster";
import { replyHelpQueryAction, type HelpQueryRow } from "@/features/helpdesk/help-actions";

const when = (d: string) => new Date(d).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" });

function Row({ q }: { q: HelpQueryRow }) {
  const router = useRouter();
  const [reply, setReply] = useState("");
  const [err, setErr] = useState("");
  const [pending, start] = useTransition();
  const send = () => start(async () => {
    setErr("");
    const res = await replyHelpQueryAction(q._id, reply);
    if (!res.ok) return setErr(res.error ?? "Could not send.");
    router.refresh();
  });
  return (
    <article className={`${CARD_UI} p-5`}>
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="rounded-full bg-[#fde9a8] px-2.5 py-0.5 font-bold uppercase text-[#1c1812]">{q.topic}</span>
        <span className="font-semibold text-[#1c1812]">{q.userName}</span>
        <a href={`mailto:${q.userEmail}`} className="text-[#0f6b63] hover:underline">{q.userEmail}</a>
        <span className="ml-auto text-black/50">{when(q.createdAt)}</span>
      </div>
      <p className="mt-2 font-bold text-[#1c1812]">{q.subject}</p>
      <p className="mt-1 whitespace-pre-wrap text-sm text-black/70">{q.message}</p>
      {q.status === "RESOLVED" ? (
        <div className={`${INSET} mt-3 px-4 py-3`}>
          <p className="text-xs font-bold uppercase tracking-widest text-[#0f6b63]">Answered by {q.repliedBy}{q.repliedAt ? ` · ${when(q.repliedAt)}` : ""}</p>
          <p className="mt-1 whitespace-pre-wrap text-sm text-[#1c1812]">{q.reply}</p>
        </div>
      ) : (
        <div className="mt-3 space-y-2">
          <textarea value={reply} onChange={(e) => setReply(e.target.value)} rows={3} maxLength={2000} placeholder="Write a reply…" className="w-full rounded-xl border-2 border-[#1c1812] bg-white px-3 py-2 text-sm focus:outline-none focus:ring-4 focus:ring-[#f5c928]" />
          {err && <p className="text-sm font-semibold text-[#6b0010]">{err}</p>}
          <button onClick={send} disabled={pending || reply.trim().length < 2} className="rounded-full border-[3px] border-[#1c1812] bg-[#0f6b63] px-5 py-1.5 text-sm font-extrabold uppercase text-white shadow-[0_3px_0_#1c1812] disabled:opacity-50">
            {pending ? "Sending…" : "Reply & mark answered"}
          </button>
        </div>
      )}
    </article>
  );
}

export default function HelpInbox({ rows }: { rows: HelpQueryRow[] }) {
  if (!rows.length) return <p className="rounded-2xl border-[3px] border-dashed border-[#1c1812]/30 bg-white/60 py-12 text-center text-black/60">Nothing here. 🎉</p>;
  return <div className="space-y-4">{rows.map((q) => <Row key={q._id} q={q} />)}</div>;
}
