import React from 'react';
import { AlertTriangle, RefreshCw, ShieldAlert } from 'lucide-react';
import { apiConfig } from '../../services/api/apiConfig';

interface ErrorRetryBannerProps {
  error: Error | string | null;
  onRetry: () => void;
  title?: string;
  className?: string;
}

export const ErrorRetryBanner: React.FC<ErrorRetryBannerProps> = ({
  error,
  onRetry,
  title = 'Ministry Registry Synchronization Failed',
  className = '',
}) => {
  if (!error) return null;

  const errorMessage = typeof error === 'string' ? error : error.message;

  const handleRetry = () => {
    // Clear simulated error if present so retry deterministically succeeds
    apiConfig.clearSimulatedError();
    onRetry();
  };

  return (
    <div
      className={`bg-rose-50 border border-rose-300 rounded-2xl p-4.5 sm:p-5 text-rose-950 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${className}`}
    >
      <div className="flex items-start space-x-3.5">
        <div className="p-2 rounded-xl bg-rose-200 text-rose-800 shrink-0 mt-0.5">
          <ShieldAlert className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-rose-900">{title}</h4>
          <p className="text-xs text-rose-700 mt-0.5 font-mono">{errorMessage}</p>
          <p className="text-[11px] text-rose-600/80 mt-1">
            Data transmission timed out or registry service returned a transient status. Click Retry to re-establish connection.
          </p>
        </div>
      </div>

      <button
        onClick={handleRetry}
        className="shrink-0 px-4 py-2 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs shadow-xs transition-colors flex items-center space-x-2 cursor-pointer"
      >
        <RefreshCw className="w-3.5 h-3.5" />
        <span>Retry Synchronization</span>
      </button>
    </div>
  );
};
