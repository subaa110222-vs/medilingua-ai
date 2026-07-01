"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { FileUp, Eye, Bell, ArrowRight, Activity, AlertTriangle, CheckCircle, Image as ImageIcon, Volume2, ShieldCheck, Sparkles } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/navbar";

function PrescriptionContent() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const consultId = params.id as string;
  const patientId = searchParams.get("patientId") || "p1";

  const [ocrFile, setOcrFile] = useState<File | null>(null);
  const [ocrPreview, setOcrPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Extracted drugs state
  const [medicines, setMedicines] = useState<Array<{ name: string; dosage: string; duration: string; translation: string }>>([]);
  const [hasScanned, setHasScanned] = useState(false);
  const [allergyAlert, setAllergyAlert] = useState<string | null>(null);

  // Patient profile (for allergy testing)
  const patientName = "Muthu Krishnan";
  const knownAllergies = ["Penicillin"];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setOcrFile(file);
      setOcrPreview(URL.createObjectURL(file));
      setHasScanned(false);
    }
  };

  const handleRunOCR = () => {
    if (!ocrFile) return;
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setHasScanned(true);

      // Mock OCR Response
      const parsedDrugs = [
        {
          name: "Amoxicillin 500mg",
          dosage: "1-0-1",
          duration: "5 days",
          translation: "காலையில் 1 மாத்திரை, இரவில் 1 மாத்திரை, உணவுக்கு பின் 5 நாட்களுக்கு"
        },
        {
          name: "Metformin 500mg",
          dosage: "0-0-1",
          duration: "30 days",
          translation: "இரவில் 1 மாத்திரை, உணவுக்கு பின் 30 நாட்களுக்கு"
        }
      ];

      setMedicines(parsedDrugs);

      // Evaluate allergy warnings against Patient profile
      const allergyTrigger = parsedDrugs.find(d => d.name.toLowerCase().includes("amoxicillin"));
      if (allergyTrigger) {
        setAllergyAlert(`DRUG ALLERGY WARNING: "${allergyTrigger.name}" is a penicillin class medication. Patient is highly sensitive to Penicillin.`);
      } else {
        setAllergyAlert(null);
      }

    }, 2000);
  };

  const handleConfirmPrescription = () => {
    alert("Prescription confirmed! Reminders have been scheduled and sent to patient via WhatsApp.");
    router.push("/dashboard");
  };

  return (
    <div className="flex-1 w-full bg-[#09090B] text-slate-100 min-h-screen pb-12 flex flex-col relative overflow-x-hidden font-sans">
      
      {/* BACKGROUND GLOWS */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[10%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-indigo-500/5 blur-[120px]" />
        <div className="absolute bottom-[20%] left-[-15%] w-[40vw] h-[40vw] rounded-full bg-primary/5 blur-[100px]" />
      </div>

      <Navbar title="Handwritten Prescription OCR Reader" />

      <div className="px-6 py-6 max-w-5xl mx-auto w-full flex flex-col gap-6 text-left">
        
        {/* HEADER INFORMATION */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-bold font-outfit text-white">Scan Prescription & Set Reminders</h2>
            <p className="text-[11px] text-slate-400 font-semibold">
              Upload prescription scans to extract drug timings, translate directives, and schedule alerts.
            </p>
          </div>
        </div>

        {/* SCANNER WORKSPACE GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* LEFT: FILE UPLOAD CONTAINER */}
          <div className="border border-white/5 bg-[#111827]/20 backdrop-blur-xl rounded-3xl p-6 flex flex-col gap-5 justify-between">
            <div className="flex flex-col gap-4">
              <h3 className="text-xs font-extrabold uppercase tracking-widest text-indigo-400">1. Upload Image</h3>
              
              {/* Drag and Drop Box */}
              <div className="border border-dashed border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center bg-slate-950/60 relative cursor-pointer min-h-[160px] text-center hover:bg-slate-950 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                {ocrPreview ? (
                  <div className="flex flex-col items-center gap-3">
                    <ImageIcon className="h-8 w-8 text-primary" />
                    <span className="text-xs font-bold text-white">{ocrFile?.name}</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    <FileUp className="h-8 w-8 text-slate-500" />
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-bold text-slate-300">Drag & drop or click to upload</span>
                      <span className="text-[10px] text-slate-500 font-semibold">Supports JPEG, PNG</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <Button
              disabled={!ocrFile || isLoading}
              onClick={handleRunOCR}
              className="w-full bg-gradient-to-tr from-primary to-indigo-600 hover:opacity-95 text-white font-bold text-xs py-3.5 rounded-xl border border-white/10 shadow-lg shadow-primary/10 flex items-center justify-center gap-2"
            >
              {isLoading ? "Analyzing Image with Vision AI..." : "Run AI Prescription Scanner"}
            </Button>
          </div>

          {/* RIGHT: EXTRACTED RESULTS & WARNINGS */}
          <div className="border border-white/5 bg-[#111827]/20 backdrop-blur-xl rounded-3xl p-6 flex flex-col justify-between gap-6">
            <div className="flex flex-col gap-4">
              <h3 className="text-xs font-extrabold uppercase tracking-widest text-indigo-400">2. Extracted Prescriptions</h3>

              {hasScanned ? (
                <div className="flex flex-col gap-3.5">
                  {/* Allergy Banner alert */}
                  {allergyAlert && (
                    <div className="flex gap-2 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold rounded-xl leading-relaxed animate-pulse">
                      <AlertTriangle className="h-4.5 w-4.5 shrink-0 mt-0.5" />
                      <span>{allergyAlert}</span>
                    </div>
                  )}

                  {medicines.map((med, idx) => (
                    <div key={idx} className="p-4 border border-white/5 rounded-xl bg-slate-950/60 flex flex-col gap-1.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-white">{med.name}</span>
                        <span className="text-[10px] text-slate-400">Dosage: {med.dosage} • {med.duration}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 italic">Directive: "{med.translation}"</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-16 border border-dashed border-white/5 rounded-2xl flex flex-col items-center justify-center text-slate-500 gap-2">
                  <Activity className="h-8 w-8 opacity-40" />
                  <span className="text-xs font-semibold">Await scan execution outputs.</span>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 border-t border-white/5 pt-4">
              <Button variant="ghost" onClick={() => router.back()} className="text-xs font-bold text-slate-400 hover:text-white">
                Cancel
              </Button>
              <Button
                disabled={medicines.length === 0}
                onClick={handleConfirmPrescription}
                className="bg-gradient-to-tr from-primary to-indigo-600 hover:opacity-95 text-white font-bold text-xs px-5 py-2.5 rounded-xl border border-white/10 shadow-lg shadow-primary/10 flex items-center gap-1.5"
              >
                Confirm & Send Alerts <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

export default function PrescriptionPage() {
  return (
    <Suspense fallback={
      <div className="flex-1 flex items-center justify-center bg-[#09090B] text-slate-400 min-h-screen">
        <span className="animate-pulse font-bold text-sm">Loading Prescription Workspace...</span>
      </div>
    }>
      <PrescriptionContent />
    </Suspense>
  );
}
