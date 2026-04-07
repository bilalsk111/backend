import React from "react";

/**
 * High-end Skeleton Loader for the Arena
 * Matches the 9/10 "Command Center" aesthetic
 */
const ArenaSkeleton = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-16 space-y-16 animate-pulse">
      
      {/* Header Skeleton */}
      <header className="space-y-6">
        <div className="h-6 w-48 bg-white/[0.03] border border-white/[0.08] rounded-full" />
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="h-16 w-full max-w-xl bg-zinc-800/40 rounded-2xl" />
          <div className="h-20 w-full max-w-md bg-zinc-900/40 rounded-2xl border border-white/[0.05]" />
        </div>
      </header>

      {/* Competition Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative">
        {[1, 2].map((i) => (
          <div 
            key={i} 
            className="h-[600px] rounded-[32px] bg-[#111113] border border-white/[0.05] p-6 flex flex-col space-y-6"
          >
            {/* Card Top */}
            <div className="flex justify-between items-start">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-2xl bg-zinc-800/60" />
                <div className="space-y-2">
                  <div className="h-3 w-20 bg-zinc-800/60 rounded" />
                  <div className="h-5 w-32 bg-zinc-800/60 rounded" />
                </div>
              </div>
              <div className="h-12 w-16 bg-zinc-800/60 rounded-xl" />
            </div>

            {/* Code Block Skeleton with Shimmer */}
            <div className="flex-grow rounded-2xl bg-[#0c0c0e] border border-white/[0.08] relative overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
               <div className="p-6 space-y-4">
                  <div className="h-4 w-[90%] bg-zinc-800/40 rounded" />
                  <div className="h-4 w-[70%] bg-zinc-800/40 rounded" />
                  <div className="h-4 w-[85%] bg-zinc-800/40 rounded" />
                  <div className="h-4 w-[40%] bg-zinc-800/40 rounded" />
               </div>
            </div>
          </div>
        ))}
      </div>

      {/* Judge Insight Skeleton */}
      <div className="h-64 rounded-[32px] bg-zinc-900/50 border border-white/[0.08] p-10 flex gap-8">
        <div className="w-1/3 space-y-6">
          <div className="h-8 w-48 bg-zinc-800/60 rounded-lg" />
          <div className="h-20 w-full bg-zinc-800/30 rounded-xl" />
        </div>
        <div className="flex-1 bg-white/[0.02] rounded-2xl border border-white/[0.05]" />
      </div>
    </div>
  );
};

export default ArenaSkeleton;