"use client";

import React, { useState } from "react";
import { Bell, Search, Calendar, CheckCircle2, MessageSquare, Phone, Mail, Pause, Play, Plus } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/navbar";

export default function RemindersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [reminders, setReminders] = useState([
    {
      id: "r1",
      patientName: "Muthu Krishnan",
      phone: "9840123456",
      medicineName: "Nitroglycerin 0.5mg",
      time: "08:00 AM",
      type: "WhatsApp",
      language: "Tamil",
      status: "Active"
    },
    {
      id: "r2",
      patientName: "Muthu Krishnan",
      phone: "9840123456",
      medicineName: "Metformin 500mg",
      time: "08:30 AM",
      type: "SMS",
      language: "Tamil",
      status: "Active"
    },
    {
      id: "r3",
      patientName: "Sunita Devi",
      phone: "9123456789",
      time: "09:00 PM",
      medicineName: "Paracetamol 650mg",
      type: "Voice Call",
      language: "Hindi",
      status: "Paused"
    }
  ]);

  const toggleStatus = (id: string) => {
    setReminders((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          return { ...r, status: r.status === "Active" ? "Paused" : "Active" };
        }
        return r;
      })
    );
  };

  const filteredReminders = reminders.filter(
    (r) =>
      r.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.medicineName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 w-full bg-slate-50/30 dark:bg-slate-950/10 min-h-screen pb-12 flex flex-col">
      <Navbar title="Medicine Reminders & Dispatches" />

      <div className="px-6 py-6 max-w-7xl mx-auto w-full flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search reminders by patient or drug..."
              className="w-full h-10 pl-9 pr-4 rounded-lg border border-card-border bg-muted/20 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
            />
          </div>
          <Button size="sm" className="gap-1.5 text-xs">
            <Plus className="h-4 w-4" /> Add Manual Reminder
          </Button>
        </div>

        {/* Reminders list */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReminders.map((r) => {
            const Icon = r.type === "WhatsApp" ? MessageSquare : r.type === "SMS" ? Mail : Phone;
            const colorClass =
              r.type === "WhatsApp"
                ? "bg-green-500/10 border-green-500/20 text-green-600"
                : r.type === "SMS"
                ? "bg-blue-500/10 border-blue-500/20 text-blue-600"
                : "bg-purple-500/10 border-purple-500/20 text-purple-600";

            return (
              <Card key={r.id} className="flex flex-col justify-between">
                <div>
                  <CardHeader className="flex flex-row items-center justify-between pb-3">
                    <div className="flex items-center gap-2">
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center border ${colorClass}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <CardTitle className="text-sm">{r.patientName}</CardTitle>
                        <CardDescription className="text-[10px]">{r.phone}</CardDescription>
                      </div>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase border ${
                        r.status === "Active"
                          ? "bg-green-500/10 border-green-500/20 text-green-600"
                          : "bg-yellow-500/10 border-yellow-500/20 text-yellow-600"
                      }`}
                    >
                      {r.status}
                    </span>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-2 text-xs font-semibold">
                    <div className="flex justify-between items-center py-1.5 border-b border-card-border/40">
                      <span className="text-muted-foreground">Medicine:</span>
                      <span>{r.medicineName}</span>
                    </div>
                    <div className="flex justify-between items-center py-1.5 border-b border-card-border/40">
                      <span className="text-muted-foreground">Dosage Time:</span>
                      <span>{r.time}</span>
                    </div>
                    <div className="flex justify-between items-center py-1.5 border-b border-card-border/40">
                      <span className="text-muted-foreground">Reminder Language:</span>
                      <span className="text-indigo-600 font-bold">{r.language}</span>
                    </div>
                  </CardContent>
                </div>

                <div className="p-4 border-t border-card-border/50 flex justify-end gap-2 mt-4">
                  <Button variant="outline" size="sm" className="gap-1 text-xs" onClick={() => toggleStatus(r.id)}>
                    {r.status === "Active" ? (
                      <>
                        <Pause className="h-3 w-3" /> Pause
                      </>
                    ) : (
                      <>
                        <Play className="h-3 w-3" /> Play
                      </>
                    )}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
