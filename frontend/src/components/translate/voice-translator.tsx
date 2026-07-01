"use client";

import React, { useState, useEffect } from "react";
import { Mic, MicOff, Volume2, ArrowLeftRight, Activity, AlertTriangle, ShieldCheck } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSpeech } from "@/hooks/use-speech";
import { useWebSocket, WebSocketMessage } from "@/hooks/use-websocket";

interface VoiceTranslatorProps {
  consultationId: string;
  patientName: string;
  patientLanguage: string;
  doctorLanguage: string;
  onSOS: (keyword: string) => void;
}

export function VoiceTranslator({
  consultationId,
  patientName,
  patientLanguage,
  doctorLanguage,
  onSOS,
}: VoiceTranslatorProps) {
  // Authentication mock key token
  const token = "mock-auth-token";
  const { isConnected, messages, sendAudioChunk, sendTextMessage } = useWebSocket(consultationId, token);
  const [activeSpeaker, setActiveSpeaker] = useState<"Patient" | "Doctor" | null>(null);
  const [localTranscript, setLocalTranscript] = useState<WebSocketMessage[]>([]);

  // Capture Audio streams
  const handleAudioData = (base64Audio: string) => {
    if (activeSpeaker) {
      sendAudioChunk(base64Audio, activeSpeaker);
    }
  };

  const { isRecording, volume, startRecording, stopRecording } = useSpeech(handleAudioData);

  // Handle speaker toggle
  const toggleRecording = (speaker: "Patient" | "Doctor") => {
    if (isRecording) {
      stopRecording();
      setActiveSpeaker(null);
    } else {
      setActiveSpeaker(speaker);
      startRecording();
    }
  };

  // Sync messages from WebSocket into local transcript logs
  useEffect(() => {
    if (messages.length > 0) {
      const latestMsg = messages[messages.length - 1];
      setLocalTranscript((prev) => [...prev, latestMsg]);

      // If emergency keyword is detected, notify parent page
      if (latestMsg.is_emergency && latestMsg.text) {
        onSOS(latestMsg.text);
      }

      // Automatically play translated voice if audio URL is present
      if (latestMsg.audio_url) {
        const audio = new Audio(latestMsg.audio_url);
        audio.play().catch((err) => console.log("Audio autoplay prevented:", err));
      }
    }
  }, [messages, onSOS]);

  // Mocking translation output if websocket is not connected (standalone sandbox preview)
  const simulateTranslation = (speaker: "Patient" | "Doctor", text: string) => {
    const isPatient = speaker === "Patient";
    const originalText = text;
    const translatedText = isPatient
      ? "Doctor, I have severe pain in my chest radiating to my left arm."
      : "மார்பு வலி எப்போது தொடங்கியது? வாந்தி எடுத்தீர்களா?"; // "When did chest pain start? Did you vomit?"
    
    const mockMsg: WebSocketMessage = {
      type: "translation",
      sender: speaker,
      text: originalText,
      translated_text: translatedText,
      is_risk_detected: isPatient,
      is_emergency: isPatient && text.toLowerCase().includes("chest"),
      risk_details: isPatient
        ? { severity: "CRITICAL", warning: "Cardiac Emergency: Chest pain radiating to left arm." }
        : undefined,
    };

    setLocalTranscript((prev) => [...prev, mockMsg]);
    if (mockMsg.is_emergency) {
      onSOS("Chest pain radiating to left arm");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* 1. Live Translation logs */}
      <Card className="lg:col-span-2 flex flex-col h-[600px]">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-md flex items-center gap-2">
            <Activity className="h-4 w-4 text-primary animate-pulse" />
            Live Conversation Transcript
          </CardTitle>
          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground bg-muted px-3 py-1 rounded-full border border-card-border">
            <span>{patientLanguage}</span>
            <ArrowLeftRight className="h-3.5 w-3.5" />
            <span>{doctorLanguage}</span>
          </div>
        </CardHeader>

        <CardContent className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
          {localTranscript.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-2">
              <LanguagesIcon className="h-10 w-10 text-muted-foreground/40" />
              <p className="text-sm">Click a microphone below to start speaking.</p>
            </div>
          ) : (
            localTranscript.map((msg, idx) => {
              const isPatient = msg.sender === "Patient";
              return (
                <div
                  key={idx}
                  className={`flex flex-col max-w-[80%] rounded-2xl p-4 shadow-sm ${
                    isPatient
                      ? "self-start bg-indigo-500/10 border border-indigo-500/10 text-foreground"
                      : "self-end bg-primary/5 border border-primary/5 text-foreground"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1 gap-4">
                    <span className={`text-[10px] font-extrabold uppercase tracking-wide ${isPatient ? "text-indigo-600" : "text-primary"}`}>
                      {isPatient ? patientName : "Doctor (You)"}
                    </span>
                    {msg.audio_url && (
                      <Button variant="ghost" size="icon" className="h-5 w-5">
                        <Volume2 className="h-3.5 w-3.5 text-muted-foreground" />
                      </Button>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground italic mb-1">"{msg.text || "Speaking..."}"</p>
                  <p className="text-sm font-semibold">{msg.translated_text || "Translating..."}</p>

                  {/* Medical entity details alert */}
                  {msg.is_risk_detected && msg.risk_details && (
                    <div className="mt-2 p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 flex items-start gap-1.5 text-xs font-semibold">
                      <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                      <span>{msg.risk_details.warning}</span>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </CardContent>

        {/* 2. Recording Dashboard Actions */}
        <div className="p-4 border-t border-card-border flex items-center justify-around bg-muted/20">
          {/* Patient Recording Button */}
          <div className="flex flex-col items-center gap-1.5">
            <span className="text-[11px] font-bold text-muted-foreground">Patient ({patientLanguage})</span>
            <Button
              variant={activeSpeaker === "Patient" ? "default" : "outline"}
              size="icon"
              className={`h-14 w-14 rounded-full shadow-lg ${
                activeSpeaker === "Patient" && isRecording ? "bg-indigo-600 hover:bg-indigo-700 animate-pulse" : ""
              }`}
              onClick={() => toggleRecording("Patient")}
            >
              {activeSpeaker === "Patient" && isRecording ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
            </Button>
            {activeSpeaker === "Patient" && isRecording && (
              <span className="text-[10px] text-indigo-600 font-bold">Listening...</span>
            )}
          </div>

          {/* Standalone simulation widget */}
          <div className="hidden sm:flex flex-col gap-1 items-center">
            <Button
              variant="outline"
              size="sm"
              className="text-[10px]"
              onClick={() => simulateTranslation("Patient", "எனக்கு நெஞ்சு வலி அதிகமாக உள்ளது")}
            >
              Simulate Patient (Tamil)
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-[10px]"
              onClick={() => simulateTranslation("Doctor", "When did the chest pain start?")}
            >
              Simulate Doctor (English)
            </Button>
          </div>

          {/* Doctor Recording Button */}
          <div className="flex flex-col items-center gap-1.5">
            <span className="text-[11px] font-bold text-muted-foreground">Doctor ({doctorLanguage})</span>
            <Button
              variant={activeSpeaker === "Doctor" ? "default" : "outline"}
              size="icon"
              className={`h-14 w-14 rounded-full shadow-lg ${
                activeSpeaker === "Doctor" && isRecording ? "bg-primary hover:bg-primary/95 animate-pulse" : ""
              }`}
              onClick={() => toggleRecording("Doctor")}
            >
              {activeSpeaker === "Doctor" && isRecording ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
            </Button>
            {activeSpeaker === "Doctor" && isRecording && (
              <span className="text-[10px] text-primary font-bold">Listening...</span>
            )}
          </div>
        </div>
      </Card>

      {/* 3. Live AI Copilot Dashboard */}
      <div className="flex flex-col gap-6">
        <Card className="flex-1">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2 text-indigo-600">
              <ShieldCheck className="h-4.5 w-4.5" />
              Live AI Risk Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 text-xs font-semibold">
            <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-600">
              No known allergies detected in doctor responses.
            </div>

            <div className="p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-600 flex flex-col gap-1">
              <span className="font-bold">Active Indicators Check:</span>
              <span>Patient reports chest pain. Cross-checking history for hypertension...</span>
            </div>

            <div className="border border-card-border p-3 rounded-xl flex flex-col gap-1.5">
              <span className="text-[11px] font-extrabold uppercase text-muted-foreground">Clinical Entities Recognized</span>
              <div className="flex flex-wrap gap-1">
                <span className="px-2 py-0.5 bg-muted rounded-full border border-card-border text-[10px]">Chest pain (Symptom)</span>
                <span className="px-2 py-0.5 bg-muted rounded-full border border-card-border text-[10px]">Left arm pain (Symptom)</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function LanguagesIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m5 8 6 6" />
      <path d="m4 14 6-6 2-3" />
      <path d="M2 5h12" />
      <path d="M7 2h1" />
      <path d="m22 22-5-10-5 10" />
      <path d="M14 18h6" />
    </svg>
  );
}
