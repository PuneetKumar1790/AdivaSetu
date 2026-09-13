import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApplication } from '../../context/ApplicationContext';
import { useNavigate } from 'react-router-dom';
import { apiConfig, LatencyProfile, SimulatedErrorType, ApiMode } from '../../services/api/apiConfig';
import {
  Sparkles,
  Play,
  RotateCcw,
  Shield,
  User,
  ChevronRight,
  X,
  Sliders,
  CheckCircle,
  Zap,
  Server,
  AlertTriangle,
  Radio,
} from 'lucide-react';
import { ApplicationStatus } from '../../types';

interface DemoScenarioControlsProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DemoScenarioControls: React.FC<DemoScenarioControlsProps> = ({ isOpen, onClose }) => {
  const { role, loginAsApplicant, loginAsOfficer } = useAuth();
  const { updateStatus, resetAllDemoData, launchHackathonDemoScenario } = useApplication();
  const navigate = useNavigate();

  const [selectedStatus, setSelectedStatus] = useState<ApplicationStatus>('Deficient');
  const [latency, setLatency] = useState<LatencyProfile>(() => apiConfig.getLatencyProfile());
  const [apiMode, setApiMode] = useState<ApiMode>(() => apiConfig.getMode());
  const [simError, setSimError] = useState<SimulatedErrorType>(() => apiConfig.getSimulatedError());

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

  const handleLatencyChange = (profile: LatencyProfile) => {
    apiConfig.setLatencyProfile(profile);
    setLatency(profile);
  };

  const handleApiModeChange = (mode: ApiMode) => {
    apiConfig.setMode(mode);
    setApiMode(mode);
  };

  const handleSimErrorChange = (errType: SimulatedErrorType) => {
    apiConfig.setSimulatedError(errType);
    setSimError(errType);
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
      <div className="bg-gradient-to-r from-emerald-900 via-[#0D3829] to-amber-700 text-white p-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-amber-300" />
          <div>
            <h3 className="text-sm font-bold tracking-wide">Demo & Architecture Controls</h3>
            <p className="text-[10px] text-emerald-100">Live Stage & Backend Simulation Hub</p>
          </div>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-white/20 rounded text-white cursor-pointer">
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
            className="w-full py-2 px-3 rounded-lg bg-[#0D3829] hover:bg-[#16533D] text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
          >
            <span>Launch Preset Demo Story</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 1. Realistic API Latency Profile (Requirement 2) */}
        <div className="space-y-2 p-3 bg-slate-50 border border-slate-200 rounded-xl">
          <div className="flex items-center justify-between">
            <label className="font-bold text-slate-800 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-600" />
              API Latency Profile
            </label>
            <span className="text-[10px] text-slate-500 font-mono">
              {latency === 'realistic' ? '600–1200ms' : latency === 'fast' ? '200ms' : '0ms'}
            </span>
          </div>
          <p className="text-[10px] text-slate-500">
            Simulates real enterprise database roundtrips & skeleton loaders.
          </p>
          <div className="grid grid-cols-3 gap-1.5">
            {(['realistic', 'fast', 'instant'] as LatencyProfile[]).map((prof) => (
              <button
                key={prof}
                onClick={() => handleLatencyChange(prof)}
                className={`py-1.5 px-2 rounded-lg border text-center font-bold capitalize transition-colors ${
                  latency === prof
                    ? 'bg-emerald-800 text-white border-emerald-800 shadow-2xs'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {prof}
              </button>
            ))}
          </div>
        </div>

        {/* 2. Simulated Gateway Errors & Recovery (Requirement 8) */}
        <div className="space-y-2 p-3 bg-rose-50/50 border border-rose-200 rounded-xl">
          <div className="flex items-center justify-between">
            <label className="font-bold text-rose-950 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
              Error & Recovery Simulation
            </label>
            {simError !== 'none' && (
              <span className="text-[9px] bg-rose-200 text-rose-800 font-bold px-1.5 py-0.5 rounded">
                ACTIVE
              </span>
            )}
          </div>
          <p className="text-[10px] text-rose-800">
            Trigger a transient failure to demonstrate self-healing retry UX to judges.
          </p>
          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={() => handleSimErrorChange('none')}
              className={`py-1.5 px-2 rounded-lg border text-center font-semibold transition-colors ${
                simError === 'none'
                  ? 'bg-emerald-800 text-white border-emerald-800'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              ✓ Normal (No Error)
            </button>
            <button
              onClick={() => handleSimErrorChange('gateway_timeout')}
              className={`py-1.5 px-2 rounded-lg border text-center font-semibold transition-colors ${
                simError === 'gateway_timeout'
                  ? 'bg-rose-700 text-white border-rose-700'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-rose-50'
              }`}
            >
              Trigger 503 Timeout
            </button>
          </div>
        </div>

        {/* 3. API Backend Switch (Requirement 11) */}
        <div className="space-y-2 p-3 bg-slate-50 border border-slate-200 rounded-xl">
          <label className="font-bold text-slate-800 flex items-center gap-1.5">
            <Server className="w-3.5 h-3.5 text-slate-600" />
            Backend Mode Switch (API_MODE)
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={() => handleApiModeChange('mock')}
              className={`py-1.5 px-2 rounded-lg border text-center font-bold transition-colors ${
                apiMode === 'mock'
                  ? 'bg-amber-700 text-white border-amber-700 shadow-2xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              Mock Service (Local DB)
            </button>
            <button
              onClick={() => handleApiModeChange('real')}
              className={`py-1.5 px-2 rounded-lg border text-center font-bold transition-colors ${
                apiMode === 'real'
                  ? 'bg-blue-700 text-white border-blue-700 shadow-2xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              REST API (/api/v1)
            </button>
          </div>
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
            className="w-full py-2 px-3 rounded-lg border border-slate-300 text-slate-600 hover:text-rose-700 hover:border-rose-300 hover:bg-rose-50 transition-colors flex items-center justify-center space-x-1.5 font-semibold cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All Demo Data</span>
          </button>
        </div>
      </div>
    </div>
  );
};
