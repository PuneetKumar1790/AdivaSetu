import React from 'react';
import { useApiActivity } from '../../services/events/eventBus';
import { Server, Activity } from 'lucide-react';

export const RequestActivityIndicator: React.FC = () => {
  const { isRequestActive, activeLabel } = useApiActivity();

  if (!isRequestActive) return null;

  return (
    <>
      {/* Top subtle indeterminate progress bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-0.5 bg-emerald-100 overflow-hidden pointer-events-none">
        <div className="h-full bg-emerald-600 animate-[pulse_1s_ease-in-out_infinite] w-full"></div>
      </div>

      {/* Floating corner indicator */}
      <div className="fixed bottom-4 right-4 z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
        <div className="bg-[#072319] text-white px-3 py-1.5 rounded-full shadow-lg border border-emerald-700/50 flex items-center space-x-2 text-xs font-medium backdrop-blur-md">
          <Activity className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
          <span className="font-mono text-[11px] text-emerald-200">{activeLabel}</span>
        </div>
      </div>
    </>
  );
};
