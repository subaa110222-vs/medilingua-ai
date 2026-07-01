"use client";

import React, { useState } from "react";
import { MapPin, Phone, Shield, Search, ArrowRight, ExternalLink, Activity, Zap } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/navbar";

export default function HospitalsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const mockHospitals = [
    {
      id: "h1",
      name: "Kancheepuram Government General Hospital",
      type: "District Hospital",
      address: "General Hospital Road, Kancheepuram, Tamil Nadu 631501",
      phone: "+91 44 2722 2444",
      distance: "2.4 km"
    },
    {
      id: "h2",
      name: "Arogya Primary Health Centre (PHC)",
      type: "PHC",
      address: "Bazaar Street, Damal Village, Kancheepuram, Tamil Nadu 631502",
      phone: "+91 44 2729 1100",
      distance: "8.1 km"
    },
    {
      id: "h3",
      name: "Chengalpattu Medical College Hospital",
      type: "Medical College Hospital",
      address: "GST Road, Chengalpattu, Tamil Nadu 603001",
      phone: "+91 44 2742 2222",
      distance: "22.5 km"
    }
  ];

  const filteredHospitals = mockHospitals.filter((h) =>
    h.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 w-full bg-[#09090B] text-slate-100 min-h-screen pb-12 flex flex-col relative overflow-x-hidden font-sans">
      
      {/* BACKGROUND GLOWS */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[10%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-indigo-500/5 blur-[120px]" />
        <div className="absolute bottom-[20%] left-[-15%] w-[40vw] h-[40vw] rounded-full bg-primary/5 blur-[100px]" />
      </div>

      <Navbar title="Hospital Locator & SOS Routing" />

      <div className="px-6 py-6 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-8 text-left">
        
        {/* LEFT: HOSPITAL LIST & FILTERS */}
        <div className="lg:col-span-1 flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <h2 className="text-lg font-bold font-outfit text-white">Nearby Clinics</h2>
            <p className="text-[11px] text-slate-400 font-semibold">Monitor diagnostic capacity and route SOS coordinates to local medical nodes.</p>
          </div>

          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search nearby hospitals/PHCs..."
              className="w-full pl-10 pr-4 py-2.5 text-xs font-semibold rounded-xl bg-[#111827]/40 border border-white/5 text-white placeholder-slate-500 focus:outline-none focus:border-primary/45 transition-colors"
            />
          </div>

          <div className="flex flex-col gap-3">
            {filteredHospitals.map((hospital) => (
              <div
                key={hospital.id}
                className="border border-white/5 bg-[#111827]/20 backdrop-blur-xl p-5 rounded-2xl flex flex-col gap-3"
              >
                <div className="flex justify-between items-start gap-2">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-bold text-white leading-relaxed">{hospital.name}</span>
                    <span className="text-[9px] font-extrabold uppercase text-slate-500">{hospital.type}</span>
                  </div>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 shrink-0">
                    {hospital.distance}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-[10px] text-slate-400 font-semibold mt-1">
                  <MapPin className="h-3.5 w-3.5 shrink-0" />
                  <span>{hospital.address}</span>
                </div>

                <div className="flex items-center gap-2 text-[10px] text-slate-400 font-semibold">
                  <Phone className="h-3.5 w-3.5 shrink-0" />
                  <span>{hospital.phone}</span>
                </div>

                <div className="flex gap-2.5 border-t border-white/5 pt-3 mt-1">
                  <Button variant="outline" className="flex-1 text-[10px] font-bold rounded-xl border-white/5 hover:bg-slate-900 bg-transparent text-slate-300 gap-1">
                    <Phone className="h-3 w-3" /> Call Node
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: MAP VISUALIZATION CONTAINER */}
        <div className="lg:col-span-2 border border-white/5 bg-[#111827]/20 backdrop-blur-xl rounded-3xl p-6 flex flex-col justify-between h-[580px]">
          <div className="flex flex-col gap-1">
            <h3 className="text-sm font-bold font-outfit text-white">Visual Proximity Radar Map</h3>
            <p className="text-[10px] text-slate-400 font-semibold">Interactive map representing nearby secondary and tertiary healthcare facilities.</p>
          </div>

          {/* Simulated Map Canvas */}
          <div className="flex-1 border border-white/5 bg-slate-950/60 rounded-2xl my-4 relative overflow-hidden flex items-center justify-center">
            {/* Background grid */}
            <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:14px_24px]" />
            
            {/* Center hospital beacon */}
            <div className="relative z-10 flex flex-col items-center gap-2">
              <div className="h-10 w-10 rounded-full bg-primary/20 border border-primary/45 flex items-center justify-center text-primary animate-pulse">
                <MapPin className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-bold text-white">Kancheepuram General Hospital</span>
              <span className="text-[9px] text-slate-500 font-semibold">Active Coordinates: 12.9716° N, 77.5946° E</span>
            </div>
            
            {/* Sub beacons */}
            <div className="absolute top-[20%] left-[30%] opacity-40 flex flex-col items-center gap-1">
              <MapPin className="h-4 w-4 text-indigo-400" />
              <span className="text-[8px] text-slate-500 font-bold">PHC Damal</span>
            </div>
            
            <div className="absolute bottom-[30%] right-[25%] opacity-40 flex flex-col items-center gap-1">
              <MapPin className="h-4 w-4 text-violet-400" />
              <span className="text-[8px] text-slate-500 font-bold">Chengalpattu Hospital</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 border-t border-white/5 pt-4">
            <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <Shield className="h-3.5 w-3.5" /> GPS tracking calibrated
            </span>
            <span>Last refresh: Just now</span>
          </div>
        </div>

      </div>

    </div>
  );
}
