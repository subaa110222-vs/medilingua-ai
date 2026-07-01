"use client";

import React, { useState } from "react";
import { ShieldCheck, HardDrive, Cpu, Terminal, Key, Database, RefreshCw } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/navbar";

export default function AdminPage() {
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSyncEdge = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      alert("Local edge databases successfully synchronized with primary Supabase cloud instance.");
    }, 2000);
  };

  return (
    <div className="flex-1 w-full bg-slate-50/30 dark:bg-slate-950/10 min-h-screen pb-12 flex flex-col">
      <Navbar title="Hospital Admin Console" />

      <div className="px-6 py-6 max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Edge Server Management */}
        <Card className="flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <HardDrive className="h-4.5 w-4.5 text-primary" />
              Local Edge Server Configuration
            </CardTitle>
            <CardDescription className="text-[11px]">
              Monitor offline edge mini-PCs running local quantized translation models.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 text-xs font-semibold">
            <div className="flex justify-between items-center py-2 border-b border-card-border/40">
              <span className="text-muted-foreground">Edge Connection State:</span>
              <span className="text-green-600 font-bold flex items-center gap-1">
                <span className="h-2 w-2 bg-green-500 rounded-full animate-ping" />
                Active
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-card-border/40">
              <span className="text-muted-foreground">Active Model Instance:</span>
              <span>Llama-3-8B-Quantized (ONNX)</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-card-border/40">
              <span className="text-muted-foreground">Local storage cache:</span>
              <span>1.84 GB used (12% capacity)</span>
            </div>
          </CardContent>
          <div className="p-4 border-t border-card-border/50 flex justify-end">
            <Button size="sm" onClick={handleSyncEdge} isLoading={isSyncing} className="gap-1 text-xs">
              <RefreshCw className="h-3 w-3" /> Sync Edge Database
            </Button>
          </div>
        </Card>

        {/* API Quota configuration */}
        <Card className="flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2 text-indigo-600">
              <Key className="h-4.5 w-4.5" />
              Model Tokens & Quota Budgets
            </CardTitle>
            <CardDescription className="text-[11px]">
              Set API cost limits and credentials for cloud services.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 text-xs font-semibold">
            <div className="flex justify-between items-center py-2 border-b border-card-border/40">
              <span className="text-muted-foreground">Bhashini API quota:</span>
              <span className="text-foreground">84% remaining (423k characters)</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-card-border/40">
              <span className="text-muted-foreground">Groq Whisper Calls:</span>
              <span>18,249 completed</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-card-border/40">
              <span className="text-muted-foreground">Monthly LLM Cost:</span>
              <span className="text-green-600 font-bold">$14.28 USD</span>
            </div>
          </CardContent>
          <div className="p-4 border-t border-card-border/50 flex justify-end">
            <Button variant="outline" size="sm">
              Configure Keys
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
