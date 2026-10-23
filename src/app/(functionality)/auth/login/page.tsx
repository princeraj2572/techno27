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
import { AuthCard, AuthShell } from "../auth-shell";

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
      <AuthCard tag="Welcome back" title="Sign In" description="Techno-aiMBiAtion 2027" maxWidth="max-w-md">
        {registered && (
          <div className="mb-5 flex items-center gap-2.5 border-2 border-black bg-[#f5c928]/40 px-4 py-3">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-[#1a0505]" />
            <p className="text-sm font-bold">Account created — sign in to continue.</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">Email address</Label>
            <Input id="email" type="email" placeholder="you@opju.ac.in" autoComplete="email" {...register("email")} />
            {errors.email && <p className="text-xs font-bold text-[#a1001a]">{errors.email.message}</p>}
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link href="/auth/forgot-password" className="text-xs font-bold text-[#a1001a] underline underline-offset-4 hover:text-[#ff6a00]">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                autoComplete="current-password"
                className="pr-11"
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

          <Button type="submit" className="w-full" disabled={loading === true}>
            {loading ? "Signing in…" : "Sign in"}
          </Button>
        </form>

        <p className="mt-5 border-t-2 border-dashed border-black/30 pt-4 text-center text-sm text-muted-foreground">
          New to Techno-aiMBiAtion?{" "}
          <Link href="/auth/signup" className="font-bold text-[#a1001a] underline underline-offset-4 hover:text-[#ff6a00]">
            Create an account
          </Link>
        </p>
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
