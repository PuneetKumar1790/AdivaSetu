import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApplication } from '../../context/ApplicationContext';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Play, RotateCcw, Shield, User, ChevronRight, X, Sliders, CheckCircle } from 'lucide-react';
import { ApplicationStatus } from '../../types';

interface DemoScenarioControlsProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DemoScenarioControls: React.FC<DemoScenarioControlsProps> = ({ isOpen, onClose }) => {
  const { role, switchRole, loginAsApplicant, loginAsOfficer } = useAuth();
  const { applications, updateStatus, resetAllDemoData, launchHackathonDemoScenario } = useApplication();
  const navigate = useNavigate();

  const [selectedStatus, setSelectedStatus] = useState<ApplicationStatus>('Deficient');

  if (!isOpen) return null;

  const targetAppId = 'ADVS-NFST-2026-00482';

  const handleLaunchScenario = () => {
    launchHackathonDemoScenario();
    loginAsApplicant();
    navigate('/applicant/dashboard');
    onClose();
  };

  const handleApplyStatusChange = (status: ApplicationStatus) => {
    updateStatus(targetAppId, status, `Manual Hackathon Demo Trigger: ${status}`);
    setSelectedStatus(status);
  };

  const statuses: ApplicationStatus[] = [
    'Deficient',
    'Resubmitted',
    'Scrutiny',
    'Screening',
    'Shortlisted',
    'Selected',
    'Approved',
  ];

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-white shadow-2xl border-l border-slate-300 flex flex-col animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-600 to-amber-700 text-white p-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-amber-200" />
          <div>
            <h3 className="text-sm font-bold tracking-wide">Hackathon Demo Controls</h3>
            <p className="text-[10px] text-amber-100">Live Stage & Persona Orchestration</p>
          </div>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-amber-800 rounded text-amber-100">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 p-5 space-y-6 overflow-y-auto text-xs">
        {/* Quick Launch Preset Scenario */}
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="font-bold text-emerald-950 flex items-center gap-1.5">
              <Play className="w-3.5 h-3.5 text-emerald-700 fill-current" />
              1-Click Demo Journey
            </span>
            <span className="text-[10px] font-semibold bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full">
              Recommended
            </span>
          </div>
          <p className="text-[11px] text-emerald-800 leading-relaxed">
            Resets Aarav Kumar (NFST) to the <strong>Deficient State</strong>. Ready to demonstrate: Deficiency → AI Re-verification → Scrutiny Approval → Screening Shortlist.
          </p>
          <button
            onClick={handleLaunchScenario}
            className="w-full py-2 px-3 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center space-x-1.5"
          >
            <span>Launch Preset Demo Story</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Persona Switcher */}
        <div className="space-y-2">
          <label className="font-bold text-slate-700 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-slate-500" />
            Switch Active Persona
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                loginAsApplicant();
                navigate('/applicant/dashboard');
              }}
              className={`p-2.5 rounded-lg border text-left transition-all ${
                role === 'applicant'
                  ? 'bg-[#0D3829] text-white border-[#0D3829] shadow-xs'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <div className="font-bold">Aarav Kumar</div>
              <div className="text-[10px] opacity-80">ST Applicant</div>
            </button>

            <button
              onClick={() => {
                loginAsOfficer();
                navigate('/admin/dashboard');
              }}
              className={`p-2.5 rounded-lg border text-left transition-all ${
                role === 'officer'
                  ? 'bg-amber-700 text-white border-amber-700 shadow-xs'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <div className="font-bold">Dr. R. Soren</div>
              <div className="text-[10px] opacity-80">Ministry Officer</div>
            </button>
          </div>
        </div>

        {/* Live Status Override */}
        <div className="space-y-2">
          <label className="font-bold text-slate-700 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-slate-500" />
              Aarav's Application State
            </span>
            <span className="font-mono text-[10px] text-emerald-800 font-bold">
              {targetAppId}
            </span>
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            {statuses.map((st) => (
              <button
                key={st}
                onClick={() => handleApplyStatusChange(st)}
                className={`py-1.5 px-2 rounded-md border text-center font-medium transition-colors ${
                  selectedStatus === st
                    ? 'bg-amber-100 text-amber-900 border-amber-400 font-bold'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Navigation */}
        <div className="space-y-2">
          <label className="font-bold text-slate-700">Jump to Key Module</label>
          <div className="space-y-1">
            <button
              onClick={() => {
                loginAsApplicant();
                navigate('/applicant/deficiencies');
                onClose();
              }}
              className="w-full text-left p-2 rounded hover:bg-slate-100 text-slate-700 flex items-center justify-between"
            >
              <span>1. Applicant Deficiency Center</span>
              <ChevronRight className="w-3 h-3 text-slate-400" />
            </button>
            <button
              onClick={() => {
                loginAsOfficer();
                navigate('/admin/scrutiny');
                onClose();
              }}
              className="w-full text-left p-2 rounded hover:bg-slate-100 text-slate-700 flex items-center justify-between"
            >
              <span>2. Officer AI Scrutiny Queue</span>
              <ChevronRight className="w-3 h-3 text-slate-400" />
            </button>
            <button
              onClick={() => {
                loginAsOfficer();
                navigate('/admin/screening');
                onClose();
              }}
              className="w-full text-left p-2 rounded hover:bg-slate-100 text-slate-700 flex items-center justify-between"
            >
              <span>3. Merit Screening Engine</span>
              <ChevronRight className="w-3 h-3 text-slate-400" />
            </button>
            <button
              onClick={() => {
                loginAsApplicant();
                navigate('/applicant/fellowship');
                onClose();
              }}
              className="w-full text-left p-2 rounded hover:bg-slate-100 text-slate-700 flex items-center justify-between"
            >
              <span>4. Award Letter & Disbursement</span>
              <ChevronRight className="w-3 h-3 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Reset */}
        <div className="pt-4 border-t border-slate-200">
          <button
            onClick={() => {
              resetAllDemoData();
              onClose();
            }}
            className="w-full py-2 px-3 rounded-lg border border-slate-300 text-slate-600 hover:text-rose-700 hover:border-rose-300 hover:bg-rose-50 transition-colors flex items-center justify-center space-x-1.5 font-semibold"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All Demo Data</span>
          </button>
        </div>
      </div>
    </div>
  );
};
