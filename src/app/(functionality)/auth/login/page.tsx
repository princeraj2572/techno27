"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v4";
import { Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useFetch from "@/hooks/use-fetch";
import { userLogin } from "@/features/users/user-actions";
import { AuthCard, AuthShell, Fare, INK } from "../auth-shell";

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
      if (!result) return; // useFetch already caught a real/unexpected error
      if (!result.success) {
        setServerError(result.error);
        return;
      }
      const role = result.user.role;
      if (role === "DEV_ADMIN") router.push("/dev");
      else if (role === "MANAGEMENT_ADMIN") router.push("/admin");
      else if (role === "EVENT_MANAGER") router.push("/event-manager");
      else router.push("/dashboard");
      router.refresh();
    } catch (err: unknown) {
      setServerError(err instanceof Error ? err.message : "Login failed");
    }
  };

  return (
    <AuthShell>
      <AuthCard tag="Welcome back" title="Sign in" aside={<Fare />}>
        {registered && (
          <div className="mb-3 flex items-center gap-2.5 border-2 bg-[#e3f2ef] px-3 py-2" style={{ borderColor: INK }}>
            <CheckCircle2 className="h-4 w-4 shrink-0 text-[#0e5b57]" />
            <p className="text-sm font-bold">Account created — sign in to continue.</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 lg:space-y-4">
          <div className="space-y-1">
            <Label htmlFor="email">Email address</Label>
            <Input id="email" type="email" placeholder="you@opju.ac.in" autoComplete="email" className="lg:h-12 lg:text-base" {...register("email")} />
            {errors.email && <p className="text-xs font-bold text-[#a1001a]">{errors.email.message}</p>}
          </div>

          <div className="space-y-1">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                autoComplete="current-password"
                className="pr-11 lg:h-12 lg:text-base"
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-black/50 transition-colors hover:text-black"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && <p className="text-xs font-bold text-[#a1001a]">{errors.password.message}</p>}
          </div>

          {serverError && (
            <div className="border-2 border-[#a1001a] bg-[#a1001a]/10 px-3 py-2">
              <p className="text-sm font-bold text-[#a1001a]">{serverError}</p>
            </div>
          )}

          <Button type="submit" className="w-full lg:h-14 lg:text-lg" disabled={loading === true}>
            {loading ? "Signing in…" : "Enter the fest"}
          </Button>
        </form>

        <div className="mt-3 flex justify-between gap-3 text-xs font-bold sm:text-sm lg:mt-4 lg:text-base">
          <Link href="/auth/forgot-password" className="text-[#0e5b57] underline underline-offset-4 hover:text-[#a33517]">Forgot password?</Link>
          <Link href="/auth/signup" className="text-[#a33517] underline underline-offset-4 hover:text-[#0e5b57]">No ticket? Sign up</Link>
        </div>
      </AuthCard>
    </AuthShell>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
