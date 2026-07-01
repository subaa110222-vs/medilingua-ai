"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { FileText, Save, ArrowRight, CheckCircle2, ChevronRight, Activity, ShieldCheck, Download, Sparkles } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/navbar";

function ConsultationContent() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const consultationId = params.id as string;
  const patientId = searchParams.get("patientId") || "p1";

  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Mock patient profile
  const patientData = {
    name: "Muthu Krishnan",
    age: 62,
    gender: "Male",
    primaryLang: "Tamil",
    allergies: ["Penicillin"],
  };

  // Mock generated SOAP
  const soapSummary = {
    subjective: "Patient presents with acute onset of severe substernal chest pain described as pressure or heaviness, lasting approximately 15 minutes. Pain radiates to the left shoulder and left arm. Denies nausea, sweating, or vomiting. Symptoms initiated while walking upstairs.",
    objective: "BP: 142/90 mmHg. Heart rate: 88 bpm. Respiratory rate: 16/min. Pulse oximetry: 96% on room air. Lungs clear to auscultation. Heart sounds regular rhythm, no murmurs.",
    assessment: "Stable Angina, primary diagnosis. Cardiac risk assessment: High. Secondary hypertension present. Patient has history of Type-2 diabetes and a noted Penicillin allergy.",
    plan: "1. Advise complete physical rest immediately. 2. Prescribe Nitroglycerin 0.5mg sublingual as needed for pain. 3. Refer urgently to Kancheepuram District General Hospital for ECG, cardiac markers, and cardiologist evaluation. 4. Continue existing medications for diabetes and hypertension. Avoid Penicillin class drugs."
  };

  const handleSaveConsultation = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSaved(true);
    }, 1500);
  };

  return (
    <div className="flex-1 w-full bg-[#09090B] text-slate-100 min-h-screen pb-12 flex flex-col relative overflow-x-hidden font-sans">
      
      {/* BACKGROUND GLOWS */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[10%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-indigo-500/5 blur-[120px]" />
        <div className="absolute bottom-[20%] left-[-15%] w-[40vw] h-[40vw] rounded-full bg-primary/5 blur-[100px]" />
      </div>

      <Navbar title="Consultation Summary & SOAP Notes" />

      <div className="px-6 py-6 max-w-5xl mx-auto w-full flex flex-col gap-6 text-left">
        
        {/* TOP STATUS CARD */}
        <div className="border border-white/5 bg-[#111827]/40 backdrop-blur-xl p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-lg">
          <div className="flex flex-col gap-1">
            <h2 className="text-md font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="h-4.5 w-4.5 text-emerald-400" /> Summary Compiled
            </h2>
            <p className="text-[10px] text-slate-400 font-semibold">
              Consultation ID: {consultationId} • Patient: {patientData.name}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              onClick={handleSaveConsultation}
              disabled={isSaved || isLoading}
              className="bg-[#111827] border border-white/10 hover:bg-slate-900 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5"
            >
              {isLoading ? "Saving..." : isSaved ? "Saved to EHR" : "Save to EHR"}
            </Button>
            
            <Link href={`/prescription/${consultationId}?patientId=${patientId}`}>
              <Button className="bg-gradient-to-tr from-primary to-indigo-600 hover:opacity-95 text-white font-bold text-xs px-4 py-2.5 rounded-xl border border-white/10 shadow-lg shadow-primary/10 flex items-center gap-1.5">
                Issue Prescription <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* MAIN SOAP BLOCKS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* SUBJECTIVE */}
          <div className="border border-white/5 bg-[#111827]/20 backdrop-blur-xl rounded-3xl p-6 flex flex-col gap-3">
            <div className="flex items-center gap-2 text-indigo-400">
              <Sparkles className="h-4.5 w-4.5" />
              <h3 className="text-xs font-bold uppercase tracking-widest">Subjective (S)</h3>
            </div>
            <p className="text-xs leading-relaxed text-slate-300 font-medium">
              {soapSummary.subjective}
            </p>
          </div>

          {/* OBJECTIVE */}
          <div className="border border-white/5 bg-[#111827]/20 backdrop-blur-xl rounded-3xl p-6 flex flex-col gap-3">
            <div className="flex items-center gap-2 text-primary">
              <Activity className="h-4.5 w-4.5" />
              <h3 className="text-xs font-bold uppercase tracking-widest">Objective (O)</h3>
            </div>
            <p className="text-xs leading-relaxed text-slate-300 font-medium">
              {soapSummary.objective}
            </p>
          </div>

          {/* ASSESSMENT */}
          <div className="border border-white/5 bg-[#111827]/20 backdrop-blur-xl rounded-3xl p-6 flex flex-col gap-3">
            <div className="flex items-center gap-2 text-rose-400">
              <ShieldCheck className="h-4.5 w-4.5" />
              <h3 className="text-xs font-bold uppercase tracking-widest">Assessment (A)</h3>
            </div>
            <p className="text-xs leading-relaxed text-slate-300 font-medium">
              {soapSummary.assessment}
            </p>
          </div>

          {/* PLAN */}
          <div className="border border-white/5 bg-[#111827]/20 backdrop-blur-xl rounded-3xl p-6 flex flex-col gap-3">
            <div className="flex items-center gap-2 text-emerald-400">
              <FileText className="h-4.5 w-4.5" />
              <h3 className="text-xs font-bold uppercase tracking-widest">Plan (P)</h3>
            </div>
            <p className="text-xs leading-relaxed text-slate-300 font-medium">
              {soapSummary.plan}
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}

export default function ConsultationPage() {
  return (
    <Suspense fallback={
      <div className="flex-1 flex items-center justify-center bg-[#09090B] text-slate-400 min-h-screen">
        <span className="animate-pulse font-bold text-sm">Loading Consultation Summary...</span>
      </div>
    }>
      <ConsultationContent />
    </Suspense>
  );
}
