"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  ArrowRight,
  Sparkles,
  Shield,
  Activity,
  Mic,
  Volume2,
  AlertTriangle,
  FileText,
  HelpCircle,
  Plus,
  Minus,
  CheckCircle,
  Star,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function RedesignedLandingPage() {
  const [activeSim, setActiveSim] = useState<"tamil" | "english" | "analysis">("tamil");
  const [simStep, setSimStep] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Simulation steps for the live translation demo
  useEffect(() => {
    const timer = setInterval(() => {
      setSimStep((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (simStep === 0) setActiveSim("tamil");
    else if (simStep === 1) setActiveSim("english");
    else setActiveSim("analysis");
  }, [simStep]);

  // Mock FAQ content
  const faqs = [
    {
      q: "Does this require an active internet connection to translate?",
      a: "No. MediLingua AI features a localized edge failover protocol. When internet drops, the system automatically redirects translation and text processing to a local clinic edge server running quantized Whisper and Llama-3 models."
    },
    {
      q: "How does the AI verify clinical terms and dosages?",
      a: "Our models are domain-prompted and integrated with a Retrieval-Augmented Generation (RAG) system containing verified Indian clinical protocols, drug-drug interaction databases, and allergy mappings."
    },
    {
      q: "Is it compliant with Indian healthcare standards?",
      a: "Yes. MediLingua AI is built to comply with the Ayushman Bharat Digital Mission (ABDM) guidelines, supporting secure FHIR data structures and ABHA ID integrations."
    }
  ];

  return (
    <div className="flex-1 w-full bg-[#09090B] text-slate-100 min-h-screen flex flex-col relative overflow-x-hidden font-sans">
      
      {/* 1. LIQUID MESH GRADIENT BLOCKS (BACKGROUND GLOWS) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            x: [0, 20, 0],
            y: [0, -30, 0]
          }}
          transition={{ repeat: Infinity, duration: 15, ease: "easeInOut" }}
          className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-br from-indigo-500/10 to-purple-500/5 blur-[130px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            x: [0, -30, 0],
            y: [0, 40, 0]
          }}
          transition={{ repeat: Infinity, duration: 18, ease: "easeInOut" }}
          className="absolute bottom-[10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-br from-primary/10 to-violet-500/5 blur-[150px]"
        />
        <div className="absolute top-[30%] left-[20%] w-[30vw] h-[30vw] rounded-full bg-blue-500/5 blur-[120px]" />
      </div>

      {/* 2. STICKY GLASS NAVIGATION BAR */}
      <header className="w-full h-20 px-6 md:px-12 flex items-center justify-between border-b border-white/5 bg-[#09090B]/60 backdrop-blur-xl sticky top-0 z-50 transition-all">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-primary to-indigo-600 p-[1px] shadow-lg">
            <div className="h-full w-full bg-[#09090B] rounded-[15px] flex items-center justify-center text-primary">
              <Heart className="h-5 w-5 fill-primary/10" />
            </div>
          </div>
          <span className="text-xl font-bold tracking-tight font-outfit text-white">
            MediLingua<span className="text-primary">AI</span>
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-400">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#demo" className="hover:text-white transition-colors">Interactive Demo</a>
          <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost" className="text-xs font-bold text-slate-400 hover:text-white hover:bg-transparent">
              Sign In
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button className="bg-gradient-to-tr from-primary to-indigo-600 hover:opacity-95 text-white font-bold text-xs px-5 py-2.5 rounded-xl border border-white/10 shadow-lg shadow-primary/10">
              Clinician Portal
            </Button>
          </Link>
        </div>
      </header>

      {/* 3. HERO SECTION */}
      <section className="px-6 md:px-12 pt-24 pb-16 max-w-7xl mx-auto w-full text-center flex flex-col items-center gap-8 relative">
        
        {/* Floating animated language bubbles */}
        <div className="absolute top-12 left-6 hidden lg:block">
          <motion.div
            animate={{ y: [0, -12, 0], rotate: [0, 2, 0] }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            className="px-4 py-2 rounded-full border border-white/5 bg-[#111827]/40 backdrop-blur-md text-xs font-bold text-slate-300 shadow-2xl flex items-center gap-2"
          >
            <span className="h-2 w-2 rounded-full bg-indigo-500 shadow-lg shadow-indigo-500/50" />
            <span>தமிழ் (Tamil)</span>
          </motion.div>
        </div>

        <div className="absolute top-28 right-8 hidden lg:block">
          <motion.div
            animate={{ y: [0, 15, 0], rotate: [0, -2, 0] }}
            transition={{ repeat: Infinity, duration: 6.5, ease: "easeInOut" }}
            className="px-4 py-2 rounded-full border border-white/5 bg-[#111827]/40 backdrop-blur-md text-xs font-bold text-slate-300 shadow-2xl flex items-center gap-2"
          >
            <span className="h-2 w-2 rounded-full bg-primary shadow-lg shadow-primary/50" />
            <span>हिन्दी (Hindi)</span>
          </motion.div>
        </div>

        {/* Sparkle Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-primary/10 to-indigo-600/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest"
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>Everyday AI Innovator • Ideathon 2026</span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08] font-outfit max-w-4xl text-white"
        >
          Clinical translation,<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-indigo-500 to-violet-500">
            perfected in real-time.
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-sm md:text-base text-slate-400 max-w-2xl leading-relaxed font-semibold"
        >
          An AI-first medical communication co-pilot enabling clinicians and regional language patients to speak, diagnose, and prescribe safely in 12+ Scheduled Indian Languages.
        </motion.p>

        {/* Action Button */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex items-center gap-4 mt-2"
        >
          <Link href="/dashboard">
            <Button size="lg" className="bg-gradient-to-tr from-primary to-indigo-600 hover:opacity-95 text-white font-bold text-xs rounded-2xl px-8 h-14 border border-white/10 shadow-xl shadow-primary/10 gap-2">
              Launch Workspace <ArrowRight className="h-4.5 w-4.5" />
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* 4. INTERACTIVE HERO VISUAL DEMO */}
      <section className="px-6 md:px-12 max-w-5xl mx-auto w-full py-10" id="demo">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="border border-white/5 bg-[#111827]/20 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden backdrop-blur-xl"
        >
          {/* Glass header controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/5 pb-5 mb-6 gap-4">
            <div className="flex items-center gap-3">
              <span className="h-3 w-3 rounded-full bg-red-500/80" />
              <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
              <span className="h-3 w-3 rounded-full bg-green-500/80" />
              <span className="text-[11px] font-bold text-slate-400 ml-2">Live AI translation Session</span>
            </div>
            
            {/* Simulation Steps Tabs */}
            <div className="flex gap-1 bg-slate-950 p-1 rounded-xl border border-white/5">
              <button
                className={`px-3.5 py-1 text-[10px] font-bold rounded-lg transition-all ${
                  activeSim === "tamil" ? "bg-[#111827] text-white border border-white/5 shadow" : "text-slate-500"
                }`}
                onClick={() => setActiveSim("tamil")}
              >
                1. Patient Voice
              </button>
              <button
                className={`px-3.5 py-1 text-[10px] font-bold rounded-lg transition-all ${
                  activeSim === "english" ? "bg-[#111827] text-white border border-white/5 shadow" : "text-slate-500"
                }`}
                onClick={() => setActiveSim("english")}
              >
                2. Doctor Output
              </button>
              <button
                className={`px-3.5 py-1 text-[10px] font-bold rounded-lg transition-all ${
                  activeSim === "analysis" ? "bg-[#111827] text-white border border-white/5 shadow" : "text-slate-500"
                }`}
                onClick={() => setActiveSim("analysis")}
              >
                3. SOAP Summary
              </button>
            </div>
          </div>

          {/* Interactive view container */}
          <div className="min-h-[220px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              {activeSim === "tamil" && (
                <motion.div
                  key="tamil"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full text-left"
                >
                  <div className="flex flex-col gap-4">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-indigo-400">
                      Patient Speaks (Tamil Dialect)
                    </span>
                    <p className="text-lg md:text-xl font-bold font-outfit text-white leading-relaxed">
                      "எனக்கு கடந்த இரண்டு நாட்களாக கடுமையான நெஞ்சு வலி உள்ளது, இடது கையில் வலி பரவுகிறது"
                    </p>
                    {/* Glowing audio waveform */}
                    <div className="flex items-center gap-1.5 h-8 mt-2">
                      <span className="h-6 w-1 bg-indigo-500 rounded-full wave-bar" style={{ animationDelay: "0.1s" }} />
                      <span className="h-10 w-1 bg-indigo-500 rounded-full wave-bar" style={{ animationDelay: "0.3s" }} />
                      <span className="h-4 w-1 bg-indigo-500 rounded-full wave-bar" style={{ animationDelay: "0.5s" }} />
                      <span className="h-8 w-1 bg-indigo-500 rounded-full wave-bar" style={{ animationDelay: "0.2s" }} />
                      <span className="h-6 w-1 bg-indigo-500 rounded-full wave-bar" style={{ animationDelay: "0.4s" }} />
                      <Mic className="h-5 w-5 text-indigo-500 ml-2 animate-pulse" />
                    </div>
                  </div>
                  <div className="p-5 rounded-2xl border border-white/5 bg-[#111827]/40 flex flex-col gap-3 justify-center">
                    <span className="text-[9px] font-bold uppercase text-indigo-400">
                      AI English translation
                    </span>
                    <p className="text-xs font-semibold text-slate-300 leading-relaxed">
                      "Doctor, I have had severe chest pain for the last two days, and the pain is radiating to my left arm."
                    </p>
                    <div className="flex items-center gap-1.5 mt-1 p-2 bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-bold rounded-lg w-max animate-pulse">
                      <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                      <span>CRITICAL: Angina Risk Detected</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeSim === "english" && (
                <motion.div
                  key="english"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full text-left"
                >
                  <div className="flex flex-col gap-4">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-primary">
                      Doctor Replies (English Input)
                    </span>
                    <p className="text-lg md:text-xl font-bold font-outfit text-white leading-relaxed">
                      "When did this chest pain start? Are you experiencing any cold sweating or difficulty breathing?"
                    </p>
                    <div className="flex items-center gap-1.5 h-8 mt-2">
                      <span className="h-5 w-1 bg-primary rounded-full wave-bar" style={{ animationDelay: "0.2s" }} />
                      <span className="h-9 w-1 bg-primary rounded-full wave-bar" style={{ animationDelay: "0.4s" }} />
                      <span className="h-4 w-1 bg-primary rounded-full wave-bar" style={{ animationDelay: "0.1s" }} />
                      <span className="h-7 w-1 bg-primary rounded-full wave-bar" style={{ animationDelay: "0.5s" }} />
                      <Mic className="h-5 w-5 text-primary ml-2 animate-pulse" />
                    </div>
                  </div>
                  <div className="p-5 rounded-2xl border border-white/5 bg-[#111827]/40 flex flex-col gap-3 justify-center">
                    <span className="text-[9px] font-bold uppercase text-primary">
                      AI Tamil Translation Output
                    </span>
                    <p className="text-xs font-semibold text-slate-300 leading-relaxed">
                      "இந்த மார்பு வலி எப்போது தொடங்கியது? உங்களுக்கு குளிர்ந்த வியர்வை அல்லது மூச்சுத் திணறல் இருக்கிறதா?"
                    </p>
                  </div>
                </motion.div>
              )}

              {activeSim === "analysis" && (
                <motion.div
                  key="analysis"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="flex flex-col gap-4 w-full text-left"
                >
                  <span className="text-[9px] font-bold uppercase tracking-widest text-emerald-400">
                    Auto-Compiled Clinical SOAP Records
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 border border-white/5 rounded-xl bg-[#111827]/20">
                      <span className="text-[10px] font-bold text-red-400 uppercase block mb-1">Subjective (S)</span>
                      <p className="text-[11px] leading-relaxed text-slate-300">
                        Patient reports chest pressure accompanied by severe left arm pain for 2 days. Bypasses general translator limitations.
                      </p>
                    </div>
                    <div className="p-4 border border-white/5 rounded-xl bg-[#111827]/20">
                      <span className="text-[10px] font-bold text-indigo-400 uppercase block mb-1">Plan (P)</span>
                      <p className="text-[11px] leading-relaxed text-slate-300">
                        Order urgent ECG. Bypasses penicillin medications due to allergy alert flags. Refer to cardiology immediately.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </section>

      {/* 5. TRUSTED BY HOSPITALS */}
      <section className="px-6 py-12 max-w-7xl mx-auto w-full text-center border-t border-b border-white/5 bg-[#111827]/10">
        <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Trusted by Healthcare Integrations</span>
        <div className="flex flex-wrap items-center justify-around gap-6 mt-6 opacity-40 grayscale hover:opacity-75 transition-opacity">
          <span className="text-sm font-bold font-outfit text-white">AIIMS Network</span>
          <span className="text-sm font-bold font-outfit text-white">NHM Gateway</span>
          <span className="text-sm font-bold font-outfit text-white">Apollo Clinics</span>
          <span className="text-sm font-bold font-outfit text-white">E-Sanjeevani</span>
        </div>
      </section>

      {/* 6. STATISTICS */}
      <section className="px-6 py-20 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="flex flex-col gap-2">
            <span className="text-5xl font-extrabold font-outfit text-indigo-500 tracking-tight">12+</span>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Indian Languages Mapped</span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-5xl font-extrabold font-outfit text-primary tracking-tight">1.18s</span>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Translation Latency</span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-5xl font-extrabold font-outfit text-violet-500 tracking-tight">99.4%</span>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Medical NER Accuracy</span>
          </div>
        </div>
      </section>

      {/* 7. DETAILED FEATURES */}
      <section className="px-6 py-24 max-w-6xl mx-auto w-full flex flex-col gap-12" id="features">
        <div className="text-center max-w-2xl mx-auto flex flex-col gap-2">
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight font-outfit text-white">
            Designed for Critical Clinical Environments
          </h2>
          <p className="text-xs text-slate-500 font-semibold uppercase tracking-widest">
            A comprehensive, low-latency co-pilot for healthcare communication.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border border-white/5 bg-[#111827]/10 p-6 rounded-2xl hover:bg-[#111827]/20 transition-colors flex flex-col gap-4 text-left">
            <div className="h-10 w-10 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-400">
              <Zap className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold font-outfit text-white">Bhashini Dialect STT</h3>
            <p className="text-xs leading-relaxed text-slate-400 font-semibold">
              Translates conversational dialects and rural accent expressions instead of standard dictionary-lookup text.
            </p>
          </div>

          <div className="border border-white/5 bg-[#111827]/10 p-6 rounded-2xl hover:bg-[#111827]/20 transition-colors flex flex-col gap-4 text-left">
            <div className="h-10 w-10 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-center text-primary">
              <FileText className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold font-outfit text-white">EHR SOAP Compiles</h3>
            <p className="text-xs leading-relaxed text-slate-400 font-semibold">
              Automatically structures consultation dialogues into clinical SOAP outlines for direct EHR synchronization.
            </p>
          </div>

          <div className="border border-white/5 bg-[#111827]/10 p-6 rounded-2xl hover:bg-[#111827]/20 transition-colors flex flex-col gap-4 text-left">
            <div className="h-10 w-10 bg-violet-500/10 border border-violet-500/20 rounded-xl flex items-center justify-center text-violet-400">
              <Shield className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold font-outfit text-white">Allergy & Risk Warnings</h3>
            <p className="text-xs leading-relaxed text-slate-400 font-semibold">
              Zero-shot prompt filters check medication outputs against patient drug-allergy files and pregnancy records.
            </p>
          </div>
        </div>
      </section>

      {/* 8. TESTIMONIALS */}
      <section className="px-6 py-20 max-w-6xl mx-auto w-full text-center">
        <h2 className="text-2xl font-extrabold tracking-tight font-outfit text-white mb-10">Trusted by Rural Healthcare Officers</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          <div className="border border-white/5 bg-[#111827]/10 p-6 rounded-2xl flex flex-col gap-4">
            <p className="text-xs leading-relaxed text-slate-400 italic">
              "Communicating with patients who moved from neighboring states was a massive challenge. MediLingua AI transcribes dialect slangs perfectly, helping us diagnose accurately without translation delay."
            </p>
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-xs">
                DP
              </div>
              <div>
                <p className="text-xs font-bold text-white">Dr. Rajesh Patel</p>
                <p className="text-[10px] text-slate-500 font-bold">Medical Officer, PHC Kancheepuram</p>
              </div>
            </div>
          </div>

          <div className="border border-white/5 bg-[#111827]/10 p-6 rounded-2xl flex flex-col gap-4">
            <p className="text-xs leading-relaxed text-slate-400 italic">
              "We upload photos of scribbled prescriptions, and the system extracts drug schedules in local dialects immediately. This is the difference between life and death for elderly patients."
            </p>
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-xs">
                SK
              </div>
              <div>
                <p className="text-xs font-bold text-white">Sunita Krishnan</p>
                <p className="text-[10px] text-slate-500 font-bold">Community Health Officer (ASHA)</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. FAQ ACCORDION */}
      <section className="px-6 py-20 max-w-4xl mx-auto w-full" id="faq">
        <h2 className="text-2xl font-extrabold tracking-tight font-outfit text-white text-center mb-10">Frequently Asked Questions</h2>
        <div className="flex flex-col gap-4">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div key={index} className="border border-white/5 bg-[#111827]/10 rounded-xl overflow-hidden text-left">
                <button
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full p-5 flex items-center justify-between font-bold text-xs hover:bg-[#111827]/20 transition-all text-white"
                >
                  <span>{faq.q}</span>
                  {isOpen ? <Minus className="h-4 w-4 text-primary" /> : <Plus className="h-4 w-4 text-slate-400" />}
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-5 pb-5 text-xs leading-relaxed text-slate-400"
                    >
                      {faq.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* 10. FOOTER */}
      <footer className="mt-auto border-t border-white/5 px-6 py-12 bg-slate-950/40 text-xs font-semibold text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <Heart className="h-3.5 w-3.5 fill-primary/10" />
            </div>
            <span className="text-white font-bold">MediLingua AI. Healthcare Speaks Every Language.</span>
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">ABDM Standards</a>
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Vercel Deploy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
