"use client";

import React, { useState, useEffect } from "react";
import { Activity, Languages, Clock, AlertTriangle, ShieldCheck, Heart, Sparkles, TrendingUp } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Navbar } from "@/components/layout/navbar";
import { AnalyticsCharts } from "@/components/dashboard/analytics-charts";

export default function AnalyticsPage() {
  const [metrics, setMetrics] = useState({
    totalConsultations: 248,
    activeEmergencies: 0,
    averageLatencyMs: 1180,
    languageDistribution: [
      { name: "Tamil", value: 45 },
      { name: "Hindi", value: 30 },
      { name: "Telugu", value: 15 },
      { name: "Kannada", value: 10 }
    ],
    dailyConsultations: [
      { date: "25 Jun", consultations: 12 },
      { date: "26 Jun", consultations: 19 },
      { date: "27 Jun", consultations: 15 },
      { date: "28 Jun", consultations: 22 },
      { date: "29 Jun", consultations: 30 },
      { date: "30 Jun", consultations: 25 },
      { date: "01 Jul", consultations: 34 }
    ]
  });

  return (
    <div className="flex-1 w-full bg-[#09090B] text-slate-100 min-h-screen pb-12 flex flex-col relative overflow-x-hidden font-sans">
      
      {/* BACKGROUND GLOWS */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[10%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-indigo-500/5 blur-[120px]" />
        <div className="absolute bottom-[20%] left-[-15%] w-[40vw] h-[40vw] rounded-full bg-primary/5 blur-[100px]" />
      </div>

      <Navbar title="MediLingua AI - Telemetry Analytics" />

      <div className="px-6 py-8 max-w-7xl mx-auto w-full flex flex-col gap-8 text-left">
        
        {/* HEADER AREA */}
        <div className="flex flex-col gap-1.5">
          <h2 className="text-xl font-bold font-outfit text-white">System Diagnostics & Logs</h2>
          <p className="text-[11px] text-slate-400 font-semibold">Monitor Bhashini latency, language usage distribution, and emergency counts.</p>
        </div>

        {/* 1. METRICS ROW */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="border border-white/5 bg-[#111827]/40 backdrop-blur-xl p-5 rounded-2xl flex flex-col gap-3">
            <div className="flex justify-between items-center text-slate-400">
              <span className="text-[10px] font-bold uppercase tracking-wider">Total Consults</span>
              <Activity className="h-4 w-4 text-indigo-400" />
            </div>
            <span className="text-2xl font-extrabold text-white">{metrics.totalConsultations}</span>
          </div>

          <div className="border border-white/5 bg-[#111827]/40 backdrop-blur-xl p-5 rounded-2xl flex flex-col gap-3">
            <div className="flex justify-between items-center text-slate-400">
              <span className="text-[10px] font-bold uppercase tracking-wider">Active Emergencies</span>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </div>
            <span className="text-2xl font-extrabold text-red-500">{metrics.activeEmergencies}</span>
          </div>

          <div className="border border-white/5 bg-[#111827]/40 backdrop-blur-xl p-5 rounded-2xl flex flex-col gap-3">
            <div className="flex justify-between items-center text-slate-400">
              <span className="text-[10px] font-bold uppercase tracking-wider">Inference Speed</span>
              <Clock className="h-4 w-4 text-primary" />
            </div>
            <span className="text-2xl font-extrabold text-white">{metrics.averageLatencyMs}ms</span>
          </div>

          <div className="border border-primary/20 bg-gradient-to-br from-primary/5 to-indigo-600/5 backdrop-blur-xl p-5 rounded-2xl flex flex-col gap-3">
            <div className="flex justify-between items-center text-primary">
              <span className="text-[10px] font-bold uppercase tracking-wider">Translation Success</span>
              <TrendingUp className="h-4 w-4 text-yellow-500" />
            </div>
            <span className="text-2xl font-extrabold text-white">99.8%</span>
          </div>
        </div>

        {/* 2. ANALYTICS CHARTS */}
        <div className="border border-white/5 bg-[#111827]/20 backdrop-blur-xl rounded-3xl p-6">
          <h3 className="text-sm font-bold font-outfit text-white mb-6">Language Trends & Core Metrics</h3>
          <AnalyticsCharts
            languageData={metrics.languageDistribution}
            dailyConsults={metrics.dailyConsultations}
          />
        </div>

      </div>

    </div>
  );
}
