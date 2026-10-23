"use client";
import { useEffect, useRef } from "react";
import QRCode from "qrcode";

interface Props {
  userId: string;
  fullName: string;
  email: string;
  role: string;
  identifier: string;
}

export default function QRDisplay({ userId, fullName, email, role, identifier }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const isExternal = role === "EXTERNAL_USER";

  useEffect(() => {
    if (!canvasRef.current || !userId) return;
    QRCode.toCanvas(canvasRef.current, userId, {
      width: 256,
      margin: 2,
      color: { dark: "#1a0505", light: "#ffffff" },
    });
  }, [userId]);

  return (
    <div className="space-y-6">

      {/* QR ticket */}
      <div className="relative overflow-hidden rounded-2xl border-2 border-black bg-[#f5c928] text-black shadow-[6px_6px_0_0_#000]">
        <span aria-hidden className="absolute -left-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full border-2 border-black bg-[#4a0e0e]" />
        <span aria-hidden className="absolute -right-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full border-2 border-black bg-[#4a0e0e]" />
        <div className="flex flex-col items-center gap-4 px-8 py-6">
          <p className="text-xs font-bold uppercase tracking-[0.3em] opacity-70">Admit one · All access</p>
          <div className="border-2 border-black bg-white p-3 shadow-[4px_4px_0_0_#000]">
            <canvas ref={canvasRef} className="block" />
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold uppercase leading-tight">{fullName}</p>
            <p className="text-sm text-black/65">{email}</p>
            {identifier && <code className="mt-1 block font-mono text-sm font-bold">{identifier}</code>}
          </div>
          <span className="bg-[#7a1c1c] px-2 py-1 text-xs font-bold uppercase tracking-widest text-[#f5edd8]">
            {isExternal ? "External participant" : "OPJU student"}
          </span>
        </div>
      </div>

      <div className="border-2 border-black bg-[#f5edd8] px-5 py-4 text-center text-[#1a0505] shadow-[4px_4px_0_0_#000]">
        <p className="text-base leading-snug">
          Present this QR code to the event manager at each event check-in counter.
          They will scan it to mark your attendance.
        </p>
      </div>

    </div>
  );
}
