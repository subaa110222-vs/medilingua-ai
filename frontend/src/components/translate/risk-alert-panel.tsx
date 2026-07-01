import React from "react";
import { AlertCircle, ShieldAlert, HeartCrack, Baby, ShieldCheck } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface RiskAlertPanelProps {
  allergies?: string[];
  pregnancyStatus?: boolean;
  chronicConditions?: string[];
  detectedContraindications?: string[];
}

export function RiskAlertPanel({
  allergies = [],
  pregnancyStatus = false,
  chronicConditions = [],
  detectedContraindications = [],
}: RiskAlertPanelProps) {
  const hasRisks =
    allergies.length > 0 ||
    pregnancyStatus ||
    chronicConditions.length > 0 ||
    detectedContraindications.length > 0;

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2 text-foreground">
          <ShieldAlert className="h-4.5 w-4.5 text-primary" />
          Clinical Patient Risk Profile
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 text-xs font-semibold">
        {!hasRisks ? (
          <div className="flex flex-col items-center justify-center p-6 text-center text-green-600 gap-1 bg-green-500/5 rounded-xl border border-green-500/10">
            <ShieldCheck className="h-6 w-6 text-green-500" />
            <p className="font-bold">No Active Risks Detected</p>
            <p className="text-[10px] text-muted-foreground">This patient has no flagged conditions or allergy conflicts.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {/* 1. Drug Allergies */}
            {allergies.length > 0 && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 flex flex-col gap-1">
                <div className="flex items-center gap-1.5 font-extrabold text-[11px] uppercase tracking-wider">
                  <AlertCircle className="h-4 w-4" />
                  <span>Drug Allergies</span>
                </div>
                <div className="flex flex-wrap gap-1 mt-1">
                  {allergies.map((allergy, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-full bg-red-500/20 border border-red-500/30 text-[10px]">
                      {allergy}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* 2. Pregnancy Alerts */}
            {pregnancyStatus && (
              <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-600 flex flex-col gap-1">
                <div className="flex items-center gap-1.5 font-extrabold text-[11px] uppercase tracking-wider">
                  <Baby className="h-4 w-4" />
                  <span>Pregnancy Status: High Risk Alert</span>
                </div>
                <p className="text-[10px] mt-0.5 text-purple-700/80">
                  Ensure all prescriptions avoid teratogenic drugs (e.g., ACE inhibitors, Retinoids).
                </p>
              </div>
            )}

            {/* 3. Chronic Conditions */}
            {chronicConditions.length > 0 && (
              <div className="p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-600 flex flex-col gap-1">
                <div className="flex items-center gap-1.5 font-extrabold text-[11px] uppercase tracking-wider">
                  <HeartCrack className="h-4 w-4" />
                  <span>Chronic Co-Morbidities</span>
                </div>
                <div className="flex flex-wrap gap-1 mt-1">
                  {chronicConditions.map((cond, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-full bg-yellow-500/20 border border-yellow-500/30 text-[10px]">
                      {cond}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* 4. Contraindications detected in live context */}
            {detectedContraindications.length > 0 && (
              <div className="p-3 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-600 flex flex-col gap-1.5">
                <div className="font-bold text-[11px] uppercase tracking-wider flex items-center gap-1">
                  <AlertCircle className="h-3.5 w-3.5" />
                  Contraindications Found
                </div>
                <ul className="list-disc pl-4 text-[10px] flex flex-col gap-0.5">
                  {detectedContraindications.map((contra, i) => (
                    <li key={i}>{contra}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
