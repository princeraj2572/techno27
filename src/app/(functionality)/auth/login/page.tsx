"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v4";
import { Eye, EyeOff, CheckCircle2, Zap, MapPin, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useFetch from "@/hooks/use-fetch";
import { userLogin } from "@/actions/user-actions";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginForm = z.infer<typeof loginSchema>;

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const registered = searchParams.get("registered") === "1";
  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });

  const { fn: login, loading } = useFetch(userLogin);

  const onSubmit = async (data: LoginForm) => {
    setServerError("");
    try {
      const result = await login(data);
      if (result) {
        const role = result.user.role;
        if (role === "DEV_ADMIN") router.push("/dev");
        else if (role === "MANAGEMENT_ADMIN") router.push("/admin");
        else if (role === "EVENT_MANAGER") router.push("/event-manager");
        else router.push("/dashboard");
        router.refresh();
      }
    } catch (err: unknown) {
      setServerError(err instanceof Error ? err.message : "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">

      {/* ── Left panel — branding ─────────────────────────── */}
      <div className="relative hidden md:flex md:w-[42%] lg:w-[45%] flex-col justify-between p-10 overflow-hidden bg-slate-900">

        {/* Background gradient blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-violet-600/20 blur-3xl" />
          <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-indigo-600/20 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-violet-800/10 blur-2xl" />
        </div>

        {/* Subtle dot grid */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.07]"
          style={{
            backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        {/* Top — Logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-xl bg-violet-500 flex items-center justify-center">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <span className="text-white font-bold text-sm tracking-wide">TECHNO-aiMBiAtion</span>
          </div>
        </div>

        {/* Center — Headline */}
        <div className="relative z-10 space-y-6">
          <div>
            <p className="text-violet-400 text-xs font-semibold uppercase tracking-[0.2em] mb-3">Annual Tech Fest</p>
            <h2 className="text-5xl font-black text-white leading-none tracking-tight">
              Techno-<br />
              <span className="text-violet-400">aiMBiAtion</span>
            </h2>
            <p className="text-6xl font-black text-white/10 leading-none mt-1 select-none">2027</p>
          </div>

          <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
            Competitions, workshops, and showcases — all in one place. Sign in to register, manage your team, and track everything.
          </p>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-slate-400 text-xs">
              <Calendar className="h-3.5 w-3.5 text-violet-400 shrink-0" />
              <span>27 – 28 February 2027</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400 text-xs">
              <MapPin className="h-3.5 w-3.5 text-violet-400 shrink-0" />
              <span>OP Jindal University, Raigarh</span>
            </div>
          </div>
        </div>

        {/* Bottom — Footer */}
        <div className="relative z-10">
          <p className="text-slate-600 text-xs">© 2027 Techno-aiMBiAtion · OPJU</p>
        </div>
      </div>

      {/* ── Right panel — form ────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 bg-white">

        {/* Mobile-only wordmark */}
        <div className="md:hidden flex items-center gap-2 mb-10">
          <div className="w-8 h-8 rounded-xl bg-violet-600 flex items-center justify-center">
            <Zap className="h-4 w-4 text-white" />
          </div>
          <span className="font-bold text-slate-900 text-sm tracking-wide">TECHNO-AMBIATION 2027</span>
        </div>

        <div className="w-full max-w-sm animate-slide-up">

          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Welcome back</h1>
            <p className="text-sm text-slate-500 mt-1">Sign in to your Techno-aiMBiAtion account</p>
          </div>

          {/* Registration success banner */}
          {registered && (
            <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl border border-emerald-200 bg-emerald-50 mb-6">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <p className="text-sm font-medium text-emerald-800">Account created — sign in to continue.</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

            {/* Email */}
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm font-medium text-slate-700">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@opju.ac.in"
                autoComplete="email"
                className="h-11 rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-xs text-red-600">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium text-slate-700">Password</Label>
                <Link
                  href="/auth/forgot-password"
                  className="text-xs text-violet-600 hover:text-violet-700 font-medium transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="h-11 pr-11 rounded-xl border-slate-200 bg-slate-50 focus:bg-white focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all"
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-600">{errors.password.message}</p>
              )}
            </div>

            {/* Server error */}
            {serverError && (
              <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200">
                <p className="text-sm text-red-700">{serverError}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading === true}
              className="w-full h-11 rounded-xl bg-violet-600 hover:bg-violet-700 active:bg-violet-800 text-white text-sm font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm shadow-violet-200"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in…
                </>
              ) : "Sign in"}
            </button>
          </form>

          {/* Divider + signup link */}
          <div className="mt-6 pt-6 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-500">
              New to Techno-aiMBiAtion?{" "}
              <Link href="/auth/signup" className="text-violet-600 hover:text-violet-700 font-semibold transition-colors">
                Create an account
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
