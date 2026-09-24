import React from 'react';
import { ShieldCheck, ExternalLink, Activity, HeartHandshake } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AdivaSetuLogo } from '../common/AdivaSetuLogo';

export const GovFooter: React.FC = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 pb-12 border-b border-slate-800/80">
          {/* Brand & Mission */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="inline-block">
              <AdivaSetuLogo size="sm" light={true} subtitle={true} />
            </Link>

            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              Empowering Scheduled Tribe researchers and scholars across 20 priority states through transparent AI-assisted document scrutiny, merit ranking, and direct benefit disbursement.
            </p>

            <div className="flex items-center space-x-2 text-[11px] text-emerald-400 bg-emerald-950/40 border border-emerald-900/60 px-3 py-1.5 rounded-lg w-fit">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>PFMS & DigiLocker Digital Infrastructure Ready</span>
            </div>
          </div>

          {/* Col 2: Schemes */}
          <div>
            <h5 className="font-semibold text-white uppercase tracking-wider text-[11px] mb-4">
              Fellowship Schemes
            </h5>
            <ul className="space-y-2.5 text-slate-400">
              <li>
                <Link to="/applicant/schemes" className="hover:text-emerald-400 transition-colors">
                  National Fellowship for ST (NFST)
                </Link>
              </li>
              <li>
                <Link to="/applicant/schemes" className="hover:text-emerald-400 transition-colors">
                  National Overseas Scholarship (NOS)
                </Link>
              </li>
              <li>
                <Link to="/applicant/schemes" className="hover:text-emerald-400 transition-colors">
                  Top Class Education for ST (TCE)
                </Link>
              </li>
              <li>
                <Link to="/applicant/schemes" className="hover:text-emerald-400 transition-colors">
                  Post-Matric Scholarship (PMS)
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Portal Tools */}
          <div>
            <h5 className="font-semibold text-white uppercase tracking-wider text-[11px] mb-4">
              Portals & Tools
            </h5>
            <ul className="space-y-2.5 text-slate-400">
              <li>
                <Link to="/applicant/eligibility" className="hover:text-emerald-400 transition-colors">
                  Eligibility Evaluation Engine
                </Link>
              </li>
              <li>
                <Link to="/applicant/applications" className="hover:text-emerald-400 transition-colors">
                  Application Tracker
                </Link>
              </li>
              <li>
                <Link to="/applicant/fellowship" className="hover:text-emerald-400 transition-colors">
                  PFMS Disbursement Ledger
                </Link>
              </li>
              <li>
                <Link to="/admin/dashboard" className="hover:text-emerald-400 transition-colors">
                  Ministry Officer Console
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Platform & Support */}
          <div>
            <h5 className="font-semibold text-white uppercase tracking-wider text-[11px] mb-4">
              System Support
            </h5>
            <ul className="space-y-2.5 text-slate-400">
              <li className="flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>API Status: Operational</span>
              </li>
              <li>Helpdesk: help@adivasetu.gov.in</li>
              <li>Toll Free: 1800-11-7788</li>
              <li>Mon – Fri: 09:30 AM to 06:00 PM</li>
            </ul>
          </div>
        </div>

        {/* Bottom row */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} AdivaSetu. Ministry of Tribal Affairs, Government of India.
          </div>
          <div className="flex items-center space-x-6">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-400 cursor-pointer">Security Standards</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
