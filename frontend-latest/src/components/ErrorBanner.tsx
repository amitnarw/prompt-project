'use client';

import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorBannerProps {
  error: string;
  onRetry: () => void;
}

export const ErrorBanner: React.FC<ErrorBannerProps> = ({ error, onRetry }) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-6 bg-surface-container border-l-2 border-red-500/50 mb-8">
      <AlertCircle size={18} className="text-red-400 flex-shrink-0" />
      <div className="flex-grow">
        <p className="font-label text-xs uppercase tracking-widest text-red-400">Connection Error</p>
        <p className="text-sm text-on-surface-variant mt-1">{error} — Make sure the backend is running on port 5000.</p>
      </div>
      <button
        onClick={onRetry}
        className="ml-auto font-label text-xs uppercase tracking-widest text-tertiary hover:text-white transition-colors cursor-pointer flex-shrink-0"
      >
        Retry
      </button>
    </div>
  );
};
