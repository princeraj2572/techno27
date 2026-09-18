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

  useEffect(() => {
    if (!canvasRef.current || !userId) return;
    QRCode.toCanvas(canvasRef.current, userId, {
      width: 256,
      margin: 2,
      color: { dark: "#1e1b4b", light: "#ffffff" },
    });
  }, [userId]);

  const isExternal = role === "EXTERNAL_USER";

  return (
    <div className="space-y-5 animate-slide-up" style={{ animationDelay: "0.06s" }}>

      {/* QR card */}
      <div className="bg-indigo-600 rounded-3xl p-6 flex flex-col items-center gap-4">
        <div className="bg-white rounded-2xl p-3 shadow-lg">
          <canvas ref={canvasRef} className="block" />
        </div>
        <div className="text-center">
          <p className="text-base font-bold text-white">{fullName}</p>
          <p className="text-xs text-indigo-200 mt-0.5">{email}</p>
          {identifier && (
            <code className="text-xs font-mono text-indigo-100 mt-1 block">{identifier}</code>
          )}
        </div>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
          isExternal ? "bg-amber-400 text-amber-900" : "bg-indigo-400 text-white"
        }`}>
          {isExternal ? "External participant" : "OPJU student"}
        </span>
      </div>

      <div className="bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-center">
        <p className="text-xs text-slate-500 leading-relaxed">
          Present this QR code to the event manager at each event check-in counter.
          They will scan it to mark your attendance.
        </p>
      </div>

    </div>
  );
}
