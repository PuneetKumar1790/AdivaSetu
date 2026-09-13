import React from 'react';
import { ApplicationStatus } from '../../types';

interface StatusBadgeProps {
  status: ApplicationStatus | string;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm',
  }[size];

  const getStyle = () => {
    switch (status) {
      case 'Draft':
        return 'bg-slate-100 text-slate-700 border-slate-300';
      case 'Submitted':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Verification':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200 animate-pulse-slow';
      case 'Deficient':
        return 'bg-amber-50 text-amber-800 border-amber-300 font-bold';
      case 'Resubmitted':
        return 'bg-cyan-50 text-cyan-800 border-cyan-300';
      case 'Scrutiny':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Screening':
        return 'bg-orange-50 text-orange-800 border-orange-200';
      case 'Shortlisted':
        return 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold';
      case 'Selected':
      case 'Approved':
        return 'bg-green-100 text-green-900 border-green-400 font-black';
      case 'Rejected':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border shadow-2xs ${sizeClasses} ${getStyle()}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          status === 'Deficient'
            ? 'bg-amber-600'
            : status === 'Approved' || status === 'Selected' || status === 'Shortlisted'
            ? 'bg-emerald-600'
            : status === 'Rejected'
            ? 'bg-rose-600'
            : 'bg-indigo-600'
        }`}
      ></span>
      <span>{status}</span>
    </span>
  );
};
