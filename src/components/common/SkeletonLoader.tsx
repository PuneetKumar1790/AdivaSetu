import React from 'react';

export const TableSkeleton: React.FC<{ rows?: number; columns?: number }> = ({
  rows = 8,
  columns = 8,
}) => {
  return (
    <div className="w-full animate-pulse divide-y divide-slate-200">
      {Array.from({ length: rows }).map((_, rIdx) => (
        <div key={rIdx} className="py-4 px-4 flex items-center justify-between space-x-4">
          {Array.from({ length: columns }).map((_, cIdx) => (
            <div
              key={cIdx}
              className={`h-4 bg-slate-200 rounded ${
                cIdx === 0 ? 'w-28' : cIdx === 1 ? 'w-36' : cIdx === columns - 1 ? 'w-20' : 'w-24'
              }`}
            ></div>
          ))}
        </div>
      ))}
    </div>
  );
};

export const CardSkeleton: React.FC<{ count?: number }> = ({ count = 4 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="p-5 bg-white border border-slate-200 rounded-2xl animate-pulse space-y-3"
        >
          <div className="h-3.5 bg-slate-200 rounded w-1/2"></div>
          <div className="h-7 bg-slate-200 rounded w-3/4"></div>
          <div className="h-3 bg-slate-100 rounded w-1/3"></div>
        </div>
      ))}
    </div>
  );
};
