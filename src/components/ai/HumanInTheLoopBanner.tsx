import React from 'react';
import { ShieldCheck, UserCheck } from 'lucide-react';

export const HumanInTheLoopBanner: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  if (compact) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50/80 border border-emerald-200/80 rounded-lg text-xs text-emerald-900">
        <UserCheck className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
        <span className="font-medium">
          <strong>Human-in-the-loop:</strong> AI provides decision support. Final authority remains with the authorized Ministry officer.
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-start sm:items-center gap-3 p-4 bg-gradient-to-r from-emerald-50 via-teal-50 to-amber-50 border border-emerald-200 rounded-xl shadow-2xs">
      <div className="p-2 bg-emerald-700 text-white rounded-lg shrink-0">
        <ShieldCheck className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h4 className="text-sm font-bold text-emerald-950">
            Responsible AI & Human-in-the-Loop Governance
          </h4>
          <span className="text-[10px] font-semibold bg-emerald-200/70 text-emerald-900 px-2 py-0.5 rounded-full">
            MoTA AI Framework
          </span>
        </div>
        <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
          The automated engine performs OCR extraction, cross-document verification, and rule-based anomaly detection. Final scholarship sanction is strictly executed by the designated Ministry Scrutiny Officer.
        </p>
      </div>
    </div>
  );
};
