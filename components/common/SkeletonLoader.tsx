import React from 'react';

export const SkeletonLoader: React.FC = () => {
  return (
    <div role="status" className="p-4 space-y-4 animate-shimmer bg-gradient-to-r from-transparent via-black/50 to-transparent bg-[length:200%_100%]">
      <div className="h-4 bg-[#00ff41]/20 rounded w-3/4"></div>
      <div className="h-4 bg-[#00ff41]/20 rounded"></div>
      <div className="h-4 bg-[#00ff41]/20 rounded"></div>
      <div className="h-4 bg-[#00ff41]/20 rounded w-5/6"></div>
       <div className="h-4 bg-[#00ff41]/20 rounded w-1/2"></div>
       <div className="h-4 bg-[#00ff41]/20 rounded w-3/4"></div>
       <div className="h-4 bg-[#00ff41]/20 rounded"></div>
       <div className="h-4 bg-[#00ff41]/20 rounded w-4/6"></div>
      <span className="sr-only">Loading...</span>
    </div>
  );
};