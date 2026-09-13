import React from 'react';
import { ShieldCheck, ExternalLink } from 'lucide-react';
import { AshokaEmblem } from './AshokaEmblem';

export const GovFooter: React.FC = () => {
  return (
    <footer className="bg-[#072319] text-slate-300 text-xs border-t-4 border-amber-600 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-emerald-950">
          {/* Col 1: About Platform */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center space-x-3">
              <AshokaEmblem size={36} className="text-amber-500" />
              <div>
                <h4 className="text-base font-bold text-white tracking-wide">
                  AdivaSetu (अदिवा सेतु)
                </h4>
                <p className="text-xs text-amber-500/90 font-medium">
                  Tribal Scholarship & Fellowship Digital Gateway
                </p>
              </div>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-lg">
              Designed for the Ministry of Tribal Affairs, Government of India. An AI-assisted, human-in-the-loop Digital Public Infrastructure platform empowering Scheduled Tribe scholars across India through transparent eligibility, automated verification, and Direct Benefit Transfer (DBT).
            </p>
            <div className="flex items-center space-x-2 text-[11px] text-emerald-400 bg-emerald-950/60 border border-emerald-900 px-3 py-1.5 rounded-lg w-fit">
              <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
              <span>Standardised under India Stack & e-Gov Standards</span>
            </div>
          </div>

          {/* Col 2: Schemes */}
          <div>
            <h5 className="font-bold text-white uppercase tracking-wider text-xs mb-3 text-amber-400">
              Key Schemes
            </h5>
            <ul className="space-y-2 text-slate-400">
              <li>
                <a href="#schemes" className="hover:text-amber-300 transition-colors">
                  National Fellowship for ST (NFST)
                </a>
              </li>
              <li>
                <a href="#schemes" className="hover:text-amber-300 transition-colors">
                  National Overseas Scholarship (NOS)
                </a>
              </li>
              <li>
                <a href="#schemes" className="hover:text-amber-300 transition-colors">
                  Top Class Education for ST Students
                </a>
              </li>
              <li>
                <a href="#schemes" className="hover:text-amber-300 transition-colors">
                  Post-Matric Scholarship for ST
                </a>
              </li>
              <li>
                <a href="#schemes" className="hover:text-amber-300 transition-colors">
                  Pre-Matric Scholarship for ST
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Institutional Links & Help */}
          <div>
            <h5 className="font-bold text-white uppercase tracking-wider text-xs mb-3 text-amber-400">
              Support & Guidelines
            </h5>
            <ul className="space-y-2 text-slate-400">
              <li>
                <span className="hover:text-amber-300 cursor-pointer">Toll-Free Helpline: 1800-11-7788</span>
              </li>
              <li>
                <span className="hover:text-amber-300 cursor-pointer">DigiLocker & Aadhaar e-KYC Guide</span>
              </li>
              <li>
                <span className="hover:text-amber-300 cursor-pointer">Ministry Officer Directory</span>
              </li>
              <li>
                <span className="hover:text-amber-300 cursor-pointer">State Tribal Welfare Departments</span>
              </li>
              <li>
                <span className="hover:text-amber-300 cursor-pointer">RTI & Grievance Redressal</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-3">
          <div>
            © 2026 Ministry of Tribal Affairs, Government of India. All Rights Reserved.
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-amber-400/80 bg-amber-950/40 border border-amber-800/60 px-2 py-0.5 rounded text-[10px] font-medium">
              National Hackathon Demonstration Prototype
            </span>
            <span className="text-slate-500">•</span>
            <span>Security Compliant</span>
            <span className="text-slate-500">•</span>
            <span>GIGW Guidelines Compliant</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
