'use client';

import { ShieldCheck } from 'lucide-react';

interface VerifiedBadgeProps {
  className?: string;
}

export function VerifiedBadge({ className }: VerifiedBadgeProps) {
  return (
    <span
      title="Verified Prompt"
      className={className}
    >
      <ShieldCheck className="h-4 w-4 text-blue-500" />
    </span>
  );
}
