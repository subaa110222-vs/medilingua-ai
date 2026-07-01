"use client";

import React, { useState } from "react";
import { Siren, AlertTriangle, ShieldAlert, Heart, Calendar, Phone, CheckCircle, Search, Zap } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/navbar";

export default function EmergencyPage() {
  const [alerts, setAlerts] = useState([
    {
      id: "e1",
      patientName: "Muthu Krishnan",
      age: 62,
      keyword: "Chest pain radiating to left arm",
      phc: "PHC Kancheepuram",
      status: "Triggered",
      time: "06:53 PM",
      contact: "9840123456"
    },
    {
      id: "e2",
      patientName: "Venkatesh Prasad",
      age: 53,
      keyword: "Breathing difficulty / respiratory lock",
      phc: "PHC Damal Village",
      status: "Dispatched",
      time: "04:12 PM",
      contact: "9440123456"
    }
  ]);

  const handleAcknowledge = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => {
        if (a.id === id) {
          return { ...a, status: a.status === "Triggered" ? "Dispatched" : "Resolved" };
        }
        return a;
      })
    );
  };

  return (
    <div className="flex-1 w-full bg-[#09090B] text-slate-100 min-h-screen pb-12 flex flex-col relative overflow-x-hidden font-sans">
      
      {/* BACKGROUND GLOWS */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[10%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-red-500/5 blur-[120px]" />
        <div className="absolute bottom-[20%] left-[-15%] w-[40vw] h-[40vw] rounded-full bg-primary/5 blur-[100px]" />
      </div>

      <Navbar title="Emergency Alert Control Tower" />

      <div className="px-6 py-6 max-w-7xl mx-auto w-full flex flex-col gap-8 text-left">
        
        {/* HEADER AREA */}
        <div className="flex flex-col gap-1.5">
          <h2 className="text-xl font-bold font-outfit text-white">Live SOS Monitor</h2>
          <p className="text-[11px] text-slate-400 font-semibold">Monitor critical symptom alarms and orchestrate emergency dispatch sequences.</p>
        </div>

        {/* 1. STATISTICS ROW */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border border-red-500/20 bg-red-500/5 p-5 rounded-2xl flex items-center justify-between shadow-lg">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest">Active SOS Warnings</span>
              <span className="text-3xl font-extrabold text-red-500 font-outfit">
                {alerts.filter(a => a.status === "Triggered").length}
              </span>
            </div>
            <Siren className="h-10 w-10 text-red-500 animate-pulse" />
          </div>

          <div className="border border-white/5 bg-[#111827]/40 backdrop-blur-xl p-5 rounded-2xl flex items-center justify-between shadow-lg">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">En Route (Dispatched)</span>
              <span className="text-3xl font-extrabold text-white font-outfit">
                {alerts.filter(a => a.status === "Dispatched").length}
              </span>
            </div>
            <ShieldAlert className="h-10 w-10 text-indigo-400" />
          </div>

          <div className="border border-white/5 bg-[#111827]/40 backdrop-blur-xl p-5 rounded-2xl flex items-center justify-between shadow-lg">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Resolved Alerts Today</span>
              <span className="text-3xl font-extrabold text-white font-outfit">
                {alerts.filter(a => a.status === "Resolved").length + 4}
              </span>
            </div>
            <CheckCircle className="h-10 w-10 text-emerald-400" />
          </div>
        </div>

        {/* 2. ALERTS LIST */}
        <div className="border border-white/5 bg-[#111827]/20 backdrop-blur-xl rounded-3xl p-6 flex flex-col gap-5">
          <h3 className="text-sm font-bold font-outfit text-white">Active Symptom Flag Log</h3>
          
          <div className="flex flex-col gap-4">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`border p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors ${
                  alert.status === "Triggered"
                    ? "bg-red-500/5 border-red-500/20"
                    : alert.status === "Dispatched"
                    ? "bg-[#111827]/40 border-indigo-500/20"
                    : "bg-[#111827]/20 border-white/5 opacity-60"
                }`}
              >
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-white">{alert.patientName}</span>
                    <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded ${
                      alert.status === "Triggered"
                        ? "bg-red-500/10 text-red-400 border border-red-500/20"
                        : alert.status === "Dispatched"
                        ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                        : "bg-slate-950 text-slate-500 border border-white/5"
                    }`}>
                      {alert.status}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-[11px] font-semibold text-slate-400">
                    <span>{alert.phc}</span>
                    <span>Contact: {alert.contact}</span>
                    <span>Time: {alert.time}</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-[10px] text-red-400 font-extrabold uppercase mt-1">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    <span>Keyword: "{alert.keyword}"</span>
                  </div>
                </div>

                {alert.status !== "Resolved" && (
                  <Button
                    onClick={() => handleAcknowledge(alert.id)}
                    className={`font-bold text-xs px-4 py-2.5 rounded-xl border ${
                      alert.status === "Triggered"
                        ? "bg-gradient-to-tr from-red-600 to-rose-700 hover:opacity-95 text-white border-red-500/20"
                        : "bg-[#111827] border-white/10 hover:bg-slate-900 text-white"
                    }`}
                  >
                    {alert.status === "Triggered" ? "Dispatch Ambulance" : "Mark as Resolved"}
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
