'use client';

import React from 'react';

export const LoadingSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
      {Array.from({ length: 9 }).map((_, i) => (
        <div key={i} className="bg-surface-container-low p-6 animate-pulse">
          <div className="h-3 w-20 bg-surface-container-highest mb-4 rounded" />
          <div className="h-6 w-3/4 bg-surface-container-highest mb-3 rounded" />
          <div className="h-4 w-full bg-surface-container-highest mb-2 rounded" />
          <div className="h-4 w-5/6 bg-surface-container-highest rounded" />
        </div>
      ))}
    </div>
  );
};
