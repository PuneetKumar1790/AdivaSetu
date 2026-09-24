import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { INITIAL_SCHEMES } from '../../data/schemesData';
import { useAuth } from '../../context/AuthContext';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  FileCheck2,
  Users,
  Search,
  CheckCircle2,
  Building2,
  Calendar,
  Layers,
  Cpu,
  BookOpen,
  Award,
  ChevronRight,
  Play,
  TrendingUp,
  Zap,
  Lock,
  Compass,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const { loginAsApplicant } = useAuth();
  const navigate = useNavigate();

  const filteredSchemes = INITIAL_SCHEMES.filter((s) => {
    const matchesCategory = selectedCategory === 'all' || s.category === selectedCategory;
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.targetGroup.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleStartAaravDemo = () => {
    loginAsApplicant();
    navigate('/applicant/dashboard');
  };

  return (
    <div className="space-y-16 pb-20 bg-slate-50 text-slate-800">
      {/* Sleek Modern Hero Section */}
      <section className="relative overflow-hidden bg-slate-950 text-white py-20 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        {/* Subtle background glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(16,185,129,0.15),rgba(255,255,255,0))] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          {/* Left Column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold tracking-wide">
              <Sparkles className="w-3.5 h-3.5" />
              <span>National Fellowship & Scholarship Gateway 2026-27</span>
            </div>

            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
                Empowering Tribal Scholars with Modern Digital Infrastructure
              </h1>
              <p className="text-base sm:text-lg font-normal text-slate-300 max-w-2xl leading-relaxed">
                A unified, transparent portal for Scheduled Tribe students. From automated document verification to merit screening and direct-to-bank fellowship disbursements.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="#schemes"
                className="flex items-center space-x-2 px-6 py-3 rounded-xl text-xs sm:text-sm font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-md shadow-emerald-900/30 active:scale-95 cursor-pointer"
              >
                <span>Explore Schemes</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <Link
                to="/applicant/eligibility"
                className="flex items-center space-x-2 px-6 py-3 rounded-xl text-xs sm:text-sm font-semibold bg-white/10 hover:bg-white/15 text-white border border-white/15 transition-all active:scale-95 backdrop-blur-xs"
              >
                <Zap className="w-4 h-4 text-emerald-400" />
                <span>Check Eligibility</span>
              </Link>

              <button
                onClick={handleStartAaravDemo}
                className="flex items-center space-x-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-semibold bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700/80 transition-all cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 text-emerald-400 fill-current" />
                <span>Demo Walkthrough</span>
              </button>
            </div>

            {/* Metrics Bar */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-slate-800/80 text-xs">
              <div>
                <div className="text-2xl font-black text-white font-mono">₹28.45 Cr</div>
                <div className="text-slate-400 text-[11px] mt-0.5">DBT Disbursed via PFMS</div>
              </div>
              <div>
                <div className="text-2xl font-black text-emerald-400 font-mono">12,480+</div>
                <div className="text-slate-400 text-[11px] mt-0.5">Scholars Enrolled</div>
              </div>
              <div>
                <div className="text-2xl font-black text-white font-mono">98.4%</div>
                <div className="text-slate-400 text-[11px] mt-0.5">Verification Accuracy</div>
              </div>
            </div>
          </div>

          {/* Right Column: Sleek Interactive Pipeline Card */}
          <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-2xl backdrop-blur-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Digital Processing Pipeline
              </span>
              <span className="text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                Automated + Human Oversight
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-start space-x-3 p-3.5 rounded-2xl bg-slate-800/50 border border-slate-700/60">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0">
                  1
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs">One-Click Digital Application</h4>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    Pre-filled with DigiLocker and e-Pramaan for instant certificate retrieval.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3.5 rounded-2xl bg-slate-800/50 border border-slate-700/60">
                <div className="w-7 h-7 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold text-xs shrink-0">
                  2
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs">Multi-Stage AI Scrutiny</h4>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    Multilingual OCR, seal analysis, and income threshold validation within seconds.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3.5 rounded-2xl bg-slate-800/50 border border-slate-700/60">
                <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs shrink-0">
                  3
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs">Deficiency Resolution Center</h4>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    Immediate notification with instant replacement upload instead of outright rejection.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3.5 rounded-2xl bg-slate-800/50 border border-slate-700/60">
                <div className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-xs shrink-0">
                  4
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs">Sanction & Direct PFMS Credit</h4>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    Provisional award letter generation and automated monthly DBT disbursements.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Link
                to="/applicant/applications"
                className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center space-x-2 transition-colors border border-slate-700"
              >
                <span>Track an Application</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Schemes Directory */}
      <section id="schemes" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              National Directory
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
              Available Fellowship & Scholarship Schemes
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
              Explore national programs designed to support Scheduled Tribe scholars across higher education, research, and overseas studies.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by scheme code, name or level..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700 shadow-2xs"
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 text-xs">
          {[
            { id: 'all', label: 'All Schemes' },
            { id: 'fellowship', label: 'National Fellowship (NFST)' },
            { id: 'overseas', label: 'Overseas Studies (NOS)' },
            { id: 'scholarship', label: 'Top Class & Post-Matric' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Schemes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSchemes.map((scheme) => (
            <div
              key={scheme.id}
              className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs hover:shadow-md hover:border-emerald-500 transition-all flex flex-col justify-between space-y-5"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs font-black font-mono bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-lg border border-emerald-200">
                    {scheme.code}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    {scheme.category.toUpperCase()}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    {scheme.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {scheme.description}
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 text-xs text-slate-700">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Stipend / Value:</span>
                    <strong className="text-emerald-800 font-bold">{scheme.stipendAmount}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Available Slots:</span>
                    <strong className="text-slate-800">{scheme.slotsAvailable} Awards</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Level:</span>
                    <strong className="text-slate-800">{scheme.educationLevel}</strong>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <Link
                  to={`/applicant/application/new?scheme=${scheme.code}`}
                  className="flex-1 py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs text-center transition-colors shadow-2xs"
                >
                  Apply Online
                </Link>
                <Link
                  to="/applicant/eligibility"
                  className="py-2 px-3 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold text-xs text-center transition-colors"
                >
                  Check Eligibility
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Modern Value Props */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 border border-slate-800 space-y-8">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Platform Architecture
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              Built for Scale, Equity, and Transparency
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              Replacing legacy paperwork with an intelligent workflow engine that preserves human authority while eliminating bureaucratic delays.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
            <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                <FileCheck2 className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-white text-sm">Automated OCR</h4>
              <p className="text-slate-400 leading-relaxed">
                Multilingual recognition extracts data from Revenue, Income, and Caste certificates with 98%+ confidence.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-white text-sm">Human-in-the-Loop</h4>
              <p className="text-slate-400 leading-relaxed">
                AI provides decision support and flags anomalies, while authorized Ministry officers retain final sign-off under Rule 14(b).
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                <Award className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-white text-sm">Merit Screening</h4>
              <p className="text-slate-400 leading-relaxed">
                Objective scoring engine compiles composite ranks across academics, research quality, and institution rating.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
                <TrendingUp className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-white text-sm">Direct PFMS Transfer</h4>
              <p className="text-slate-400 leading-relaxed">
                Seamless sanction management with automated monthly stipend dispatches to Aadhaar-seeded bank accounts.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
