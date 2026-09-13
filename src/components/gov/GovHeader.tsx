import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AshokaEmblem } from './AshokaEmblem';
import { useAuth } from '../../context/AuthContext';
import { LogIn, LogOut, User as UserIcon, Shield, Sparkles, Video } from 'lucide-react';

interface GovHeaderProps {
  onOpenRecorder?: () => void;
  onOpenDemoControls?: () => void;
}

export const GovHeader: React.FC<GovHeaderProps> = ({ onOpenRecorder, onOpenDemoControls }) => {
  const { user, isAuthenticated, role, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Left: Ministry Branding & Logo */}
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-3.5 group">
              <AshokaEmblem size={44} className="text-slate-800 group-hover:text-emerald-800 transition-colors" />
              <div className="border-l border-slate-300 pl-3.5">
                <div className="flex items-center space-x-2">
                  <span className="text-xl sm:text-2xl font-black tracking-tight text-[#0D3829]">
                    AdivaSetu
                  </span>
                  <span className="text-base sm:text-lg font-bold text-amber-700 font-hindi">
                    अदिवा सेतु
                  </span>
                </div>
                <div className="text-[11px] font-medium text-slate-500 tracking-wide flex items-center gap-1.5">
                  <span>Ministry of Tribal Affairs</span>
                  <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                  <span className="text-slate-400">Govt. of India</span>
                </div>
              </div>
            </Link>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Built-in Screen Recorder Button */}
            {onOpenRecorder && (
              <button
                onClick={onOpenRecorder}
                className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 transition-all shadow-2xs"
                title="Record Demo Video"
              >
                <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse"></span>
                <Video className="w-3.5 h-3.5" />
                <span>Demo Recorder</span>
              </button>
            )}

            {/* Quick Demo Controls launcher */}
            {onOpenDemoControls && (
              <button
                onClick={onOpenDemoControls}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-300 hover:bg-amber-100 transition-all shadow-2xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Demo Tour</span>
              </button>
            )}

            {isAuthenticated ? (
              <div className="flex items-center space-x-3 pl-2 border-l border-slate-200">
                <Link
                  to={role === 'officer' ? '/admin/dashboard' : '/applicant/dashboard'}
                  className="flex items-center space-x-2 p-1.5 rounded-lg hover:bg-slate-100 text-left transition-colors"
                >
                  <img
                    src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                    alt={user?.name}
                    className="w-8 h-8 rounded-full border border-emerald-800 object-cover"
                  />
                  <div className="hidden lg:block">
                    <p className="text-xs font-bold text-slate-800 leading-none">{user?.name}</p>
                    <span className="text-[10px] text-emerald-800 font-semibold uppercase tracking-wider">
                      {role === 'officer' ? 'Ministry Officer' : 'ST Applicant'}
                    </span>
                  </div>
                </Link>

                <button
                  onClick={() => {
                    logout();
                    navigate('/login');
                  }}
                  className="p-2 text-slate-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="flex items-center space-x-1.5 px-4 py-2 rounded-lg text-xs font-bold bg-[#0D3829] text-white hover:bg-[#16533D] transition-colors shadow-2xs"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Portal Login</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
