"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { BrowserQRCodeReader, IScannerControls } from "@zxing/browser";
import { checkInByQRAction, checkInManualAction } from "@/actions/checkin-actions";
import { CheckCircle2, Clock, QrCode, Camera, CameraOff, AlertCircle, X, CheckSquare, UserCheck } from "lucide-react";

export interface ParticipantData {
  _id: string;
  email: string;
  fullName?: string;
  role?: string;
  enrollmentNumber?: string;
  participantId?: string;
  checkedIn: boolean;
}

interface ScanResult {
  success: boolean;
  alreadyCheckedIn?: boolean;
  checkedInAt?: string;
  user?: {
    _id: string;
    fullName: string;
    email: string;
    role: string;
    enrollmentNumber?: string;
    participantId?: string;
    profilePhotoUrl?: string;
    department?: string;
    collegeName?: string;
  };
  error?: string;
}

interface Props {
  eventId: string;
  checkedInById: string;
  initialParticipants: ParticipantData[];
  totalRegistered: number;
  initialCheckedInCount: number;
}

export default function CheckinClient({
  eventId,
  checkedInById,
  initialParticipants,
  totalRegistered,
  initialCheckedInCount,
}: Props) {
  const [participants, setParticipants] = useState(initialParticipants);
  const [checkedInCount, setCheckedInCount] = useState(initialCheckedInCount);

  // Scanner state
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [scanError, setScanError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  // Manual check-in state
  const [manualLoading, setManualLoading] = useState<string | null>(null);
  const [manualErrors, setManualErrors] = useState<Record<string, string>>({});
  const [manualSuccess, setManualSuccess] = useState<Record<string, boolean>>({});

  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsRef = useRef<IScannerControls | null>(null);
  const lastScannedRef = useRef<string>("");
  const resultTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const stopScanner = useCallback(() => {
    if (controlsRef.current) {
      controlsRef.current.stop();
      controlsRef.current = null;
    }
    setScanning(false);
  }, []);

  const startScanner = useCallback(async () => {
    setScanResult(null);
    setScanError(null);
    setScanning(true);
    lastScannedRef.current = "";

    try {
      const reader = new BrowserQRCodeReader();
      if (!videoRef.current) return;
      controlsRef.current = await reader.decodeFromConstraints(
        { video: { facingMode: "environment" } },
        videoRef.current,
        async (result, err) => {
          if (!result || processing) return;
          const text = result.getText();
          if (text === lastScannedRef.current) return;
          lastScannedRef.current = text;
          setProcessing(true);
          const res = await checkInByQRAction(text, eventId, checkedInById);
          setScanResult(res);
          if (res.success) {
            setCheckedInCount((c) => c + 1);
            setParticipants((prev) =>
              prev.map((p) => (p._id === res.user?._id ? { ...p, checkedIn: true } : p))
            );
          }
          setProcessing(false);
          if (resultTimeoutRef.current) clearTimeout(resultTimeoutRef.current);
          resultTimeoutRef.current = setTimeout(() => {
            setScanResult(null);
            lastScannedRef.current = "";
          }, 5000);
        }
      );
    } catch {
      setScanError("Could not access camera. Check browser permissions.");
      setScanning(false);
    }
  }, [eventId, checkedInById, processing]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopScanner();
      if (resultTimeoutRef.current) clearTimeout(resultTimeoutRef.current);
    };
  }, [stopScanner]);

  const handleManualCheckin = async (participantId: string) => {
    setManualLoading(participantId);
    setManualErrors((e) => { const n = { ...e }; delete n[participantId]; return n; });
    const res = await checkInManualAction(participantId, eventId, checkedInById);
    if (res.success) {
      setCheckedInCount((c) => c + 1);
      setParticipants((prev) =>
        prev.map((p) => (p._id === participantId ? { ...p, checkedIn: true } : p))
      );
      setManualSuccess((s) => ({ ...s, [participantId]: true }));
      setTimeout(() => setManualSuccess((s) => { const n = { ...s }; delete n[participantId]; return n; }), 3000);
    } else {
      setManualErrors((e) => ({ ...e, [participantId]: res.error ?? "Check-in failed" }));
      setTimeout(() => setManualErrors((e) => { const n = { ...e }; delete n[participantId]; return n; }), 4000);
    }
    setManualLoading(null);
  };

  const notCheckedIn = participants.filter((p) => !p.checkedIn);
  const checkedIn    = participants.filter((p) => p.checkedIn);

  return (
    <div className="space-y-6">

      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-3 animate-slide-up" style={{ animationDelay: "0.05s" }}>
        <div className="bg-indigo-600 rounded-2xl px-4 py-4">
          <p className="text-xs font-medium text-indigo-200 mb-1">Registered</p>
          <p className="text-2xl font-bold text-white tabular-nums">{totalRegistered}</p>
        </div>
        <div className={`rounded-2xl px-4 py-4 ${checkedInCount > 0 ? "bg-emerald-500" : "bg-slate-50 border border-slate-100"}`}>
          <p className={`text-xs font-medium mb-1 ${checkedInCount > 0 ? "text-emerald-100" : "text-slate-400"}`}>Checked in</p>
          <p className={`text-2xl font-bold tabular-nums ${checkedInCount > 0 ? "text-white" : "text-slate-700"}`}>{checkedInCount}</p>
        </div>
        <div className={`rounded-2xl px-4 py-4 ${notCheckedIn.length > 0 ? "bg-amber-500" : "bg-slate-50 border border-slate-100"}`}>
          <p className={`text-xs font-medium mb-1 ${notCheckedIn.length > 0 ? "text-amber-100" : "text-slate-400"}`}>Pending</p>
          <p className={`text-2xl font-bold tabular-nums ${notCheckedIn.length > 0 ? "text-white" : "text-slate-700"}`}>{notCheckedIn.length}</p>
        </div>
      </div>

      {/* QR Scanner */}
      <div className="animate-slide-up" style={{ animationDelay: "0.08s" }}>
        <div className={`rounded-2xl overflow-hidden border ${scanning ? "border-indigo-200" : "border-slate-100"}`}>
          {/* Scanner header */}
          <div className="flex items-center justify-between px-5 py-4 bg-slate-50">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-100 flex items-center justify-center shrink-0">
                <QrCode className="h-4 w-4 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">QR Scanner</p>
                <p className="text-xs text-slate-400">Scan participant QR codes</p>
              </div>
            </div>
            {scanning ? (
              <button
                onClick={stopScanner}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-medium transition-colors"
              >
                <CameraOff className="h-3.5 w-3.5" />
                Stop
              </button>
            ) : (
              <button
                onClick={startScanner}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium transition-colors"
              >
                <Camera className="h-3.5 w-3.5" />
                Start camera
              </button>
            )}
          </div>

          {/* Camera view */}
          <div className={`relative bg-black transition-all ${scanning ? "h-64" : "h-0"}`}>
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              playsInline
              muted
            />
            {scanning && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-48 h-48 border-2 border-white rounded-2xl opacity-60" />
              </div>
            )}
            {processing && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>

          {/* Scan error */}
          {scanError && (
            <div className="px-5 py-3 bg-red-50 border-t border-red-100 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />
              <p className="text-xs text-red-700">{scanError}</p>
            </div>
          )}

          {/* Scan result */}
          {scanResult && (
            <div className={`px-5 py-4 border-t ${
              scanResult.success ? "bg-emerald-50 border-emerald-100" :
              scanResult.alreadyCheckedIn ? "bg-amber-50 border-amber-100" :
              "bg-red-50 border-red-100"
            }`}>
              <div className="flex items-start gap-3">
                {scanResult.success ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                ) : scanResult.alreadyCheckedIn ? (
                  <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                ) : (
                  <X className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                )}
                <div className="flex-1 min-w-0">
                  {scanResult.user ? (
                    <>
                      <p className={`text-sm font-bold ${
                        scanResult.success ? "text-emerald-900" :
                        scanResult.alreadyCheckedIn ? "text-amber-900" : "text-red-900"
                      }`}>
                        {scanResult.success ? "Checked in!" :
                         scanResult.alreadyCheckedIn ? "Already checked in" :
                         scanResult.error}
                      </p>
                      <p className="text-xs font-semibold text-slate-700 mt-1">{scanResult.user.fullName}</p>
                      <p className="text-xs text-slate-500">{scanResult.user.email}</p>
                      {(scanResult.user.enrollmentNumber ?? scanResult.user.participantId) && (
                        <code className="text-[10px] font-mono text-slate-400 mt-0.5 block">
                          {scanResult.user.enrollmentNumber ?? scanResult.user.participantId}
                        </code>
                      )}
                      {scanResult.alreadyCheckedIn && scanResult.checkedInAt && (
                        <p className="text-xs text-amber-700 mt-0.5">
                          at {new Date(scanResult.checkedInAt).toLocaleTimeString()}
                        </p>
                      )}
                    </>
                  ) : (
                    <p className="text-sm font-semibold text-red-800">{scanResult.error}</p>
                  )}
                </div>
                <button
                  onClick={() => { setScanResult(null); lastScannedRef.current = ""; }}
                  className="shrink-0 text-slate-400 hover:text-slate-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Pending check-in */}
      {notCheckedIn.length > 0 && (
        <div className="space-y-2 animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <p className="text-xs font-medium text-slate-400">Pending check-in ({notCheckedIn.length})</p>
          {notCheckedIn.map((p) => (
            <div key={p._id} className="bg-white border border-slate-100 border-l-4 border-l-amber-300 rounded-xl px-4 py-3.5 flex items-center gap-3">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                p.role === "EXTERNAL_USER" ? "bg-amber-100 text-amber-700" : "bg-indigo-100 text-indigo-700"
              }`}>
                {(p.fullName ?? p.email)[0]?.toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900 truncate">{p.fullName ?? p.email}</p>
                <p className="text-xs text-slate-400 truncate">{p.email}</p>
                {manualErrors[p._id] && (
                  <p className="text-xs text-red-600 mt-0.5">{manualErrors[p._id]}</p>
                )}
              </div>
              {(p.enrollmentNumber ?? p.participantId) && (
                <code className="text-xs font-mono text-slate-400 shrink-0">{p.enrollmentNumber ?? p.participantId}</code>
              )}
              {manualSuccess[p._id] ? (
                <span className="text-xs font-medium text-emerald-600 flex items-center gap-1 shrink-0">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Done
                </span>
              ) : (
                <button
                  onClick={() => handleManualCheckin(p._id)}
                  disabled={manualLoading === p._id}
                  className="shrink-0 inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-medium transition-colors disabled:opacity-50"
                >
                  {manualLoading === p._id ? (
                    <div className="w-3.5 h-3.5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <UserCheck className="h-3.5 w-3.5" />
                  )}
                  Manual
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Checked in */}
      {checkedIn.length > 0 && (
        <div className="space-y-2 animate-slide-up" style={{ animationDelay: "0.12s" }}>
          <p className="text-xs font-medium text-slate-400">Checked in ({checkedIn.length})</p>
          {checkedIn.map((p) => (
            <div key={p._id} className="bg-white border border-slate-100 border-l-4 border-l-emerald-400 rounded-xl px-4 py-3.5 flex items-center gap-3">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                p.role === "EXTERNAL_USER" ? "bg-amber-100 text-amber-700" : "bg-indigo-100 text-indigo-700"
              }`}>
                {(p.fullName ?? p.email)[0]?.toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900 truncate">{p.fullName ?? p.email}</p>
                <p className="text-xs text-slate-400 truncate">{p.email}</p>
              </div>
              {(p.enrollmentNumber ?? p.participantId) && (
                <code className="text-xs font-mono text-slate-400 shrink-0">{p.enrollmentNumber ?? p.participantId}</code>
              )}
              <span className="text-xs font-medium text-emerald-600 flex items-center gap-1 shrink-0">
                <CheckCircle2 className="h-3.5 w-3.5" /> Checked in
              </span>
            </div>
          ))}
        </div>
      )}

      {participants.length === 0 && (
        <div className="rounded-2xl border-2 border-dashed border-slate-100 py-12 text-center animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <CheckSquare className="h-8 w-8 mx-auto mb-3 text-slate-200" />
          <p className="text-sm font-medium text-slate-500">No participants registered yet</p>
        </div>
      )}

    </div>
  );
}
