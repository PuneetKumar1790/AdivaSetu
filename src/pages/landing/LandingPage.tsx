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
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0D3829] via-[#0A2E22] to-[#072319] text-white py-20 px-4 sm:px-6 lg:px-8 border-b-4 border-amber-600">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Ministry of Tribal Affairs • Digital Public Infrastructure</span>
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
                AdivaSetu <span className="text-amber-400 block font-hindi text-3xl sm:text-5xl mt-1">अदिवा सेतु</span>
              </h1>
              <p className="text-lg sm:text-xl font-medium text-emerald-200">
                One digital platform for Tribal scholarship and fellowship administration.
              </p>
            </div>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
              From preliminary eligibility to multi-stage AI document verification, officer scrutiny, merit screening, and DBT disbursement — bringing the complete scholar journey into one transparent, human-in-the-loop workflow.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="#schemes"
                className="flex items-center space-x-2 px-6 py-3 rounded-xl text-sm font-bold bg-amber-500 text-slate-950 hover:bg-amber-400 transition-all shadow-lg hover:shadow-amber-500/20 active:scale-95"
              >
                <span>Explore Schemes</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <Link
                to="/login"
                className="flex items-center space-x-2 px-6 py-3 rounded-xl text-sm font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all active:scale-95 backdrop-blur-xs"
              >
                <span>Portal Login</span>
              </Link>

              <button
                onClick={handleStartAaravDemo}
                className="flex items-center space-x-2 px-6 py-3 rounded-xl text-sm font-bold bg-emerald-800/80 hover:bg-emerald-700 text-emerald-100 border border-emerald-600/50 transition-all shadow-md active:scale-95"
              >
                <Play className="w-4 h-4 text-emerald-300 fill-current" />
                <span>Launch Demo Story</span>
              </button>
            </div>

            {/* Micro Highlights */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-emerald-900/80 text-xs">
              <div>
                <div className="text-xl font-black text-amber-400">₹1,240+ Cr</div>
                <div className="text-slate-300 text-[11px]">Direct Benefit Outlay</div>
              </div>
              <div>
                <div className="text-xl font-black text-emerald-300">1.4 Lakh+</div>
                <div className="text-slate-300 text-[11px]">ST Scholars Enabled</div>
              </div>
              <div>
                <div className="text-xl font-black text-amber-300">98.4%</div>
                <div className="text-slate-300 text-[11px]">On-Time DBT Sanction</div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Quick Journey Card */}
          <div className="lg:col-span-5 bg-white/5 border border-white/15 rounded-3xl p-6 backdrop-blur-md shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                End-to-End Digital Pipeline
              </span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                AI + Human Oversight
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-white/10 rounded-xl flex items-center justify-between border border-white/10">
                <div className="flex items-center space-x-3">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                    1
                  </div>
                  <div>
                    <div className="font-bold text-white">AI Eligibility Assistant</div>
                    <div className="text-[11px] text-slate-300">Pre-check criteria before filling forms</div>
                  </div>
                </div>
                <span className="text-emerald-400 font-bold text-[11px]">✓ Instant</span>
              </div>

              <div className="p-3 bg-white/10 rounded-xl flex items-center justify-between border border-white/10">
                <div className="flex items-center space-x-3">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                    2
                  </div>
                  <div>
                    <div className="font-bold text-white">Document Intelligence</div>
                    <div className="text-[11px] text-slate-300">7-stage OCR and seal verification</div>
                  </div>
                </div>
                <span className="text-emerald-400 font-bold text-[11px]">98.4% Match</span>
              </div>

              <div className="p-3 bg-white/10 rounded-xl flex items-center justify-between border border-white/10">
                <div className="flex items-center space-x-3">
                  <div className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-300 flex items-center justify-center font-bold">
                    3
                  </div>
                  <div>
                    <div className="font-bold text-white">Officer Scrutiny Queue</div>
                    <div className="text-[11px] text-slate-300">Side-by-side review & clarification</div>
                  </div>
                </div>
                <span className="text-amber-300 font-bold text-[11px]">Human Touch</span>
              </div>

              <div className="p-3 bg-white/10 rounded-xl flex items-center justify-between border border-white/10">
                <div className="flex items-center space-x-3">
                  <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold">
                    4
                  </div>
                  <div>
                    <div className="font-bold text-white">Merit Screening & DBT</div>
                    <div className="text-[11px] text-slate-300">Configurable criteria & digital awards</div>
                  </div>
                </div>
                <span className="text-emerald-400 font-bold text-[11px]">Direct Bank</span>
              </div>
            </div>

            <button
              onClick={handleStartAaravDemo}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-2"
            >
              <span>Experience Interactive Demo</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Pillars Section: One Platform. Complete Journey. */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
            Complete Digital Journey
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            One Platform. Complete Tribal Scholar Lifecycle.
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Eliminating administrative bottlenecks and paper-based scrutiny across all central tribal schemes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[
            {
              step: '01',
              title: 'Application',
              sub: 'Aadhaar e-KYC and 10-step digital wizard with auto-draft saves.',
              icon: FileCheck2,
            },
            {
              step: '02',
              title: 'AI Verification',
              sub: 'Multilingual OCR extraction, DigiLocker match, and tamper check.',
              icon: Cpu,
            },
            {
              step: '03',
              title: 'Officer Scrutiny',
              sub: 'Intelligent deficiency detection and instant applicant resubmission.',
              icon: Search,
            },
            {
              step: '04',
              title: 'Merit Selection',
              sub: 'Dynamic weighted rankings tailored to scheme guidelines.',
              icon: Layers,
            },
            {
              step: '05',
              title: 'DBT Sanction',
              sub: 'Digital award letter generation and Aadhaar PFMS tracking.',
              icon: Award,
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-700 hover:shadow-md transition-all space-y-3 relative group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-black text-amber-700">{item.step}</span>
                  <div className="p-2 rounded-lg bg-emerald-50 text-emerald-800 group-hover:bg-emerald-800 group-hover:text-white transition-colors">
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="text-sm font-bold text-slate-800">{item.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{item.sub}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* AI Intelligence & Transparency Section */}
      <section className="bg-slate-100 py-16 px-4 sm:px-6 lg:px-8 border-y border-slate-200">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-5">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
              Responsible AI Architecture
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              AI Decision Support with Uncompromising Human Oversight
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              AdivaSetu is engineered to reduce administrative manual burden by up to 90% while keeping sovereign decision authority firmly with the Ministry Officers.
            </p>

            <div className="space-y-3 text-xs">
              {[
                { title: 'Multilingual OCR Extraction', desc: 'Reads state revenue certificates, seals, and marksheet transcripts.' },
                { title: 'DigiLocker / e-Pramaan Database Verification', desc: 'Direct cryptographic check against state digital repositories.' },
                { title: 'Proactive Deficiency Identification', desc: 'Highlights expired income papers and mismatched initials before final review.' },
                { title: 'Explainable AI Recommendation Scores', desc: 'Every recommendation includes full factor rationale and confidence metric.' },
              ].map((feat, i) => (
                <div key={i} className="flex items-start space-x-3 p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-slate-800">{feat.title}</h4>
                    <p className="text-slate-500 text-[11px] mt-0.5">{feat.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Graphical Mock AI Scrutiny Showcase */}
          <div className="bg-white rounded-2xl p-6 border border-slate-300 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 bg-emerald-100 text-emerald-800 rounded-md">
                  <Cpu className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Live AI Scrutiny Terminal</h4>
                  <span className="text-[10px] text-slate-500 font-mono">Sample: ADVS-NFST-2026-00482</span>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Confidence: 96.2%
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="text-slate-500 text-[11px]">Document Completeness</div>
                <div className="text-base font-bold text-emerald-800">100% (7 of 7)</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="text-slate-500 text-[11px]">Field Consistency</div>
                <div className="text-base font-bold text-emerald-800">98.6% Match</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="text-slate-500 text-[11px]">Duplicate Risk</div>
                <div className="text-base font-bold text-slate-700">Low (0 matches)</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="text-slate-500 text-[11px]">Anomaly Risk</div>
                <div className="text-base font-bold text-slate-700">Low (0 flags)</div>
              </div>
            </div>

            <div className="p-3 bg-emerald-50/80 border border-emerald-200 rounded-xl text-xs space-y-1">
              <div className="font-bold text-emerald-950 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                <span>AI Recommendation: Recommend for human approval</span>
              </div>
              <p className="text-[11px] text-emerald-900 opacity-90 leading-relaxed">
                All mandatory documents verified. Identity and academic records match 100%. Ready for Officer digital signature.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Available Schemes Catalog (Requirement 10) */}
      <section id="schemes" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
              Scheme Directory
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Available Tribal Scholarships & Fellowships
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Explore open schemes, verify your eligibility with AI, and submit your application online.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search scheme name or code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700"
            />
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-2 text-xs">
          {[
            { id: 'all', label: 'All Schemes' },
            { id: 'fellowship', label: 'Research Fellowships' },
            { id: 'overseas', label: 'Overseas Studies' },
            { id: 'scholarship', label: 'Premier Institutions (IIT/IIM/NIT)' },
            { id: 'domestic', label: 'Pre & Post-Matric' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-full font-semibold transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-[#0D3829] text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Scheme Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSchemes.map((scheme) => (
            <div
              key={scheme.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-lg hover:border-emerald-700 transition-all flex flex-col justify-between overflow-hidden"
            >
              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between gap-2">
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-bold bg-amber-50 text-amber-800 border border-amber-300">
                    {scheme.code}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                    Open for 2026-27
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    {scheme.name}
                  </h3>
                  <p className="text-xs text-amber-800 font-hindi mt-0.5">
                    {scheme.hindiName}
                  </p>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                  {scheme.description}
                </p>

                <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Stipend / Assistance:</span>
                    <span className="font-bold text-slate-900 text-right">{scheme.stipendAmount}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Target Group:</span>
                    <span className="font-medium text-slate-800 text-right">{scheme.educationLevel}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Deadline:</span>
                    <span className="font-bold text-amber-700">{scheme.deadline}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-100 grid grid-cols-2 gap-2">
                <Link
                  to="/applicant/eligibility"
                  className="flex items-center justify-center space-x-1 py-2 px-3 rounded-lg text-xs font-bold bg-amber-100 hover:bg-amber-200 text-amber-900 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                  <span>Check Eligibility</span>
                </Link>

                <Link
                  to="/applicant/application/new"
                  className="flex items-center justify-center space-x-1 py-2 px-3 rounded-lg text-xs font-bold bg-[#0D3829] hover:bg-[#16533D] text-white transition-colors"
                >
                  <span>Apply Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
