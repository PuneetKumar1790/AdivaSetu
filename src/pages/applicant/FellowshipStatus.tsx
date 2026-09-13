import React from 'react';
import { useApplication } from '../../context/ApplicationContext';
import { downloadMockCertificate } from '../../utils/pdfGenerator';
import { formatCurrencyINR, formatDate } from '../../utils/formatters';
import {
  Award,
  Download,
  CheckCircle2,
  Calendar,
  Building,
  CreditCard,
  Clock,
  FileCheck,
  TrendingUp,
  ShieldCheck,
} from 'lucide-react';

export const FellowshipStatus: React.FC = () => {
  const { applications } = useApplication();

  // Find active or selected fellowship
  const app =
    applications.find((a) => a.status === 'Selected' || a.status === 'Approved' || a.id.includes('NFST')) ||
    applications[0];

  const isFormallyAwarded = app.status === 'Selected' || app.status === 'Approved' || app.status === 'Shortlisted';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            Sanction & Disbursement Gateway
          </span>
          <h1 className="text-xl font-bold text-slate-900 mt-1">Fellowship & Award Management</h1>
          <p className="text-xs text-slate-500 font-hindi">
            अध्येतावृत्ति संस्वीकृति, मासिक छात्रवृत्ति विवरण एवं डीबीटी संवितरण
          </p>
        </div>

        <button
          onClick={() => downloadMockCertificate(app)}
          className="flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-[#0D3829] hover:bg-[#16533D] text-white transition-all shadow-md active:scale-95"
        >
          <Download className="w-3.5 h-3.5 text-amber-300" />
          <span>Download Provisional Award Letter</span>
        </button>
      </div>

      {/* Main Award Status Card (Requirement 35) */}
      <div className="bg-gradient-to-br from-[#0D3829] via-[#16533D] to-[#0A2E22] text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden space-y-6">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-800/80 pb-6">
          <div className="space-y-1">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              {isFormallyAwarded ? 'Provisional Award Conferred' : 'Under Evaluation'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              {app.schemeName} ({app.schemeCode})
            </h2>
            <p className="text-xs text-emerald-200">
              Sanction Order Ref: <strong className="font-mono text-white">MOTA/NFST/2026-27/0482</strong>
            </p>
          </div>

          <div className="px-4 py-2 bg-emerald-800/80 rounded-2xl border border-emerald-600/50 text-right">
            <span className="text-[10px] text-emerald-200 font-bold uppercase tracking-wider">
              Fellowship Status
            </span>
            <div className="text-lg font-black text-amber-300">
              {isFormallyAwarded ? 'ACTIVE & SANCTIONED' : 'IN SCRUTINY'}
            </div>
          </div>
        </div>

        {/* 4-stat grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
          <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-xs border border-white/10">
            <span className="text-[11px] text-emerald-200">Monthly Stipend (JRF)</span>
            <div className="text-xl sm:text-2xl font-black text-white mt-0.5">₹37,000</div>
            <span className="text-[10px] text-amber-300">+ HRA & Contingency</span>
          </div>

          <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-xs border border-white/10">
            <span className="text-[11px] text-emerald-200">Approved Tenor</span>
            <div className="text-xl sm:text-2xl font-black text-white mt-0.5">5 Years</div>
            <span className="text-[10px] text-emerald-300">2 yrs JRF + 3 yrs SRF</span>
          </div>

          <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-xs border border-white/10">
            <span className="text-[11px] text-emerald-200">Enrolled Institution</span>
            <div className="text-base sm:text-lg font-bold text-white mt-0.5 truncate">
              {app.formData.institution || app.formData.university}
            </div>
            <span className="text-[10px] text-emerald-300">New Delhi</span>
          </div>

          <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-xs border border-white/10">
            <span className="text-[11px] text-emerald-200">DBT Bank Gateway</span>
            <div className="text-base sm:text-lg font-bold text-white mt-0.5">SBI (****4821)</div>
            <span className="text-[10px] text-emerald-300">Aadhaar Linked (NPCI)</span>
          </div>
        </div>
      </div>

      {/* Disbursement Schedule & Milestones */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Monthly Disbursement Tracker (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Monthly Direct Benefit Transfer (DBT) Schedule
              </h3>
              <p className="text-xs text-slate-500">Public Financial Management System (PFMS)</p>
            </div>
            <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full">
              Demo Data
            </span>
          </div>

          <div className="space-y-3">
            {[
              { month: 'October 2026', amount: '₹37,000', status: 'Scheduled', date: '01 Nov 2026' },
              { month: 'September 2026', amount: '₹37,000', status: 'Disbursed', date: '01 Oct 2026', utr: 'SBIN928102910' },
              { month: 'August 2026', amount: '₹37,000', status: 'Disbursed', date: '01 Sep 2026', utr: 'SBIN891029180' },
              { month: 'Contingency Grant (Year 1)', amount: '₹12,000', status: 'Disbursed', date: '15 Aug 2026', utr: 'SBIN872910291' },
            ].map((dbt, i) => (
              <div
                key={i}
                className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between text-xs"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`p-2 rounded-lg ${
                      dbt.status === 'Disbursed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">{dbt.month}</h4>
                    <span className="text-[10px] text-slate-500">
                      Transfer Date: {dbt.date} {dbt.utr ? `• UTR: ${dbt.utr}` : ''}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-bold text-slate-900">{dbt.amount}</div>
                  <span
                    className={`inline-block text-[10px] font-bold px-2 py-0.2 rounded-full ${
                      dbt.status === 'Disbursed'
                        ? 'bg-emerald-100 text-emerald-900'
                        : 'bg-amber-100 text-amber-900'
                    }`}
                  >
                    {dbt.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Annual Compliance & Next Milestone (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 border-b pb-3">
            Academic Compliance & Next Milestone
          </h3>

          <div className="space-y-4 text-xs">
            <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-950">Next Progress Review</span>
                <span className="text-[10px] font-bold text-emerald-800">Due: 15 Jan 2027</span>
              </div>
              <p className="text-slate-600 leading-snug">
                Annual research progress report certified by Supervisor and Head of Department.
              </p>
            </div>

            <div className="space-y-2">
              <span className="font-bold text-slate-700">Document Compliance Status</span>
              <div className="space-y-1.5 text-[11px]">
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                  <span>Aadhaar e-KYC Verification</span>
                  <span className="text-emerald-800 font-bold">✓ Compliant</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                  <span>Scheduled Tribe Community Certificate</span>
                  <span className="text-emerald-800 font-bold">✓ Authenticated</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                  <span>Direct Benefit Transfer (DBT) Mandate</span>
                  <span className="text-emerald-800 font-bold">✓ Active (NPCI)</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                  <span>Regular Enrolment Bonafide</span>
                  <span className="text-emerald-800 font-bold">✓ Uploaded</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
