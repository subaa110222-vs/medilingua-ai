"use client";

import React from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend } from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface AnalyticsChartsProps {
  languageData?: Array<{ name: string; value: number }>;
  dailyConsults?: Array<{ date: string; consultations: number }>;
}

const COLORS = ["#FF4554", "#6366F1", "#8B5CF6", "#10B981", "#F59E0B", "#EC4899"];

export function AnalyticsCharts({
  languageData = [
    { name: "Tamil", value: 45 },
    { name: "Hindi", value: 30 },
    { name: "Telugu", value: 15 },
    { name: "Kannada", value: 10 },
  ],
  dailyConsults = [
    { date: "25 Jun", consultations: 12 },
    { date: "26 Jun", consultations: 19 },
    { date: "27 Jun", consultations: 15 },
    { date: "28 Jun", consultations: 22 },
    { date: "29 Jun", consultations: 30 },
    { date: "30 Jun", consultations: 25 },
    { date: "01 Jul", consultations: 35 },
  ],
}: AnalyticsChartsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* 1. Daily Consultations Area Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-bold">Consultation Volume (Last 7 Days)</CardTitle>
        </CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={dailyConsults}>
              <defs>
                <linearGradient id="colorConsults" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF4554" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#FF4554" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" stroke="#64748B" fontSize={10} tickLine={false} />
              <YAxis stroke="#64748B" fontSize={10} tickLine={false} />
              <Tooltip
                contentStyle={{
                  background: "rgba(255,255,255,0.8)",
                  border: "1px solid rgba(228,228,231,0.6)",
                  borderRadius: "8px",
                  fontSize: "11px",
                }}
              />
              <Area type="monotone" dataKey="consultations" stroke="#FF4554" strokeWidth={2} fillOpacity={1} fill="url(#colorConsults)" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* 2. Language Distribution Pie Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-bold">Language Distribution</CardTitle>
        </CardHeader>
        <CardContent className="h-64 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={languageData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
              >
                {languageData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "rgba(255,255,255,0.8)",
                  border: "1px solid rgba(228,228,231,0.6)",
                  borderRadius: "8px",
                  fontSize: "11px",
                }}
              />
              <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: "10px" }} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
