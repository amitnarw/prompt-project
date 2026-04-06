import React from 'react';
import { Bookmark, GitFork, Play } from 'lucide-react';
import { PromptProtocol } from '../types';
import { motion } from 'motion/react';

interface PromptCardProps {
  prompt: PromptProtocol;
  onClick: (prompt: PromptProtocol) => void;
  onRun: (prompt: PromptProtocol) => void;
}

export const PromptCard: React.FC<PromptCardProps> = ({ prompt, onClick, onRun }) => {
  return (
    <motion.article 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="bg-gradient-to-br from-surface-container-low to-surface-container p-6 relative group cursor-pointer transition-all duration-300"
      onClick={() => onClick(prompt)}
    >
      <div className="absolute inset-0 bg-tertiary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
      <div className="flex justify-between items-start mb-6">
        <div className="flex flex-col">
          <span className={`font-label text-[10px] uppercase tracking-widest mb-1 flex items-center gap-1 ${
            prompt.type === 'Verified_Protocol' ? 'text-tertiary-dim' : 'text-on-surface-variant'
          }`}>
            {prompt.type === 'Verified_Protocol' && <span className="w-1 h-1 bg-tertiary"></span>}
            {prompt.type}
          </span>
          <h3 className="font-headline font-bold text-xl leading-tight">{prompt.title}</h3>
        </div>
        <button 
          className="text-on-surface-variant hover:text-white transition-colors"
          onClick={(e) => { e.stopPropagation(); }}
        >
          <Bookmark size={18} />
        </button>
      </div>
      <p className="text-on-surface-variant text-sm mb-6 font-sans leading-relaxed line-clamp-3">
        {prompt.description}
      </p>
      <div className="flex flex-wrap gap-2 mb-8">
        <span className="px-2 py-0.5 bg-surface-container-highest font-label text-[10px] uppercase text-on-surface-variant">{prompt.model}</span>
        {prompt.tags.map(tag => (
          <span key={tag} className="px-2 py-0.5 bg-surface-container-highest font-label text-[10px] uppercase text-on-surface-variant">{tag}</span>
        ))}
      </div>
      <div className="flex items-center justify-between pt-6 border-t border-outline-variant/10">
        <div className="flex gap-4">
          <div className="flex flex-col">
            <span className="font-label text-[9px] uppercase tracking-tighter text-on-surface-variant">Status</span>
            <span className={`font-label text-xs uppercase ${prompt.type === 'Verified_Protocol' ? 'text-tertiary' : 'text-on-surface'}`}>
              {prompt.status} {prompt.statusValue}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            className="p-2 bg-surface-container-highest hover:bg-tertiary/10 text-on-surface transition-colors"
            onClick={(e) => { e.stopPropagation(); }}
          >
            <GitFork size={18} />
          </button>
          <button 
            className="px-4 py-2 bg-surface-bright font-label text-xs uppercase tracking-widest hover:bg-on-surface hover:text-background transition-colors flex items-center gap-2"
            onClick={(e) => { e.stopPropagation(); onRun(prompt); }}
          >
            <Play size={12} fill="currentColor" />
            Run
          </button>
        </div>
      </div>
    </motion.article>
  );
};
