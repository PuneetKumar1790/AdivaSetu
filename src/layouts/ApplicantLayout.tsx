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
  Compass,
  FileCheck2,
  FolderLock,
  AlertTriangle,
  Award,
  Bell,
  User,
  Sparkles,
  ChevronRight,
  LogOut,
  Menu,
  X,
  Search,
  Video,
} from 'lucide-react';

export const ApplicantLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const { notifications } = useApplication();
  const navigate = useNavigate();

  const [isRecorderOpen, setIsRecorderOpen] = useState(false);
  const [isDemoControlsOpen, setIsDemoControlsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const navLinks = [
    { to: '/applicant/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/applicant/schemes', label: 'Browse Schemes', icon: Compass },
    { to: '/applicant/eligibility', label: 'AI Eligibility Assistant', icon: Sparkles, highlight: true },
    { to: '/applicant/applications', label: 'My Applications', icon: FileCheck2 },
    { to: '/applicant/documents', label: 'Documents Vault', icon: FolderLock },
    { to: '/applicant/deficiencies', label: 'Deficiencies', icon: AlertTriangle, badge: '1 Action' },
    { to: '/applicant/fellowship', label: 'Award / Fellowship', icon: Award },
    { to: '/applicant/notifications', label: 'Notifications', icon: Bell, badgeCount: unreadCount },
    { to: '/applicant/profile', label: 'Scholar Profile', icon: User },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <GovTricolorBar />
      <GovHeader
        onOpenRecorder={() => setIsRecorderOpen(true)}
        onOpenDemoControls={() => setIsDemoControlsOpen(true)}
      />

      {/* Main portal grid: Sidebar + Content */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row gap-6">
        {/* Mobile menu button */}
        <div className="md:hidden flex items-center justify-between p-3 bg-white border border-slate-200 rounded-xl shadow-xs">
          <div className="flex items-center space-x-2">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100'}
              alt={user?.name}
              className="w-8 h-8 rounded-full border border-emerald-800"
            />
            <span className="text-xs font-bold text-slate-800">{user?.name}</span>
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Sidebar */}
        <aside
          className={`md:w-64 shrink-0 space-y-4 ${
            mobileMenuOpen ? 'block' : 'hidden md:block'
          }`}
        >
          {/* User badge card */}
          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center space-x-3">
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100'}
                alt={user?.name}
                className="w-12 h-12 rounded-full border-2 border-[#0D3829] object-cover shadow-xs"
              />
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-bold text-slate-900 truncate">{user?.name}</h3>
                <span className="inline-block text-[10px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                  ST Scholar (Gond)
                </span>
              </div>
            </div>
            <div className="text-[11px] text-slate-500 font-mono pt-2 border-t border-slate-100 flex justify-between">
              <span>Scholar ID:</span>
              <span className="font-bold text-slate-700">ST-2026-9281</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-2.5 space-y-1">
            <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Scholar Portal
            </div>
            {navLinks.map((item) => {
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
                        : item.highlight
                        ? 'text-amber-800 hover:bg-amber-50/80 bg-amber-50/30'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`
                  }
                >
                  <div className="flex items-center space-x-2.5">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                      {item.badge}
                    </span>
                  )}
                  {item.badgeCount !== undefined && item.badgeCount > 0 && (
                    <span className="w-5 h-5 rounded-full text-[10px] font-bold bg-rose-600 text-white flex items-center justify-center">
                      {item.badgeCount}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </div>

          {/* Direct Benefit Transfer card */}
          <div className="p-4 bg-gradient-to-br from-emerald-900 to-[#072319] rounded-2xl text-white space-y-2 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold tracking-wider text-amber-400 uppercase">
                Aadhaar DBT Gateway
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>
            <p className="text-xs text-emerald-100/90 leading-snug">
              Direct Benefit Transfer active for Bank A/C ****4821 (SBI JNU Branch).
            </p>
            <div className="text-[10px] text-emerald-300/70 font-mono">
              Status: Aadhaar NPCI Linked
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
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
