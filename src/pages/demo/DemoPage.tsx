import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApplication } from '../../context/ApplicationContext';
import {
  Sparkles,
  Play,
  User,
  Shield,
  CheckCircle2,
  ArrowRight,
  RotateCcw,
  Video,
  FileCheck2,
  FileSearch,
  ListOrdered,
  Award,
} from 'lucide-react';

export const DemoPage: React.FC = () => {
  const { loginAsApplicant, loginAsOfficer } = useAuth();
  const { launchHackathonDemoScenario, resetAllDemoData, updateStatus } = useApplication();
  const navigate = useNavigate();

  const handleStartFullTour = () => {
    launchHackathonDemoScenario();
    loginAsApplicant();
    navigate('/applicant/dashboard');
  };

  const steps = [
    {
      num: '1',
      title: 'Applicant Dashboard & Deficiency Flag',
      role: 'Applicant (Aarav Kumar)',
      desc: 'Observe the visual horizontal tracker and the prominent action required banner for expired Income Certificate.',
      action: () => {
        loginAsApplicant();
        navigate('/applicant/dashboard');
      },
      cta: 'View Dashboard',
    },
    {
      num: '2',
      title: 'Deficiency Resolution & AI Re-verification',
      role: 'Applicant (Aarav Kumar)',
      desc: 'Select a replacement document, trigger the 7-stage simulated AI OCR inspection, and submit for re-scrutiny.',
      action: () => {
        loginAsApplicant();
        navigate('/applicant/deficiencies');
      },
      cta: 'Open Deficiency Center',
    },
    {
      num: '3',
      title: 'Ministry Officer Scrutiny Workspace',
      role: 'Ministry Officer (Dr. R. Soren)',
      desc: 'Open the AI Scrutiny Panel with 96.2% confidence score, inspect side-by-side OCR data, and approve eligibility.',
      action: () => {
        loginAsOfficer();
        navigate('/admin/scrutiny/ADVS-NFST-2026-00482');
      },
      cta: 'Open AI Scrutiny Panel',
    },
    {
      num: '4',
      title: 'Merit Screening Engine & Criteria Sliders',
      role: 'Ministry Officer (Dr. R. Soren)',
      desc: 'Inspect applicant rankings, adjust selection weight sliders (Academic, Research, Compliance), and shortlist candidate.',
      action: () => {
        loginAsOfficer();
        navigate('/admin/screening');
      },
      cta: 'Open Screening Rankings',
    },
    {
      num: '5',
      title: 'Communication & Provisional Award Sanction',
      role: 'Applicant (Aarav Kumar)',
      desc: 'Receive notification of shortlisting, view monthly stipend disbursement schedule, and download mock award letter.',
      action: () => {
        updateStatus('ADVS-NFST-2026-00482', 'Shortlisted', 'Shortlisted by Central Screening Committee');
        loginAsApplicant();
        navigate('/applicant/fellowship');
      },
      cta: 'View Sanction & Award',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-8 px-4">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#0D3829] via-[#16533D] to-[#0A2E22] text-white p-8 rounded-3xl shadow-xl space-y-4">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold border border-amber-500/30">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Hackathon Evaluation Hub</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
          AdivaSetu End-to-End Guided Demo Tour
        </h1>
        <p className="text-emerald-200 text-sm max-w-2xl leading-relaxed">
          Follow the structured 5-step journey demonstrating how AI reduces administrative workload from 44 days to 2.8 days while preserving 100% human-in-the-loop ministerial governance.
        </p>

        <div className="pt-2 flex flex-wrap gap-3">
          <button
            onClick={handleStartFullTour}
            className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg transition-all active:scale-95"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Launch 1-Click Guided Scenario</span>
          </button>

          <button
            onClick={resetAllDemoData}
            className="flex items-center space-x-2 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>

      {/* Step by Step Cards */}
      <div className="space-y-4">
        {steps.map((st) => (
          <div
            key={st.num}
            className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs hover:border-emerald-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 rounded-2xl bg-[#0D3829] text-white flex items-center justify-center font-mono font-black text-sm shrink-0">
                {st.num}
              </div>
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <h3 className="text-base font-bold text-slate-900">{st.title}</h3>
                  <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-300">
                    {st.role}
                  </span>
                </div>
                <p className="text-xs text-slate-600 max-w-xl leading-relaxed">{st.desc}</p>
              </div>
            </div>

            <button
              onClick={st.action}
              className="shrink-0 flex items-center space-x-1.5 px-5 py-2.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-[#0D3829] hover:text-white text-slate-800 transition-all shadow-2xs"
            >
              <span>{st.cta}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
