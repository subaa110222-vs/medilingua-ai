"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Shield, Sparkles, Heart, Activity } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API request
    setTimeout(() => {
      setIsLoading(false);
      router.push("/dashboard");
    }, 1500);
  };

  const handleMockLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.push("/dashboard");
    }, 800);
  };

  return (
    <div className="flex-1 min-h-screen flex items-center justify-center p-6 bg-slate-50/30 dark:bg-slate-950/10">
      <Card className="w-full max-w-md shadow-2xl relative overflow-hidden">
        {/* Glow */}
        <div className="absolute -top-12 -right-12 h-32 w-32 bg-primary/10 rounded-full blur-2xl pointer-events-none" />

        <CardHeader className="text-center flex flex-col items-center gap-1">
          <Heart className="h-8 w-8 text-primary fill-primary/10 animate-pulse mb-2" />
          <CardTitle className="text-2xl font-bold tracking-tight">Clinician Portal</CardTitle>
          <CardDescription className="text-xs">
            Sign in to start live patient translations.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-xs font-bold text-muted-foreground">
                Hospital Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="doctor@hospital.gov.in"
                className="w-full h-10 px-3 rounded-lg border border-card-border bg-muted/20 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-xs font-bold text-muted-foreground">
                Security Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-10 px-3 rounded-lg border border-card-border bg-muted/20 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
              />
            </div>

            <Button type="submit" className="w-full mt-2" isLoading={isLoading}>
              Sign In
            </Button>
          </form>

          {/* Quick Demo Bypass for Hackathon Judges */}
          <div className="mt-4 pt-4 border-t border-card-border flex flex-col gap-2">
            <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-bold justify-center uppercase tracking-wide">
              <Sparkles className="h-3 w-3 text-yellow-500" />
              <span>Ideathon Sandbox Quick Access</span>
            </div>
            <Button
              variant="outline"
              className="w-full border-primary/20 hover:bg-primary/5 hover:text-primary text-xs"
              onClick={handleMockLogin}
              isLoading={isLoading}
            >
              Enter Sandbox (One-Click Demo Bypass)
            </Button>
          </div>

          <div className="mt-4 text-center text-xs text-muted-foreground">
            Don't have a clinician account?{" "}
            <Link href="/register" className="font-bold text-primary hover:underline">
              Register Hospital
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
