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
      color: {
        dark: isExternal ? "#4c1d95" : "#0c4a6e", // violet-900 : sky-900
        light: "#ffffff",
      },
    });
  }, [userId, isExternal]);

  const cardBg    = isExternal ? "bg-violet-600" : "bg-sky-600";
  const subText   = isExternal ? "text-violet-200" : "text-sky-200";
  const codeText  = isExternal ? "text-violet-100" : "text-sky-100";
  const badgeCls  = isExternal
    ? "bg-violet-400/40 text-violet-100"
    : "bg-sky-400/40 text-sky-100";

  return (
    <div className="space-y-5 animate-slide-up" style={{ animationDelay: "0.06s" }}>

      {/* QR card */}
      <div className={`${cardBg} rounded-3xl p-6 flex flex-col items-center gap-4`}>
        <div className="bg-white rounded-2xl p-3 shadow-lg">
          <canvas ref={canvasRef} className="block" />
        </div>
        <div className="text-center">
          <p className="text-base font-bold text-white">{fullName}</p>
          <p className={`text-xs ${subText} mt-0.5`}>{email}</p>
          {identifier && (
            <code className={`text-xs font-mono ${codeText} mt-1 block`}>{identifier}</code>
          )}
        </div>
        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${badgeCls}`}>
          {isExternal ? "External participant" : "OPJU student"}
        </span>
      </div>

      <div className={`border rounded-2xl px-5 py-4 text-center ${
        isExternal ? "bg-violet-50 border-violet-100" : "bg-sky-50 border-sky-100"
      }`}>
        <p className={`text-xs leading-relaxed ${isExternal ? "text-violet-700" : "text-sky-700"}`}>
          Present this QR code to the event manager at each event check-in counter.
          They will scan it to mark your attendance.
        </p>
      </div>

    </div>
  );
}
