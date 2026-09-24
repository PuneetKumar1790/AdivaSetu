import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { AdivaSetuLogo } from '../../components/common/AdivaSetuLogo';
import { INDIAN_STATES, TRIBAL_COMMUNITIES } from '../../data/stateData';
import {
  User,
  Shield,
  KeyRound,
  Smartphone,
  Mail,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  UserPlus,
  HelpCircle,
  Building2,
  GraduationCap,
  Award,
} from 'lucide-react';
import {
  INITIAL_APPLICANTS,
  DEMO_OFFICER,
  DEMO_INSTITUTE_VERIFIER,
  DEMO_SCRUTINY_OFFICER,
  DEMO_SCREENING_OFFICER,
  DEMO_APPROVING_AUTHORITY,
} from '../../data/initialApplicants';

export const LoginPage: React.FC = () => {
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [activeTab, setActiveTab] = useState<'applicant' | 'officer'>('applicant');
  const [loginMethod, setLoginMethod] = useState<'password' | 'otp'>('password');

  // Login form state
  const [identifier, setIdentifier] = useState('aarav.kumar.st@tribal.edu.in');
  const [password, setPassword] = useState('••••••••••••');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  // Registration form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regMobile, setRegMobile] = useState('');
  const [regTribe, setRegTribe] = useState(TRIBAL_COMMUNITIES[0] || 'Gond');
  const [regState, setRegState] = useState(INDIAN_STATES[0] || 'Jharkhand');
  const [regAadhaar, setRegAadhaar] = useState('');
  const [regPassword, setRegPassword] = useState('');

  // Forgot password state
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);

  const { loginAsApplicant, loginAsOfficer, loginAsRole, registerApplicant, resetPassword } = useAuth();
  const { success, info, warning } = useToast();
  const navigate = useNavigate();

  const handleApplicantSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginAsApplicant();
    success('Welcome Back', 'Scholar authentication confirmed via Digital Public Infrastructure.');
    navigate('/applicant/dashboard');
  };

  const handleOfficerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginAsOfficer();
    success('Authorized Officer Access', 'Signed into Ministry Operations Portal.');
    navigate('/admin/dashboard');
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regEmail || !regMobile) {
      warning('Required Fields Missing', 'Please fill all mandatory particulars.');
      return;
    }

    const created = registerApplicant({
      name: regName,
      email: regEmail,
      mobile: regMobile,
      state: regState,
      tribeCommunity: regTribe,
      aadhaarNumber: regAadhaar,
    });

    success('Registration Successful', `Account created for ${created.name}. Welcome to AdivaSetu.`);
    navigate('/applicant/dashboard');
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;
    resetPassword(forgotEmail);
    setResetSuccess(true);
    info('Recovery Link Dispatched', `Password reset token sent to registered email ${forgotEmail}.`);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-100">
      <div className="max-w-xl w-full space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <AdivaSetuLogo size="lg" subtitle={true} className="justify-center" />
          </div>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Unified Single Digital Platform for Scholars, Institutes, and Ministry Scrutiny Desks.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
          {/* Top Auth Mode Tabs */}
          <div className="grid grid-cols-3 border-b border-slate-200 bg-slate-50 text-xs font-bold text-center">
            <button
              onClick={() => {
                setAuthMode('login');
                setResetSuccess(false);
              }}
              className={`py-3.5 transition-colors ${
                authMode === 'login'
                  ? 'bg-white text-[#0D3829] border-b-2 border-[#0D3829] shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setAuthMode('register');
                setResetSuccess(false);
              }}
              className={`py-3.5 flex items-center justify-center space-x-1.5 transition-colors ${
                authMode === 'register'
                  ? 'bg-white text-emerald-800 border-b-2 border-emerald-700 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>New Registration</span>
            </button>
            <button
              onClick={() => setAuthMode('forgot')}
              className={`py-3.5 flex items-center justify-center space-x-1.5 transition-colors ${
                authMode === 'forgot'
                  ? 'bg-white text-amber-800 border-b-2 border-amber-600 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Reset Password</span>
            </button>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            {/* Quick Demo Access Bar with all 5 roles (PS239 Multi-Tier Governance) */}
            <div className="p-3.5 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl space-y-2">
              <div className="flex items-center justify-between text-[11px] font-bold text-amber-950">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  Quick Multi-Role Persona Switcher (Judge / Evaluator Access)
                </span>
                <span className="text-[10px] text-amber-800 font-mono font-bold bg-amber-100 px-2 py-0.5 rounded">
                  1-Click Direct Access
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 text-[11px]">
                <button
                  type="button"
                  onClick={() => {
                    loginAsApplicant(INITIAL_APPLICANTS[0]);
                    navigate('/applicant/dashboard');
                  }}
                  className="py-1.5 px-2 bg-white hover:bg-emerald-50 text-emerald-950 border border-emerald-300 rounded-xl font-bold text-center transition-all shadow-2xs"
                  title="Aarav Kumar (Santhal Tribe, NFST Ph.D candidate)"
                >
                  ST Scholar
                </button>

                <button
                  type="button"
                  onClick={() => {
                    loginAsRole('institute_verifier');
                    navigate('/admin/verification');
                  }}
                  className="py-1.5 px-2 bg-white hover:bg-blue-50 text-blue-950 border border-blue-300 rounded-xl font-bold text-center transition-all shadow-2xs"
                  title="Prof. S. R. Ramaswamy, University Nodal Officer (JNU)"
                >
                  Institute Verifier
                </button>

                <button
                  type="button"
                  onClick={() => {
                    loginAsRole('scrutiny_officer');
                    navigate('/admin/scrutiny');
                  }}
                  className="py-1.5 px-2 bg-white hover:bg-amber-50 text-amber-950 border border-amber-300 rounded-xl font-bold text-center transition-all shadow-2xs"
                  title="Shri Anand Minz, Senior Scrutiny Desk"
                >
                  Scrutiny Desk
                </button>

                <button
                  type="button"
                  onClick={() => {
                    loginAsRole('screening_officer');
                    navigate('/admin/screening');
                  }}
                  className="py-1.5 px-2 bg-white hover:bg-purple-50 text-purple-950 border border-purple-300 rounded-xl font-bold text-center transition-all shadow-2xs"
                  title="Dr. Meenakshi Munda, Screening Committee Chair"
                >
                  Screening Chair
                </button>

                <button
                  type="button"
                  onClick={() => {
                    loginAsRole('approving_authority');
                    navigate('/admin/dashboard');
                  }}
                  className="py-1.5 px-2 bg-white hover:bg-rose-50 text-rose-950 border border-rose-300 rounded-xl font-bold text-center transition-all shadow-2xs"
                  title="Smt. Rekha Sharma, IAS, Joint Secretary"
                >
                  Joint Secretary
                </button>
              </div>
            </div>

            {/* 1. SIGN IN MODE */}
            {authMode === 'login' && (
              <div className="space-y-4">
                {/* Role Tabs */}
                <div className="grid grid-cols-2 bg-slate-100 p-1 rounded-xl text-xs font-bold">
                  <button
                    onClick={() => {
                      setActiveTab('applicant');
                      setIdentifier('aarav.kumar.st@tribal.edu.in');
                    }}
                    className={`py-2 rounded-lg flex items-center justify-center space-x-1.5 transition-colors ${
                      activeTab === 'applicant' ? 'bg-white text-[#0D3829] shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>ST Scholar / Applicant</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('officer');
                      setIdentifier('MOTA-OFF-00412');
                    }}
                    className={`py-2 rounded-lg flex items-center justify-center space-x-1.5 transition-colors ${
                      activeTab === 'officer' ? 'bg-white text-amber-900 shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    <Shield className="w-3.5 h-3.5 text-amber-700" />
                    <span>Ministry / Institute Officer</span>
                  </button>
                </div>

                {activeTab === 'applicant' ? (
                  /* APPLICANT FORM */
                  <form onSubmit={handleApplicantSubmit} className="space-y-4 text-xs">
                    <div className="space-y-1.5">
                      <label className="font-bold text-slate-700">Registered Email / Mobile / Aadhaar</label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          required
                          value={identifier}
                          onChange={(e) => setIdentifier(e.target.value)}
                          className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <label className="font-bold text-slate-700">Password / Security PIN</label>
                        <button
                          type="button"
                          onClick={() => setAuthMode('forgot')}
                          className="text-[11px] text-emerald-800 hover:underline"
                        >
                          Forgot PIN?
                        </button>
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

                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl text-xs font-bold bg-[#0D3829] hover:bg-[#16533D] text-white transition-all shadow-md flex items-center justify-center space-x-2 active:scale-95"
                    >
                      <span>Sign In to Scholar Portal</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>
                ) : (
                  /* OFFICER FORM */
                  <form onSubmit={handleOfficerSubmit} className="space-y-4 text-xs">
                    <div className="space-y-1.5">
                      <label className="font-bold text-slate-700">Ministry Officer ID / Govt Email</label>
                      <div className="relative">
                        <Shield className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          required
                          value={identifier}
                          onChange={(e) => setIdentifier(e.target.value)}
                          className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-600 bg-white font-mono"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-bold text-slate-700">Official Passcode / DSC Token PIN</label>
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

                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl text-xs font-bold bg-amber-800 hover:bg-amber-900 text-white transition-all shadow-md flex items-center justify-center space-x-2 active:scale-95"
                    >
                      <span>Access Ministry Operations</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* 2. REGISTRATION MODE (Requirement 4: Items 32–41) */}
            {authMode === 'register' && (
              <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">New Tribal Scholar One-Time Registration</h3>
                  <p className="text-slate-500 text-[11px]">
                    Create a unified account valid across all MoTA fellowship and scholarship schemes.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">Candidate Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Priya Munda"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">Mobile Number (Aadhaar Linked)</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 9876543210"
                      value={regMobile}
                      onChange={(e) => setRegMobile(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. priya.munda@research.ac.in"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">Aadhaar Reference Number</label>
                    <input
                      type="text"
                      placeholder="12-digit Aadhaar"
                      value={regAadhaar}
                      onChange={(e) => setRegAadhaar(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">Tribe / Sub-Community</label>
                    <select
                      value={regTribe}
                      onChange={(e) => setRegTribe(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                    >
                      {TRIBAL_COMMUNITIES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">State of Domicile</label>
                    <select
                      value={regState}
                      onChange={(e) => setRegState(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                    >
                      {INDIAN_STATES.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Create Security Password</label>
                  <input
                    type="password"
                    required
                    placeholder="Minimum 8 characters"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                  />
                </div>

                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-[11px] flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>One account gives access to NFST, NOS, TCE-ST, PMS-ST, and grievance tracking.</span>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl text-xs font-bold bg-[#0D3829] hover:bg-[#16533D] text-white transition-all shadow-md flex items-center justify-center space-x-2 active:scale-95"
                >
                  <span>Complete Scholar Registration & Enter Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* 3. FORGOT PASSWORD MODE (Requirement 4: Item 34) */}
            {authMode === 'forgot' && (
              <form onSubmit={handleForgotSubmit} className="space-y-4 text-xs">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Aadhaar e-Pramaan Password Recovery</h3>
                  <p className="text-slate-500 text-[11px]">
                    Enter your registered email address or mobile to receive an OTP reset link.
                  </p>
                </div>

                {resetSuccess ? (
                  <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-emerald-950 space-y-2">
                    <div className="flex items-center space-x-2 font-bold text-sm">
                      <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                      <span>Password Reset Link Dispatched</span>
                    </div>
                    <p className="text-[11px] leading-relaxed">
                      We have sent an authentication token to <strong>{forgotEmail}</strong>. You can now use your temporary credentials to log in.
                    </p>
                    <button
                      type="button"
                      onClick={() => setAuthMode('login')}
                      className="mt-2 px-4 py-1.5 bg-[#0D3829] text-white rounded-lg font-bold text-xs"
                    >
                      Return to Sign In
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="space-y-1.5">
                      <label className="font-bold text-slate-700">Registered Email Address</label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. aarav.kumar.st@tribal.edu.in"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl text-xs font-bold bg-[#0D3829] hover:bg-[#16533D] text-white transition-all shadow-md flex items-center justify-center space-x-2"
                    >
                      <span>Send OTP Reset Instructions</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </>
                )}
              </form>
            )}
          </div>
        </div>

        {/* Footer info */}
        <p className="text-center text-xs text-slate-500">
          Trouble logging in? Call MoTA National Fellowship Helpdesk at <strong>1800-11-7788</strong> (Toll Free).
        </p>
      </div>
    </div>
  );
};
