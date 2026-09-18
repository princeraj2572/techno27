"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v4";
import { Eye, EyeOff, CheckCircle2, Zap, Calendar, MapPin, Users, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useFetch from "@/hooks/use-fetch";
import { userLogin } from "@/actions/user-actions";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});
type LoginForm = z.infer<typeof loginSchema>;

function BrandPanel() {
  return (
    <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-slate-950 via-violet-950 to-slate-950 px-12 py-12 text-white relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-violet-600/10 -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-violet-500/10 translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-1">
          <Zap className="h-4 w-4 text-violet-400" />
          <span className="text-xs font-semibold text-violet-400 tracking-[0.2em] uppercase">Technorollix</span>
        </div>
        <p className="text-7xl font-black text-white tracking-tighter leading-none mt-2">2027</p>
      </div>

      <div className="relative z-10 space-y-8">
        <div>
          <p className="text-2xl font-bold text-white leading-snug">Where technology<br />meets innovation.</p>
          <p className="text-sm text-slate-400 mt-3 leading-relaxed">
            OPJU&apos;s annual tech fest bringing<br />the brightest minds across India.
          </p>
        </div>
        <div className="space-y-3">
          {[
            { icon: Calendar, text: "Feb 27–28, 2027" },
            { icon: MapPin,   text: "OPJU, Raigarh, Chhattisgarh" },
            { icon: Users,    text: "500+ participants expected" },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-violet-800/50 flex items-center justify-center shrink-0">
                <Icon className="h-3.5 w-3.5 text-violet-300" />
              </div>
              <span className="text-sm text-slate-300">{text}</span>
            </div>
          ))}
        </div>
      </div>

      <p className="relative z-10 text-xs text-slate-700">© 2027 OPJU Technorollix</p>
    </div>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const registered = searchParams.get("registered") === "1";
  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });
  const { fn: login, loading } = useFetch(userLogin);

  const onSubmit = async (data: LoginForm) => {
    setServerError("");
    try {
      const result = await login(data);
      if (result) {
        const role = result.user.role;
        if (role === "DEV_ADMIN")          router.push("/dev");
        else if (role === "MANAGEMENT_ADMIN") router.push("/admin");
        else if (role === "EVENT_MANAGER")    router.push("/event-manager");
        else                                  router.push("/dashboard");
        router.refresh();
      }
    } catch (err: unknown) {
      setServerError(err instanceof Error ? err.message : "Login failed");
    }
  };

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[5fr_7fr]">
      <BrandPanel />

      {/* Form side */}
      <div className="flex flex-col min-h-screen bg-white">
        {/* Mobile top bar */}
        <div className="flex items-center gap-2 px-6 py-5 border-b border-slate-100 lg:hidden">
          <Zap className="h-4 w-4 text-violet-600" />
          <span className="text-sm font-bold text-slate-900 tracking-tight">Technorollix 2027</span>
        </div>

        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-sm animate-slide-up">

            {/* Heading */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">Welcome back</h1>
              <p className="text-sm text-slate-500 mt-1">Sign in to your Technorollix account</p>
            </div>

            {/* Success banner */}
            {registered && (
              <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl border border-emerald-200 bg-emerald-50 mb-6">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <p className="text-sm font-medium text-emerald-800">Account created — sign in to continue.</p>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Email */}
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-sm font-medium text-slate-700">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@opju.ac.in"
                  autoComplete="email"
                  className="h-11 rounded-xl border-slate-200 bg-slate-50 focus:bg-white transition-colors"
                  {...register("email")}
                />
                {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-medium text-slate-700">Password</Label>
                  <Link href="/auth/forgot-password" className="text-xs text-violet-600 hover:text-violet-700 font-medium transition-colors">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    className="h-11 rounded-xl border-slate-200 bg-slate-50 focus:bg-white pr-11 transition-colors"
                    {...register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
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
                className="w-full h-11 rounded-xl bg-violet-600 hover:bg-violet-700 disabled:bg-violet-300 text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Signing in…
                  </span>
                ) : (
                  <>Sign in <ArrowRight className="h-4 w-4" /></>
                )}
              </button>
            </form>

            <p className="text-center text-sm text-slate-500 mt-6">
              New here?{" "}
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
