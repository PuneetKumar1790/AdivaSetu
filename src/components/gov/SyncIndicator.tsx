import React, { useState, useEffect } from 'react';
import { RefreshCw, CheckCircle2, Wifi, Radio } from 'lucide-react';
import { browserDb } from '../../services/db/browserDb';
import { useApiActivity } from '../../services/events/eventBus';

interface SyncIndicatorProps {
  showLiveStream?: boolean;
  onManualSync?: () => void;
  className?: string;
}

export const SyncIndicator: React.FC<SyncIndicatorProps> = ({
  showLiveStream = true,
  onManualSync,
  className = '',
}) => {
  const { isRequestActive, activeLabel } = useApiActivity();
  const [lastSyncTime, setLastSyncTime] = useState<string>('Just now');
  const [isRotating, setIsRotating] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const settings = browserDb.getSystemSettings();
      if (!settings.lastSynchronizedAt) {
        setLastSyncTime('Just now');
        return;
      }
      const syncDate = new Date(settings.lastSynchronizedAt);
      const timeStr = syncDate.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      });
      setLastSyncTime(timeStr);
    };

    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, [isRequestActive]);

  const handleManualSync = () => {
    setIsRotating(true);
    browserDb.touchSync();
    if (onManualSync) {
      onManualSync();
    }
    setTimeout(() => {
      setIsRotating(false);
      setLastSyncTime(new Date().toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      }));
    }, 800);
  };

  return (
    <div className={`flex items-center space-x-2.5 text-[11px] ${className}`}>
      {/* Live WebSocket Simulation Badge */}
      {showLiveStream && (
        <div className="hidden sm:flex items-center space-x-1.5 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-800 font-medium">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
          </span>
          <span className="font-mono text-[10px] tracking-tight">Live stream active</span>
        </div>
      )}

      {/* Sync Status Text */}
      <div className="flex items-center space-x-1.5 text-slate-600 bg-slate-100/80 px-2.5 py-1 rounded-lg border border-slate-200">
        {isRequestActive || isRotating ? (
          <>
            <RefreshCw className="w-3 h-3 text-amber-600 animate-spin" />
            <span className="text-amber-800 font-medium truncate max-w-[140px]">
              Syncing with Gateway...
            </span>
          </>
        ) : (
          <>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
            <span className="text-slate-500">
              Synchronized: <strong className="text-slate-700 font-mono">{lastSyncTime}</strong>
            </span>
          </>
        )}

        {/* Sync trigger button */}
        <button
          onClick={handleManualSync}
          disabled={isRequestActive || isRotating}
          title="Force Gateway Re-sync"
          className="p-0.5 text-slate-400 hover:text-emerald-800 hover:bg-slate-200 rounded transition-colors"
        >
          <RefreshCw className={`w-2.5 h-2.5 ${isRotating ? 'animate-spin' : ''}`} />
        </button>
      </div>
    </div>
  );
};
