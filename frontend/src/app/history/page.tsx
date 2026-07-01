"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, History, Calendar, FileText, Heart, User, ClipboardList, ArrowRight, Activity, Sparkles, AlertTriangle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/navbar";

export default function HistoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedConsult, setSelectedConsult] = useState<string | null>("c1");

  const mockHistories = [
    {
      id: "c1",
      patientName: "Muthu Krishnan",
      phone: "9840123456",
      date: "01 Jul 2026",
      language: "Tamil",
      symptoms: "Chest pressure, left shoulder soreness",
      diagnosis: "Suspected stable angina / coronary risk",
      soap: {
        subjective: "Patient reports sudden tightness across the upper chest accompanied by mild pain radiating down the left arm. Began after walking up stairs.",
        objective: "BP 145/90 mmHg, Pulse 88 bpm. Heart sounds normal. No active dyspnea observed.",
        assessment: "Stable angina vs. sub-acute coronary event. Patient has positive history of Type-2 diabetes.",
        plan: "Refer to cardiologist for ECG and cardiac stress test. Prescribed Nitroglycerin 0.5mg sublingual as needed. Avoid physical exertion."
      }
    },
    {
      id: "c2",
      patientName: "Sunita Devi",
      phone: "9123456789",
      date: "28 Jun 2026",
      language: "Hindi",
      symptoms: "Persistent dry cough, mild fever",
      diagnosis: "Upper respiratory tract infection",
      soap: {
        subjective: "Patient reports tickling sensation in throat with persistent dry hacking cough for 4 days. Worse at night. Low-grade fever on day 2.",
        objective: "Temperature 99.1°F. Lungs clear to auscultation bilaterally. Throat mildly erythematous.",
        assessment: "Viral bronchitis / URTI.",
        plan: "Prescribe Dextromethorphan syrup 10ml thrice daily. Warm saline gargles. Retake review if fever persists > 3 days."
      }
    }
  ];

  const filteredHistory = mockHistories.filter(
    (h) =>
      h.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.phone.includes(searchQuery)
  );

  const selectedData = mockHistories.find((h) => h.id === selectedConsult);

  return (
    <div className="flex-1 w-full bg-[#09090B] text-slate-100 min-h-screen pb-12 flex flex-col relative overflow-x-hidden font-sans">
      
      {/* BACKGROUND GLOWS */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[10%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-indigo-500/5 blur-[120px]" />
        <div className="absolute bottom-[20%] left-[-15%] w-[40vw] h-[40vw] rounded-full bg-primary/5 blur-[100px]" />
      </div>

      <Navbar title="MediLingua AI - Clinical History Logs" />

      <div className="px-6 py-6 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT: CONSULTATION DIRECTORY FINDER */}
        <div className="lg:col-span-1 border border-white/5 bg-[#111827]/20 backdrop-blur-xl rounded-3xl p-5 flex flex-col gap-5 h-[580px] text-left">
          <div className="flex flex-col gap-1">
            <h3 className="text-sm font-bold font-outfit text-white">Patient Record Finder</h3>
            <p className="text-[10px] text-slate-400 font-semibold">Select a case file below to inspect generated SOAP transcripts.</p>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
            <input
              type="text"
              placeholder="Search by name or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs font-semibold rounded-xl bg-slate-950/80 border border-white/5 text-white placeholder-slate-500 focus:outline-none focus:border-primary/45 transition-colors"
            />
          </div>

          {/* Chronological list */}
          <div className="flex-1 overflow-y-auto flex flex-col gap-2.5 pr-1">
            {filteredHistory.map((item) => (
              <button
                key={item.id}
                onClick={() => setSelectedConsult(item.id)}
                className={`w-full p-4 rounded-xl border text-left flex flex-col gap-1.5 transition-all ${
                  selectedConsult === item.id
                    ? "bg-[#111827]/60 border-primary/45 shadow"
                    : "bg-slate-950/40 border-white/5 hover:bg-[#111827]/40"
                }`}
              >
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-white">{item.patientName}</span>
                  <span className="text-[9px] text-slate-500 font-bold">{item.date}</span>
                </div>
                <div className="flex justify-between items-center text-[10px] text-slate-400">
                  <span>Phone: {item.phone}</span>
                  <span className="font-bold text-indigo-400">{item.language}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT: SOAP DETAILS COMPILER SCREEN */}
        <div className="lg:col-span-2 flex flex-col gap-6 text-left">
          {selectedData ? (
            <div className="flex flex-col gap-6">
              
              {/* TOP HEADER PROFILE */}
              <div className="border border-white/5 bg-[#111827]/40 backdrop-blur-xl p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-md font-bold text-white">{selectedData.patientName}</span>
                  <span className="text-[10px] text-slate-400 font-semibold">
                    Primary symptoms: {selectedData.symptoms}
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                    {selectedData.language}
                  </span>
                  <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded bg-slate-950/80 border border-white/5 text-slate-400">
                    Case: {selectedData.id}
                  </span>
                </div>
              </div>

              {/* SOAP CARDS CONTAINER */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                {/* Subjective */}
                <div className="border border-white/5 bg-[#111827]/20 backdrop-blur-xl rounded-3xl p-5 flex flex-col gap-3">
                  <div className="flex items-center gap-2 text-indigo-400">
                    <Sparkles className="h-4 w-4" />
                    <span className="text-[10px] font-extrabold uppercase tracking-widest">Subjective (S)</span>
                  </div>
                  <p className="text-xs leading-relaxed text-slate-300">
                    {selectedData.soap.subjective}
                  </p>
                </div>

                {/* Objective */}
                <div className="border border-white/5 bg-[#111827]/20 backdrop-blur-xl rounded-3xl p-5 flex flex-col gap-3">
                  <div className="flex items-center gap-2 text-primary">
                    <Activity className="h-4 w-4" />
                    <span className="text-[10px] font-extrabold uppercase tracking-widest">Objective (O)</span>
                  </div>
                  <p className="text-xs leading-relaxed text-slate-300">
                    {selectedData.soap.objective}
                  </p>
                </div>

                {/* Assessment */}
                <div className="border border-white/5 bg-[#111827]/20 backdrop-blur-xl rounded-3xl p-5 flex flex-col gap-3">
                  <div className="flex items-center gap-2 text-rose-400">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="text-[10px] font-extrabold uppercase tracking-widest">Assessment (A)</span>
                  </div>
                  <p className="text-xs leading-relaxed text-slate-300">
                    {selectedData.soap.assessment}
                  </p>
                </div>

                {/* Plan */}
                <div className="border border-white/5 bg-[#111827]/20 backdrop-blur-xl rounded-3xl p-5 flex flex-col gap-3">
                  <div className="flex items-center gap-2 text-emerald-400">
                    <FileText className="h-4 w-4" />
                    <span className="text-[10px] font-extrabold uppercase tracking-widest">Plan (P)</span>
                  </div>
                  <p className="text-xs leading-relaxed text-slate-300">
                    {selectedData.soap.plan}
                  </p>
                </div>

              </div>

            </div>
          ) : (
            <div className="py-24 border border-dashed border-white/5 rounded-3xl flex flex-col items-center justify-center text-slate-500 gap-2">
              <History className="h-8 w-8 opacity-40" />
              <span className="text-xs font-semibold">Select a case file from the directory to review summaries.</span>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
