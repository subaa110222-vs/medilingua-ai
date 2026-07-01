"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertCircle, FileText, ArrowRight, ShieldAlert, Heart, Siren, Mic, MicOff, Volume2, ShieldCheck, Zap } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/navbar";
import { VoiceTranslator } from "@/components/translate/voice-translator";
import { RiskAlertPanel } from "@/components/translate/risk-alert-panel";

function TranslateContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const patientId = searchParams.get("patientId") || "p1";
  const initialLang = searchParams.get("lang") || "Tamil";

  const [activeSOS, setActiveSOS] = useState<string | null>(null);
  const [patientData, setPatientData] = useState({
    name: "Muthu Krishnan",
    age: 62,
    gender: "Male",
    phone: "9840123456",
    language: initialLang,
    allergies: ["Penicillin"],
    conditions: ["Hypertension", "Diabetes Type-2"],
  });

  const handleSOSTrigger = (keyword: string) => {
    setActiveSOS(keyword);
  };

  const handleEndConsultation = () => {
    // Generate mock consultation id
    const mockConsultationId = `c_${Date.now()}`;
    router.push(`/consultation/${mockConsultationId}?patientId=${patientId}`);
  };

  return (
    <div className="flex-1 w-full bg-[#09090B] text-slate-100 min-h-screen pb-12 flex flex-col relative overflow-x-hidden font-sans">
      
      {/* BACKGROUND HIGHLIGHTS */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-indigo-500/5 blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-primary/5 blur-[100px]" />
      </div>

      <Navbar title="Live Translation & Clinical Assistant" />

      {/* EMERGENCY SOS BANNER */}
      {activeSOS && (
        <div className="w-full bg-red-950/60 backdrop-blur-md border-b border-red-500/30 text-white py-3.5 px-6 flex items-center justify-between animate-pulse shadow-lg z-10">
          <div className="flex items-center gap-3">
            <Siren className="h-5 w-5 text-red-500" />
            <div className="flex flex-col text-left">
              <span className="text-xs font-extrabold uppercase tracking-widest text-red-400">Emergency Symptom Flagged!</span>
              <span className="text-[11px] text-slate-300 font-semibold">Critical keyword detected in dialogue logs: "{activeSOS}"</span>
            </div>
          </div>
          <Link href="/emergency">
            <Button size="sm" className="bg-red-600 hover:bg-red-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg border border-red-400/20 shadow-lg shadow-red-500/10">
              Acknowledge SOS
            </Button>
          </Link>
        </div>
      )}

      <div className="px-6 py-6 max-w-7xl mx-auto w-full flex flex-col gap-6">
        
        {/* TOP PROFILE BAR */}
        <div className="border border-white/5 bg-[#111827]/40 backdrop-blur-xl p-4 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-left shadow-lg">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white">Active Case: {patientData.name}</span>
              <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded bg-indigo-500/15 border border-indigo-500/25 text-indigo-400">
                {patientData.language} speaker
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-semibold">
              Age {patientData.age} • {patientData.gender} • Allergy Flag: {patientData.allergies.join(", ")}
            </p>
          </div>

          <Button
            onClick={handleEndConsultation}
            className="bg-gradient-to-tr from-primary to-indigo-600 hover:opacity-95 text-white font-bold text-xs px-5 py-2.5 rounded-xl border border-white/10 shadow-lg shadow-primary/10 gap-1.5"
          >
            End Consultation & Generate Summary <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        {/* WORKSPACE CONTENT GRID */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          
          {/* LEFT: AUDIO TRANSLATOR PANEL */}
          <div className="xl:col-span-2 flex flex-col gap-6">
            <VoiceTranslator
              consultationId="session_active"
              patientName={patientData.name}
              patientLanguage={patientData.language}
              doctorLanguage="English"
              onSOS={handleSOSTrigger}
            />
          </div>

          {/* RIGHT: RISK ALERT AND SIDE BAR */}
          <div className="xl:col-span-1 flex flex-col gap-6">
            <RiskAlertPanel
              allergies={patientData.allergies}
              pregnancyStatus={false}
              chronicConditions={patientData.conditions}
              detectedContraindications={activeSOS ? ["Cardiac Risk Warning: Acute Chest tightness flagged"] : []}
            />

            {/* Quick Consultation Timeline card */}
            <div className="border border-white/5 bg-[#111827]/20 backdrop-blur-xl rounded-3xl p-5 flex flex-col gap-4 text-left">
              <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-400">Clinical Timeline</h3>
              <div className="flex flex-col gap-3 relative pl-4 border-l border-white/5">
                <div className="flex flex-col gap-0.5 relative">
                  <span className="absolute -left-[20px] top-[4px] h-2 w-2 rounded-full bg-emerald-500" />
                  <span className="text-[10px] text-emerald-400 font-bold">14:02 - Patient Connected</span>
                  <span className="text-[10px] text-slate-400">Audio channel initialized in Tamil.</span>
                </div>
                <div className="flex flex-col gap-0.5 relative">
                  <span className="absolute -left-[20px] top-[4px] h-2 w-2 rounded-full bg-indigo-500" />
                  <span className="text-[10px] text-indigo-400 font-bold">14:03 - Clinical Vitals Synced</span>
                  <span className="text-[10px] text-slate-400">History file shows Penicillin allergy active.</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

export default function TranslatePage() {
  return (
    <Suspense fallback={
      <div className="flex-1 flex items-center justify-center bg-[#09090B] text-slate-400 min-h-screen">
        <span className="animate-pulse font-bold text-sm">Loading Translate Workspace...</span>
      </div>
    }>
      <TranslateContent />
    </Suspense>
  );
}
