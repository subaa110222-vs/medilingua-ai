"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldCheck, Heart, Sparkles } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function RegisterPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Doctor");
  const [hospital, setHospital] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API registration
    setTimeout(() => {
      setIsLoading(false);
      router.push("/dashboard");
    }, 1500);
  };

  const handleMockRegister = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.push("/dashboard");
    }, 800);
  };

  return (
    <div className="flex-1 min-h-screen flex items-center justify-center p-6 bg-slate-50/30 dark:bg-slate-950/10">
      <Card className="w-full max-w-lg shadow-2xl relative overflow-hidden">
        {/* Glow */}
        <div className="absolute -top-12 -right-12 h-32 w-32 bg-primary/10 rounded-full blur-2xl pointer-events-none" />

        <CardHeader className="text-center flex flex-col items-center gap-1">
          <Heart className="h-8 w-8 text-primary fill-primary/10 animate-pulse mb-2" />
          <CardTitle className="text-2xl font-bold tracking-tight">Clinician Registration</CardTitle>
          <CardDescription className="text-xs">
            Join MediLingua AI to bridge communication gaps in your hospital.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleRegister} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="firstName" className="text-xs font-bold text-muted-foreground">
                First Name
              </label>
              <input
                id="firstName"
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Dr. Rajesh"
                className="w-full h-10 px-3 rounded-lg border border-card-border bg-muted/20 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="lastName" className="text-xs font-bold text-muted-foreground">
                Last Name
              </label>
              <input
                id="lastName"
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Patel"
                className="w-full h-10 px-3 rounded-lg border border-card-border bg-muted/20 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
              />
            </div>

            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label htmlFor="email" className="text-xs font-bold text-muted-foreground">
                Hospital Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="rajesh.patel@hospital.gov.in"
                className="w-full h-10 px-3 rounded-lg border border-card-border bg-muted/20 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="role" className="text-xs font-bold text-muted-foreground">
                Clinician Role
              </label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-card-border bg-muted/20 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
              >
                <option value="Doctor">Medical Officer / Doctor</option>
                <option value="Nurse">Staff Nurse</option>
                <option value="Rural Health Worker">ASHA / Rural Health Worker</option>
                <option value="Pharmacist">Pharmacist</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="hospital" className="text-xs font-bold text-muted-foreground">
                Primary Health Center
              </label>
              <input
                id="hospital"
                type="text"
                required
                value={hospital}
                onChange={(e) => setHospital(e.target.value)}
                placeholder="PHC Kancheepuram"
                className="w-full h-10 px-3 rounded-lg border border-card-border bg-muted/20 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
              />
            </div>

            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label htmlFor="password" className="text-xs font-bold text-muted-foreground">
                Create Password
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

            <div className="sm:col-span-2 mt-2">
              <Button type="submit" className="w-full" isLoading={isLoading}>
                Create Clinician Profile
              </Button>
            </div>
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
              onClick={handleMockRegister}
              isLoading={isLoading}
            >
              Enter Sandbox (One-Click Demo Bypass)
            </Button>
          </div>

          <div className="mt-4 text-center text-xs text-muted-foreground">
            Already registered?{" "}
            <Link href="/login" className="font-bold text-primary hover:underline">
              Clinician Sign In
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
