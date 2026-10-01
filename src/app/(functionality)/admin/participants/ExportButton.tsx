"use client";
import { useState } from "react";
import { Download, Loader2, AlertCircle } from "lucide-react";

interface Props {
  q: string;
  type: string;
  branch?: string;
  department?: string;
  semester?: string;
}

type Status = "idle" | "loading" | "error";

export default function ExportButton({ q, type, branch, department, semester }: Props) {
  const [status, setStatus] = useState<Status>("idle");
  const [progress, setProgress] = useState<number | null>(null);

  const handleDownload = async () => {
    setStatus("loading");
    setProgress(null);
    try {
      const params = new URLSearchParams();
      if (q) params.set("q", q);
      if (type) params.set("type", type);
      if (branch) params.set("branch", branch);
      if (department) params.set("department", department);
      if (semester) params.set("semester", semester);
      const url = `/api/export/registrations${params.toString() ? `?${params}` : ""}`;

      const res = await fetch(url);
      if (!res.ok || !res.body) throw new Error("Export failed");

      const contentLength = res.headers.get("Content-Length");
      const total = contentLength ? parseInt(contentLength, 10) : 0;

      const reader = res.body.getReader();
      const chunks: Uint8Array[] = [];
      let received = 0;

      // Streams the response so the UI can show live progress instead of
      // blocking on one large await — the page stays fully interactive
      // while a multi-thousand-row workbook is generated and transferred.
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
        received += value.length;
        if (total > 0) setProgress(Math.min(99, Math.round((received / total) * 100)));
      }

      const blob = new Blob(chunks as BlobPart[], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = `participants${type ? `_${type}` : ""}${q ? "_filtered" : ""}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(blobUrl);

      setProgress(100);
      setTimeout(() => { setStatus("idle"); setProgress(null); }, 600);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={status === "loading"}
      className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-800 border border-slate-200 rounded-lg px-3 py-2 disabled:opacity-70 min-w-[9rem] justify-center"
    >
      {status === "loading" ? (
        <>
          <Loader2 className="h-3.5 w-3.5 animate-spin shrink-0" />
          {progress !== null ? `${progress}%` : "Preparing…"}
        </>
      ) : status === "error" ? (
        <>
          <AlertCircle className="h-3.5 w-3.5 text-red-500 shrink-0" /> Failed — retry
        </>
      ) : (
        <>
          <Download className="h-3.5 w-3.5 shrink-0" /> Download Excel
        </>
      )}
    </button>
  );
}
