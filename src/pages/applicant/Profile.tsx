import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, User, Mail, Phone, MapPin, Building, Award, CheckCircle2 } from 'lucide-react';

export const ScholarProfile: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
          Citizen Credentials
        </span>
        <h1 className="text-xl font-bold text-slate-900 mt-1">Scholar Profile & Digital Credentials</h1>
        <p className="text-xs text-slate-500 font-hindi">
          आवेदक प्रोफ़ाइल एवं डिजीलॉकर प्रमाणित पहचान
        </p>
      </div>

      {/* Main Profile Info */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Profile Card (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200 p-6 shadow-xs text-center space-y-4">
          <div className="relative w-28 h-28 mx-auto">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200'}
              alt={user?.name}
              className="w-full h-full rounded-full border-4 border-[#0D3829] object-cover shadow-md"
            />
            <div className="absolute bottom-1 right-1 p-1.5 bg-emerald-700 text-white rounded-full border-2 border-white shadow-xs">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900">{user?.name}</h2>
            <p className="text-xs font-semibold text-emerald-800">Scheduled Tribe (ST) - Gond Community</p>
            <span className="inline-block mt-1 font-mono text-[11px] text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-md">
              Scholar ID: ST-2026-9281
            </span>
          </div>

          <div className="pt-4 border-t border-slate-100 space-y-2 text-xs text-left text-slate-600">
            <div className="flex items-center space-x-2.5">
              <Mail className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="truncate">{user?.email}</span>
            </div>
            <div className="flex items-center space-x-2.5">
              <Phone className="w-4 h-4 text-slate-400 shrink-0" />
              <span>+91 {user?.mobile}</span>
            </div>
            <div className="flex items-center space-x-2.5">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
              <span>New Delhi, Delhi - 110067</span>
            </div>
            <div className="flex items-center space-x-2.5">
              <Building className="w-4 h-4 text-slate-400 shrink-0" />
              <span>Jawaharlal Nehru University</span>
            </div>
          </div>
        </div>

        {/* Right Verified Registries (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b pb-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Statutory Verified Registries (India Stack)
            </h3>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              100% Authenticated
            </span>
          </div>

          <div className="space-y-4 text-xs">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-slate-800">Aadhaar e-KYC Identity Match</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.2 rounded-full">
                    Active
                  </span>
                </div>
                <p className="text-slate-500">
                  UID Reference: <strong className="font-mono">XXXX XXXX 2841</strong> • Verified via UIDAI OTP Gateway.
                </p>
              </div>
              <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-slate-800">Caste Community Certificate (DigiLocker)</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.2 rounded-full">
                    Valid
                  </span>
                </div>
                <p className="text-slate-500">
                  Certificate No: <strong className="font-mono">ST/DEL/2024/83921</strong> • Issuing Authority: SDM Vasant Vihar.
                </p>
              </div>
              <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-slate-800">Direct Benefit Transfer (DBT) Bank Seeding</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.2 rounded-full">
                    NPCI Linked
                  </span>
                </div>
                <p className="text-slate-500">
                  State Bank of India (A/C: ****4821) • IFSC: SBIN0001077.
                </p>
              </div>
              <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
