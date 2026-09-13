import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { AshokaEmblem } from '../../components/gov/AshokaEmblem';
import { User, Shield, KeyRound, Smartphone, Mail, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { INITIAL_APPLICANTS } from '../../data/initialApplicants';

export const LoginPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'applicant' | 'officer'>('applicant');
  const [loginMethod, setLoginMethod] = useState<'password' | 'otp'>('password');
  const [identifier, setIdentifier] = useState('aarav.kumar.st@tribal.edu.in');
  const [password, setPassword] = useState('••••••••••••');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const { loginAsApplicant, loginAsOfficer } = useAuth();
  const navigate = useNavigate();

  const handleApplicantSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginAsApplicant();
    navigate('/applicant/dashboard');
  };

  const handleOfficerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginAsOfficer();
    navigate('/admin/dashboard');
  };

  const handleQuickApplicant = () => {
    loginAsApplicant(INITIAL_APPLICANTS[0]);
    navigate('/applicant/dashboard');
  };

  const handleQuickOfficer = () => {
    loginAsOfficer();
    navigate('/admin/dashboard');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-100">
      <div className="max-w-md w-full space-y-6">
        {/* Gov Identity Header */}
        <div className="text-center space-y-2">
          <AshokaEmblem size={52} className="mx-auto text-slate-800" />
          <div>
            <h2 className="text-2xl font-black text-[#0D3829] tracking-tight">
              AdivaSetu <span className="text-amber-700 font-hindi">अदिवा सेतु</span>
            </h2>
            <p className="text-xs font-semibold text-slate-600 mt-0.5">
              Digital Scholarship & Fellowship Management Platform
            </p>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Ministry of Tribal Affairs • Government of India
            </div>
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
          {/* Role Tabs */}
          <div className="grid grid-cols-2 border-b border-slate-200 bg-slate-50 text-xs font-bold">
            <button
              onClick={() => {
                setActiveTab('applicant');
                setIdentifier('aarav.kumar.st@tribal.edu.in');
              }}
              className={`py-3.5 flex items-center justify-center space-x-2 transition-colors ${
                activeTab === 'applicant'
                  ? 'bg-white text-[#0D3829] border-b-2 border-[#0D3829] shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <User className="w-4 h-4" />
              <span>ST Applicant</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('officer');
                setIdentifier('MOTA-OFF-00412');
              }}
              className={`py-3.5 flex items-center justify-center space-x-2 transition-colors ${
                activeTab === 'officer'
                  ? 'bg-white text-amber-800 border-b-2 border-amber-600 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>Ministry Officer</span>
            </button>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            {/* Quick Demo Access Bar (Requirement 7) */}
            <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl space-y-2">
              <div className="flex items-center justify-between text-[11px] font-bold text-amber-950">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  Quick Hackathon Demo Login
                </span>
                <span className="text-[10px] text-amber-700 font-mono">1-Click</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleQuickApplicant}
                  className="py-1.5 px-2 bg-white hover:bg-emerald-50 text-emerald-950 border border-emerald-300 rounded-lg text-xs font-semibold text-center transition-colors shadow-2xs"
                >
                  Demo Applicant
                </button>
                <button
                  type="button"
                  onClick={handleQuickOfficer}
                  className="py-1.5 px-2 bg-white hover:bg-amber-50 text-amber-950 border border-amber-300 rounded-lg text-xs font-semibold text-center transition-colors shadow-2xs"
                >
                  Demo Officer
                </button>
              </div>
            </div>

            {activeTab === 'applicant' ? (
              /* Applicant Form */
              <form onSubmit={handleApplicantSubmit} className="space-y-4 text-xs">
                {/* Auth Mode Toggle */}
                <div className="flex justify-end gap-3 text-[11px]">
                  <button
                    type="button"
                    onClick={() => setLoginMethod('password')}
                    className={`font-semibold ${
                      loginMethod === 'password' ? 'text-emerald-800 underline' : 'text-slate-500'
                    }`}
                  >
                    Password Login
                  </button>
                  <span className="text-slate-300">|</span>
                  <button
                    type="button"
                    onClick={() => setLoginMethod('otp')}
                    className={`font-semibold ${
                      loginMethod === 'otp' ? 'text-emerald-800 underline' : 'text-slate-500'
                    }`}
                  >
                    Mobile OTP
                  </button>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Mobile Number / Email</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="e.g. 9876543210 or name@tribal.edu.in"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white"
                    />
                  </div>
                </div>

                {loginMethod === 'password' ? (
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="font-bold text-slate-700">Password</label>
                      <a href="#forgot" className="text-[11px] text-emerald-800 hover:underline">
                        Forgot Password?
                      </a>
                    </div>
                    <div className="relative">
                      <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <label className="font-bold text-slate-700">One Time Password (OTP)</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Enter 6-digit OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="flex-1 px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setOtpSent(true);
                          setOtp('739281');
                        }}
                        className="px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs border border-slate-300 shrink-0"
                      >
                        {otpSent ? 'Resend' : 'Get OTP'}
                      </button>
                    </div>
                    {otpSent && (
                      <p className="text-[11px] text-emerald-700">
                        Demo OTP sent: <strong className="font-mono">739281</strong>
                      </p>
                    )}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl text-xs font-bold bg-[#0D3829] hover:bg-[#16533D] text-white transition-all shadow-md flex items-center justify-center space-x-2"
                >
                  <span>Sign In to Scholar Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              /* Ministry Officer Form */
              <form onSubmit={handleOfficerSubmit} className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Ministry Officer ID</label>
                  <div className="relative">
                    <Shield className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="e.g. MOTA-OFF-00412"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-600 bg-white font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Official Passcode / DSC Token</label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-600 bg-white"
                    />
                  </div>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-500">
                  <span className="font-semibold text-slate-700">Gov-ePass Authentication:</span> Single sign-on active for authorized Ministry officers and scrutiny desks.
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl text-xs font-bold bg-amber-700 hover:bg-amber-800 text-white transition-all shadow-md flex items-center justify-center space-x-2"
                >
                  <span>Access Ministry Operations</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Footer info */}
        <p className="text-center text-xs text-slate-500">
          Trouble logging in? Call MoTA National Helpdesk at <strong>1800-11-7788</strong> (Toll Free).
        </p>
      </div>
    </div>
  );
};
