import React from 'react';
import { Link } from 'react-router-dom';
import { useApplication } from '../../context/ApplicationContext';
import { formatDateTime } from '../../utils/formatters';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Info,
  Sparkles,
  ChevronRight,
  CheckCheck,
} from 'lucide-react';

export const NotificationsPage: React.FC = () => {
  const { notifications, markNotificationRead } = useApplication();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            Alerts & Dispatches
          </span>
          <h1 className="text-xl font-bold text-slate-900 mt-1">Notification Center</h1>
          <p className="text-xs text-slate-500 font-hindi">
            अधिसूचना केंद्र एवं मंत्रालय पत्राचार
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs text-slate-500">
          <Bell className="w-4 h-4 text-slate-400" />
          <span>{notifications.filter((n) => !n.read).length} unread alerts</span>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {notifications.map((notif) => {
          const Icon =
            notif.type === 'celebration'
              ? Sparkles
              : notif.type === 'warning'
              ? AlertTriangle
              : notif.type === 'success'
              ? CheckCircle2
              : Info;

          return (
            <div
              key={notif.id}
              className={`p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                !notif.read
                  ? 'bg-white border-emerald-300 shadow-sm ring-1 ring-emerald-100'
                  : 'bg-slate-50/70 border-slate-200'
              }`}
            >
              <div className="flex items-start space-x-3.5">
                <div
                  className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${
                    notif.type === 'celebration'
                      ? 'bg-amber-100 text-amber-700'
                      : notif.type === 'warning'
                      ? 'bg-rose-100 text-rose-700'
                      : notif.type === 'success'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-blue-100 text-blue-700'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-sm font-bold text-slate-900">{notif.title}</h3>
                    {!notif.read && (
                      <span className="w-2 h-2 rounded-full bg-emerald-700"></span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
                    {notif.message}
                  </p>
                  <div className="text-[10px] text-slate-400 font-mono">
                    {formatDateTime(notif.timestamp)}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                {notif.actionUrl && (
                  <Link
                    to={notif.actionUrl}
                    onClick={() => markNotificationRead(notif.id)}
                    className="flex items-center space-x-1 px-4 py-2 rounded-xl text-xs font-bold bg-[#0D3829] hover:bg-[#16533D] text-white transition-colors"
                  >
                    <span>{notif.actionLabel || 'View'}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                )}
                {!notif.read && (
                  <button
                    onClick={() => markNotificationRead(notif.id)}
                    className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60 transition-colors"
                    title="Mark as read"
                  >
                    <CheckCheck className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
