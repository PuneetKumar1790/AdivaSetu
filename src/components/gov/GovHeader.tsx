import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { AdivaSetuLogo } from '../common/AdivaSetuLogo';
import {
  Compass,
  FileCheck2,
  Award,
  Sparkles,
  LogIn,
  LogOut,
  ChevronDown,
  Layers,
  Shield,
  Activity,
  User as UserIcon,
} from 'lucide-react';

interface GovHeaderProps {
  onOpenRecorder?: () => void;
  onOpenDemoControls?: () => void;
}

export const GovHeader: React.FC<GovHeaderProps> = ({ onOpenRecorder, onOpenDemoControls }) => {
  const { user, isAuthenticated, role, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-40 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center space-x-8">
            <Link to="/" className="group flex items-center">
              <AdivaSetuLogo size="sm" subtitle={true} />
            </Link>

            {/* Primary Nav Links */}
            <nav className="hidden md:flex items-center space-x-1 text-xs font-semibold text-slate-600">
              <Link
                to="/applicant/schemes"
                className={`px-3 py-2 rounded-lg transition-colors ${
                  isActive('/applicant/schemes')
                    ? 'text-emerald-700 bg-emerald-50/80'
                    : 'hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Schemes
              </Link>
              <Link
                to="/applicant/eligibility"
                className={`px-3 py-2 rounded-lg transition-colors ${
                  isActive('/applicant/eligibility')
                    ? 'text-emerald-700 bg-emerald-50/80'
                    : 'hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Eligibility Engine
              </Link>
              <Link
                to="/applicant/applications"
                className={`px-3 py-2 rounded-lg transition-colors ${
                  isActive('/applicant/applications')
                    ? 'text-emerald-700 bg-emerald-50/80'
                    : 'hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Applications
              </Link>
              <Link
                to="/applicant/fellowship"
                className={`px-3 py-2 rounded-lg transition-colors ${
                  isActive('/applicant/fellowship')
                    ? 'text-emerald-700 bg-emerald-50/80'
                    : 'hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                DBT & Sanctions
              </Link>
              {role === 'officer' && (
                <Link
                  to="/admin/dashboard"
                  className={`px-3 py-2 rounded-lg transition-colors ${
                    isActive('/admin')
                      ? 'text-emerald-800 bg-emerald-100/70 font-bold'
                      : 'text-amber-800 hover:bg-amber-50'
                  }`}
                >
                  Officer Console
                </Link>
              )}
            </nav>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center space-x-3">
            {/* Live System API status chip */}
            <div className="hidden lg:flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-[11px] font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Backend Connected</span>
            </div>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center space-x-2 p-1.5 pr-2.5 rounded-full hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
                >
                  <img
                    src={user?.avatar || '/aarav.jpg'}
                    alt={user?.name}
                    className="w-7 h-7 rounded-full object-cover border border-emerald-600"
                  />
                  <span className="text-xs font-semibold text-slate-800 hidden sm:inline">
                    {user?.name?.split(' ')[0]}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {profileDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-1.5 text-xs z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                    onMouseLeave={() => setProfileDropdownOpen(false)}
                  >
                    <div className="px-3.5 py-2.5 border-b border-slate-100">
                      <p className="font-bold text-slate-900">{user?.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                      <span className="inline-block mt-1 text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 uppercase">
                        {role === 'officer' ? 'Ministry Officer' : 'Scholar'}
                      </span>
                    </div>

                    <div className="py-1">
                      <Link
                        to={role === 'officer' ? '/admin/dashboard' : '/applicant/dashboard'}
                        className="block px-3.5 py-2 hover:bg-slate-50 text-slate-700 font-medium"
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        Dashboard
                      </Link>
                      <Link
                        to="/applicant/profile"
                        className="block px-3.5 py-2 hover:bg-slate-50 text-slate-700 font-medium"
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        Profile Settings
                      </Link>
                      <Link
                        to="/applicant/notifications"
                        className="block px-3.5 py-2 hover:bg-slate-50 text-slate-700 font-medium"
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        Notifications
                      </Link>
                    </div>

                    <div className="border-t border-slate-100 pt-1">
                      <button
                        onClick={() => {
                          logout();
                          navigate('/login');
                        }}
                        className="w-full text-left px-3.5 py-2 text-rose-600 hover:bg-rose-50 font-medium flex items-center space-x-1.5"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/applicant/schemes"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-[#0F172A] hover:bg-slate-800 text-white transition-all shadow-xs"
                >
                  Apply Now
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
