'use client';

import React from 'react';
import { PromptCard } from './PromptCard';
import { PromptProtocol } from '../types';

interface PromptsGridProps {
  prompts: PromptProtocol[];
  onPromptClick: (prompt: PromptProtocol) => void;
  onRun: (prompt: PromptProtocol) => void;
}

export const PromptsGrid: React.FC<PromptsGridProps> = ({ prompts, onPromptClick, onRun }) => {
  if (prompts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-on-surface-variant">
        <p className="font-headline text-2xl uppercase tracking-tight mb-2">No Results</p>
        <p className="font-label text-xs uppercase tracking-widest">Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
      {prompts.map(prompt => (
        <PromptCard
          key={prompt.id}
          prompt={prompt}
          onClick={onPromptClick}
          onRun={onRun}
        />
      ))}
    </div>
  );
};
