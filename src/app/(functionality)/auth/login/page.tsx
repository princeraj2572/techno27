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
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
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
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 bg-background">
      <div className="w-full max-w-sm animate-slide-up">

        {/* Wordmark */}
        <div className="mb-8">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-1">
            Technorollix 2027
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-foreground leading-none">
            Sign in
          </h1>
        </div>

        {/* Registration success */}
        {registered && (
          <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg border border-green-200 bg-green-50 mb-4">
            <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
            <p className="text-sm font-medium text-green-800">
              Account created — sign in to continue.
            </p>
          </div>
        )}

        {/* Form card */}
        <Card className="shadow-none">
          <CardHeader className="pb-0 pt-5 px-5">
            <p className="text-sm text-muted-foreground">
              Enter your email and password to continue.
            </p>
          </CardHeader>
          <CardContent className="px-5 pt-4 pb-5">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@opju.ac.in"
                  autoComplete="email"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-xs text-destructive">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="/auth/forgot-password"
                    className="text-xs text-muted-foreground hover:text-primary transition-colors"
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
                    className="pr-10"
                    {...register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword
                      ? <EyeOff className="h-4 w-4" />
                      : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-destructive">{errors.password.message}</p>
                )}
              </div>

              {serverError && (
                <div className="px-3 py-2 rounded-lg bg-destructive/10 border border-destructive/20">
                  <p className="text-sm text-destructive">{serverError}</p>
                </div>
              )}

              <Button type="submit" className="w-full" disabled={loading === true}>
                {loading ? "Signing in…" : "Sign in"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Separator className="my-4" />

        <p className="text-center text-sm text-muted-foreground">
          New here?{" "}
          <Link href="/auth/signup" className="text-primary hover:underline font-medium">
            Create an account
          </Link>
        </p>
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
