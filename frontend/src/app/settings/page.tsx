"use client";

import React, { useState } from "react";
import { Settings, User, Languages, Volume2, Save, HardDrive } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/navbar";

export default function SettingsPage() {
  const [prefLang, setPrefLang] = useState("English");
  const [transLang, setTransLang] = useState("Tamil");
  const [offlineMode, setOfflineMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      alert("Settings saved successfully.");
    }, 1200);
  };

  return (
    <div className="flex-1 w-full bg-slate-50/30 dark:bg-slate-950/10 min-h-screen pb-12 flex flex-col">
      <Navbar title="Clinician Profile & System Settings" />

      <form onSubmit={handleSaveSettings} className="px-6 py-6 max-w-3xl mx-auto w-full flex flex-col gap-6">
        {/* Profile Settings Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <User className="h-4.5 w-4.5 text-primary" />
              Doctor Profile Details
            </CardTitle>
            <CardDescription className="text-[11px]">Edit clinical name tags and registrations.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
            <div className="flex flex-col gap-1.5">
              <label className="text-muted-foreground">Full Name</label>
              <input
                type="text"
                defaultValue="Dr. Rajesh Patel"
                className="w-full h-10 px-3 rounded-lg border border-card-border bg-muted/20 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-muted-foreground">Clinician Registration ID</label>
              <input
                type="text"
                defaultValue="MCI-42918"
                className="w-full h-10 px-3 rounded-lg border border-card-border bg-muted/20 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
              />
            </div>
          </CardContent>
        </Card>

        {/* Translation Preferences Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2 text-indigo-600">
              <Languages className="h-4.5 w-4.5" />
              Translation Preferences
            </CardTitle>
            <CardDescription className="text-[11px]">Configure default speaking and listening channels.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
            <div className="flex flex-col gap-1.5">
              <label className="text-muted-foreground">Your Primary Language</label>
              <select
                value={prefLang}
                onChange={(e) => setPrefLang(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-card-border bg-muted/20 text-sm focus:outline-none focus:ring-2"
              >
                <option value="English">English</option>
                <option value="Hindi">Hindi</option>
                <option value="Gujarati">Gujarati</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-muted-foreground">Default Translation Target</label>
              <select
                value={transLang}
                onChange={(e) => setTransLang(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-card-border bg-muted/20 text-sm focus:outline-none focus:ring-2"
              >
                <option value="Tamil">Tamil</option>
                <option value="Telugu">Telugu</option>
                <option value="Kannada">Kannada</option>
                <option value="Malayalam">Malayalam</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* System & Offline Modes */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2 text-violet-600">
              <HardDrive className="h-4.5 w-4.5" />
              Local Offline Operations
            </CardTitle>
            <CardDescription className="text-[11px]">Force database operations onto local offline edge boxes.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 text-xs font-semibold">
            <div className="flex items-center justify-between py-2 border-b border-card-border/40">
              <div>
                <p className="font-bold">Offline Sync Fallback Mode</p>
                <p className="text-[10px] text-muted-foreground font-semibold">Enable local model processing for disconnected clinics.</p>
              </div>
              <input
                type="checkbox"
                checked={offlineMode}
                onChange={(e) => setOfflineMode(e.target.checked)}
                className="h-5 w-5 rounded border-card-border accent-primary cursor-pointer"
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end mt-4">
          <Button type="submit" isLoading={isLoading} className="gap-1.5 font-bold shadow-md">
            <Save className="h-4 w-4" /> Save Preferences
          </Button>
        </div>
      </form>
    </div>
  );
}
