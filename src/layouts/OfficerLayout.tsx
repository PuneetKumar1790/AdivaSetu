import React, { useState } from 'react';
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import { GovTricolorBar } from '../components/gov/GovTricolorBar';
import { GovHeader } from '../components/gov/GovHeader';
import { GovFooter } from '../components/gov/GovFooter';
import { DemoVideoRecorderModal } from '../components/recorder/DemoVideoRecorderModal';
import { DemoScenarioControls } from '../components/demo/DemoScenarioControls';
import { useAuth } from '../context/AuthContext';
import { useApplication } from '../context/ApplicationContext';
import {
  LayoutDashboard,
  Inbox,
  Sparkles,
  FileSearch,
  ListOrdered,
  Award,
  Send,
  BarChart3,
  Sliders,
  History,
  Shield,
  Menu,
  X,
  Search,
} from 'lucide-react';

export const OfficerLayout: React.FC = () => {
  const { user } = useAuth();
  const { applications } = useApplication();

  const [isRecorderOpen, setIsRecorderOpen] = useState(false);
  const [isDemoControlsOpen, setIsDemoControlsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrutinyCount = applications.filter((a) => a.status === 'Scrutiny' || a.status === 'Resubmitted').length;
  const deficientCount = applications.filter((a) => a.status === 'Deficient').length;

  const adminNav = [
    { to: '/admin/dashboard', label: 'Operations Dashboard', icon: LayoutDashboard },
    { to: '/admin/applications', label: 'All Applications', icon: Inbox, count: applications.length },
    { to: '/admin/verification', label: 'AI Verification Queue', icon: Sparkles, badge: 'AI Batch' },
    { to: '/admin/scrutiny', label: 'Officer Scrutiny', icon: FileSearch, count: scrutinyCount, alert: true },
    { to: '/admin/screening', label: 'Merit Screening', icon: ListOrdered },
    { to: '/admin/selection', label: 'Sanction & Awards', icon: Award },
    { to: '/admin/communications', label: 'Communication Center', icon: Send },
    { to: '/admin/analytics', label: 'State-wise Analytics', icon: BarChart3 },
    { to: '/admin/schemes', label: 'Scheme Configuration', icon: Sliders },
    { to: '/admin/audit', label: 'Digital Audit Logs', icon: History },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      <GovTricolorBar />
      <GovHeader
        onOpenRecorder={() => setIsRecorderOpen(true)}
        onOpenDemoControls={() => setIsDemoControlsOpen(true)}
      />

      {/* Ministry Operations Sub-header */}
      <div className="bg-[#072319] text-white border-b border-emerald-900 px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4 text-amber-400" />
            <span className="font-bold tracking-wide">
              MINISTRY OPERATIONS PORTAL | अनुसूचित जनजाति अधिछात्रवृत्ति प्रशासन
            </span>
          </div>
          <div className="flex items-center space-x-3 text-[11px] text-emerald-200">
            <span>Official Portal Session Active</span>
            <span className="text-slate-500">•</span>
            <span className="font-mono text-amber-300">Auth Token: MOTA-SEC-8941</span>
          </div>
        </div>
      </div>

      {/* Layout Grid */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row gap-6">
        {/* Mobile toggle */}
        <div className="md:hidden flex items-center justify-between p-3 bg-white border border-slate-200 rounded-xl">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-slate-800">Ministry Navigation</span>
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-700"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Sidebar */}
        <aside className={`md:w-64 shrink-0 space-y-4 ${mobileMenuOpen ? 'block' : 'hidden md:block'}`}>
          {/* Officer Profile Card */}
          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center space-x-3">
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100'}
                alt={user?.name}
                className="w-12 h-12 rounded-full border-2 border-amber-600 object-cover"
              />
              <div className="min-w-0 flex-1">
                <h3 className="text-xs font-bold text-slate-900 truncate">{user?.name}</h3>
                <p className="text-[10px] text-slate-500 font-medium">Deputy Secretary</p>
                <span className="inline-block text-[9px] font-bold text-amber-800 bg-amber-50 border border-amber-300 px-1.5 py-0.2 rounded mt-0.5">
                  Authorized Officer
                </span>
              </div>
            </div>
            <div className="text-[10px] text-slate-500 border-t border-slate-100 pt-2 font-mono">
              Division: Higher Education & Fellowships
            </div>
          </div>

          {/* Links */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-2.5 space-y-1">
            <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Operations Menu
            </div>
            {adminNav.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-[#0D3829] text-white shadow-xs'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`
                  }
                >
                  <div className="flex items-center space-x-2.5">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {item.count !== undefined && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        item.alert
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {item.count}
                    </span>
                  )}
                  {item.badge && (
                    <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-emerald-100 text-emerald-800">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </div>

          {/* Quick Demo Switcher */}
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs space-y-2">
            <div className="font-bold text-amber-950 flex items-center justify-between">
              <span>Demo Scenario</span>
              <span className="text-[10px] text-amber-700">Hackathon</span>
            </div>
            <p className="text-[11px] text-amber-800">
              Easily evaluate Aarav Kumar's application in the Scrutiny queue.
            </p>
            <button
              onClick={() => setIsDemoControlsOpen(true)}
              className="w-full py-1.5 bg-amber-700 hover:bg-amber-800 text-white rounded font-bold text-[11px] transition-colors"
            >
              Open Scenario Controls
            </button>
          </div>
        </aside>

        {/* Admin Content Area */}
        <main className="flex-1 min-w-0">
          <Outlet />
        </main>
      </div>

      <GovFooter />

      {/* Global Modals */}
      <DemoVideoRecorderModal isOpen={isRecorderOpen} onClose={() => setIsRecorderOpen(false)} />
      <DemoScenarioControls isOpen={isDemoControlsOpen} onClose={() => setIsDemoControlsOpen(false)} />
    </div>
  );
};
