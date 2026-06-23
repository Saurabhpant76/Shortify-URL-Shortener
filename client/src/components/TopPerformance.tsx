import React from 'react';

interface TopPerformanceProps {
  clicks: number;
  shortPath: string;
  isLoading?: boolean;
}

const TopPerformance: React.FC<TopPerformanceProps> = ({ clicks, shortPath, isLoading }) => {
  return (
    <div className="bg-[#1a1d27] border border-slate-800 rounded-xl p-6 flex flex-col min-h-[200px]">
      <div className="flex items-center gap-2 mb-6">
        <h3 className="font-bold text-slate-200">Top Performance</h3>
      </div>

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <span className="text-slate-500 animate-pulse">Loading live data...</span>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center">
          {/* Live Count */}
          <div className="text-5xl font-bold text-white mb-2 transition-all duration-300">
            {clicks}
          </div>
          <p className="text-xs text-slate-500 uppercase tracking-widest mb-6">
            Total Clicks
          </p>

          {/* Short Link Badge */}
          <div className="bg-slate-800/50 text-slate-300 px-3 py-1 rounded-md text-sm border border-slate-700">
            /{shortPath}
          </div>
        </div>
      )}
    </div>
  );
};

export default TopPerformance;