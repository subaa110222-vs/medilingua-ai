"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Languages,
  Activity,
  AlertTriangle,
  Clock,
  ArrowRight,
  UserPlus,
  Heart,
  Sparkles,
  ShieldCheck,
  Zap,
  Check,
  Siren,
  X,
  Compass,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/navbar";

export default function DoctorDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  // Patient Registration fields
  const [fullName, setFullName] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("Male");
  const [phone, setPhone] = useState("");
  const [primaryLang, setPrimaryLang] = useState("Tamil");
  const [allergies, setAllergies] = useState("");
  const [conditions, setConditions] = useState("");

  const mockPatients = [
    { id: "p1", name: "Muthu Krishnan", age: 62, gender: "Male", phone: "9840123456", language: "Tamil", allergies: ["Penicillin"] },
    { id: "p2", name: "Sunita Devi", age: 45, gender: "Female", phone: "9123456789", language: "Hindi", allergies: [] },
    { id: "p3", name: "Venkatesh Prasad", age: 53, gender: "Male", phone: "9440123456", language: "Telugu", allergies: ["Sulfonamide"] },
    { id: "p4", name: "Ananya Nair", age: 29, gender: "Female", phone: "9000123456", language: "Malayalam", allergies: [] },
  ];

  const filteredPatients = mockPatients.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.phone.includes(searchQuery)
  );

  const handleRegisterPatient = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Patient ${fullName} registered successfully!`);
    setIsRegisterOpen(false);
  };

  return (
    <div className="flex-1 w-full bg-[#09090B] text-slate-100 min-h-screen pb-12 flex flex-col relative overflow-x-hidden font-sans">
      
      {/* BACKGROUND GLOWS */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[5%] right-[-5%] w-[40vw] h-[40vw] rounded-full bg-indigo-500/5 blur-[120px]" />
        <div className="absolute bottom-[20%] left-[-5%] w-[45vw] h-[45vw] rounded-full bg-primary/5 blur-[130px]" />
      </div>

      <Navbar title="MediLingua AI - Clinician Workspace" />

      <div className="px-6 py-8 max-w-7xl mx-auto w-full flex flex-col gap-8">
        
        {/* GREETING HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex flex-col gap-1.5 text-left">
            <h1 className="text-3xl font-extrabold tracking-tight font-outfit text-white">
              Welcome back, Dr. Patel
            </h1>
            <p className="text-xs text-slate-400 font-semibold">
              Kancheepuram District Hospital • Sandbox Active
            </p>
          </div>
          
          <Button
            onClick={() => setIsRegisterOpen(true)}
            className="bg-gradient-to-tr from-primary to-indigo-600 hover:opacity-95 text-white font-bold text-xs px-5 py-2.5 rounded-xl border border-white/10 shadow-lg shadow-primary/10 gap-1.5"
          >
            <UserPlus className="h-4 w-4" /> Register New Patient
          </Button>
        </div>

        {/* 1. METRICS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            whileHover={{ y: -4 }}
            className="border border-white/5 bg-[#111827]/40 backdrop-blur-xl p-5 rounded-2xl flex flex-col gap-4 text-left shadow-lg"
          >
            <div className="flex justify-between items-center text-slate-400">
              <span className="text-[10px] font-bold uppercase tracking-wider">Total Consultations</span>
              <Activity className="h-4.5 w-4.5 text-indigo-400" />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-3xl font-extrabold font-outfit text-white">248</span>
              <span className="text-[10px] font-bold text-emerald-400">+14 completed today</span>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -4 }}
            className="border border-white/5 bg-[#111827]/40 backdrop-blur-xl p-5 rounded-2xl flex flex-col gap-4 text-left shadow-lg"
          >
            <div className="flex justify-between items-center text-slate-400">
              <span className="text-[10px] font-bold uppercase tracking-wider">Active Emergencies</span>
              <AlertTriangle className="h-4.5 w-4.5 text-red-500 animate-pulse" />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-3xl font-extrabold font-outfit text-red-500">0</span>
              <span className="text-[10px] font-bold text-slate-400">All alerts resolved</span>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -4 }}
            className="border border-white/5 bg-[#111827]/40 backdrop-blur-xl p-5 rounded-2xl flex flex-col gap-4 text-left shadow-lg"
          >
            <div className="flex justify-between items-center text-slate-400">
              <span className="text-[10px] font-bold uppercase tracking-wider">Average Latency</span>
              <Clock className="h-4.5 w-4.5 text-primary" />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-3xl font-extrabold font-outfit text-white">1.18s</span>
              <span className="text-[10px] font-bold text-emerald-400">Bhashini API connection stable</span>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -4 }}
            className="border border-primary/20 bg-gradient-to-br from-primary/5 to-indigo-600/5 backdrop-blur-xl p-5 rounded-2xl flex flex-col gap-4 text-left shadow-lg"
          >
            <div className="flex justify-between items-center text-primary">
              <span className="text-[10px] font-bold uppercase tracking-wider">System Mode</span>
              <Zap className="h-4.5 w-4.5 text-yellow-500 animate-pulse" />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-3xl font-extrabold font-outfit text-white">Cloud Active</span>
              <span className="text-[10px] font-bold text-slate-400">Local edge failover ready</span>
            </div>
          </motion.div>
        </div>

        {/* 2. MAIN LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT: PATIENT LOOKUP CONTAINER */}
          <div className="lg:col-span-2 border border-white/5 bg-[#111827]/20 backdrop-blur-xl rounded-3xl p-6 flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-left">
              <div className="flex flex-col gap-1">
                <h2 className="text-lg font-bold font-outfit text-white">Select Consultation Patient</h2>
                <p className="text-[11px] text-slate-400 font-semibold">Select a patient profile to begin voice translation</p>
              </div>
              
              {/* Search pill */}
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search by name or phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-xs font-semibold rounded-xl bg-slate-950/80 border border-white/5 text-white placeholder-slate-500 focus:outline-none focus:border-primary/45 transition-colors"
                />
              </div>
            </div>

            {/* Patients List Grid */}
            <div className="flex flex-col gap-3">
              {filteredPatients.length > 0 ? (
                filteredPatients.map((patient) => (
                  <motion.div
                    key={patient.id}
                    whileHover={{ scale: 1.01 }}
                    className="border border-white/5 bg-[#111827]/40 p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left"
                  >
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-2.5">
                        <span className="text-sm font-bold text-white">{patient.name}</span>
                        <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                          {patient.language}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-[11px] font-semibold text-slate-400">
                        <span>{patient.gender} • Age {patient.age}</span>
                        <span>Phone: {patient.phone}</span>
                      </div>
                      {patient.allergies.length > 0 && (
                        <div className="flex items-center gap-1.5 text-[10px] text-red-400 font-extrabold uppercase mt-1">
                          <AlertTriangle className="h-3.5 w-3.5" />
                          <span>Allergies: {patient.allergies.join(", ")}</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Launch consult trigger */}
                    <Link href={`/translate?patientId=${patient.id}&lang=${patient.language}`}>
                      <Button className="bg-[#111827] border border-white/10 hover:bg-slate-900 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 group">
                        Start Translation <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </motion.div>
                ))
              ) : (
                <div className="py-12 border border-dashed border-white/5 rounded-2xl flex flex-col items-center justify-center text-slate-500 gap-2">
                  <Search className="h-8 w-8 opacity-40" />
                  <span className="text-xs font-semibold">No patient profiles found matching query.</span>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: SYSTEM HEALTH & QUICK ACTIONS */}
          <div className="flex flex-col gap-8">
            {/* AI Assistant panel */}
            <div className="border border-white/5 bg-[#111827]/20 backdrop-blur-xl rounded-3xl p-6 flex flex-col gap-5 text-left">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <h3 className="text-sm font-bold font-outfit text-white">Co-Pilot Overview</h3>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-400 font-semibold">
                Bhashini API endpoint connectivity is certified secure. All speech model latencies meet clinical parameters for real-time consultation overlays.
              </p>
              
              <div className="flex flex-col gap-2.5 mt-2">
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/80 border border-white/5 text-[11px] font-semibold">
                  <span className="text-slate-400">Indic Voice Translation</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <ShieldCheck className="h-3.5 w-3.5" /> 200 OK
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/80 border border-white/5 text-[11px] font-semibold">
                  <span className="text-slate-400">Prescription OCR Scanner</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <ShieldCheck className="h-3.5 w-3.5" /> 200 OK
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="border border-white/5 bg-[#111827]/20 backdrop-blur-xl rounded-3xl p-6 flex flex-col gap-4 text-left">
              <h3 className="text-sm font-bold font-outfit text-white">Operational Diagnostics</h3>
              <div className="flex flex-col gap-2">
                <Link href="/reminders" className="w-full">
                  <Button variant="outline" className="w-full justify-start text-xs font-bold rounded-xl border-white/5 hover:bg-slate-900/60 bg-transparent text-slate-300">
                    🕒 Review Active Patient Reminders
                  </Button>
                </Link>
                <Link href="/emergency" className="w-full">
                  <Button variant="outline" className="w-full justify-start text-xs font-bold rounded-xl border-white/5 hover:bg-slate-900/60 bg-transparent text-slate-300">
                    🚨 View Hospital SOS Dispatch Panel
                  </Button>
                </Link>
                <Link href="/hospitals" className="w-full">
                  <Button variant="outline" className="w-full justify-start text-xs font-bold rounded-xl border-white/5 hover:bg-slate-900/60 bg-transparent text-slate-300">
                    🏥 Scan Nearby Proximity PHC Nodes
                  </Button>
                </Link>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* REGISTER PATIENT DIALOG MODAL */}
      <AnimatePresence>
        {isRegisterOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md border border-white/5 bg-[#111827] rounded-3xl p-6 shadow-2xl relative"
            >
              <button
                onClick={() => setIsRegisterOpen(false)}
                className="absolute right-4 top-4 text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
              
              <h3 className="text-lg font-bold font-outfit text-white text-left mb-6">Register Clinical Patient</h3>
              
              <form onSubmit={handleRegisterPatient} className="flex flex-col gap-4 text-left">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase text-slate-400">Full Name</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter full name..."
                    className="w-full px-4 py-2.5 text-xs font-semibold rounded-xl bg-slate-950 border border-white/5 text-white focus:outline-none focus:border-primary/45"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase text-slate-400">Date of Birth</label>
                    <input
                      type="date"
                      required
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      className="w-full px-4 py-2.5 text-xs font-semibold rounded-xl bg-slate-950 border border-white/5 text-white focus:outline-none focus:border-primary/45"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase text-slate-400">Gender</label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-full px-4 py-2.5 text-xs font-semibold rounded-xl bg-slate-950 border border-white/5 text-white focus:outline-none focus:border-primary/45"
                    >
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase text-slate-400">Phone Number</label>
                    <input
                      type="text"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. 9840123456"
                      className="w-full px-4 py-2.5 text-xs font-semibold rounded-xl bg-slate-950 border border-white/5 text-white focus:outline-none focus:border-primary/45"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold uppercase text-slate-400">Primary Language</label>
                    <select
                      value={primaryLang}
                      onChange={(e) => setPrimaryLang(e.target.value)}
                      className="w-full px-4 py-2.5 text-xs font-semibold rounded-xl bg-slate-950 border border-white/5 text-white focus:outline-none focus:border-primary/45"
                    >
                      <option>Tamil</option>
                      <option>Hindi</option>
                      <option>Telugu</option>
                      <option>Kannada</option>
                      <option>Malayalam</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase text-slate-400">Known Allergies (Comma separated)</label>
                  <input
                    type="text"
                    value={allergies}
                    onChange={(e) => setAllergies(e.target.value)}
                    placeholder="e.g. Penicillin, Sulfonamide"
                    className="w-full px-4 py-2.5 text-xs font-semibold rounded-xl bg-slate-950 border border-white/5 text-white focus:outline-none focus:border-primary/45"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase text-slate-400">Chronic Conditions</label>
                  <input
                    type="text"
                    value={conditions}
                    onChange={(e) => setConditions(e.target.value)}
                    placeholder="e.g. Hypertension, Diabetes"
                    className="w-full px-4 py-2.5 text-xs font-semibold rounded-xl bg-slate-950 border border-white/5 text-white focus:outline-none focus:border-primary/45"
                  />
                </div>

                <Button type="submit" className="bg-gradient-to-tr from-primary to-indigo-600 hover:opacity-95 text-white font-bold text-xs py-3 rounded-xl mt-4 border border-white/10 shadow-lg shadow-primary/10">
                  Submit Registration
                </Button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
