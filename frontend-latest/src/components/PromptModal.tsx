'use client';

import React, { useState } from 'react';
import { X, Play, GitFork, Edit3, Copy, CheckCircle2, XCircle, ThumbsUp, ThumbsDown, Loader2 } from 'lucide-react';
import { PromptProtocol } from '../types';
import { api } from '../lib/api';
import { motion, AnimatePresence } from 'motion/react';

interface PromptModalProps {
  prompt: PromptProtocol | null;
  onClose: () => void;
  onRun: (prompt: PromptProtocol) => void;
}

export const PromptModal: React.FC<PromptModalProps> = ({ prompt, onClose, onRun }) => {
  const [copied, setCopied] = useState(false);
  const [worksVoted, setWorksVoted] = useState(false);
  const [doesntWorkVoted, setDoesntWorkVoted] = useState(false);
  const [worksCount, setWorksCount] = useState(prompt?.worksCount ?? 0);
  const [doesntWorkCount, setDoesntWorkCount] = useState(prompt?.doesntWorkCount ?? 0);
  const [isForking, setIsForking] = useState(false);
  const [forkSuccess, setForkSuccess] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  if (!prompt) return null;

  const copyPrompt = async () => {
    await navigator.clipboard.writeText(prompt.systemPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleUpvote = async () => {
    if (worksVoted) return;
    try {
      await api.post(`/api/prompts/${prompt.id}/upvote`);
      setWorksCount(c => c + 1);
      setWorksVoted(true);
      if (doesntWorkVoted) {
        setDoesntWorkCount(c => Math.max(0, c - 1));
        setDoesntWorkVoted(false);
      }
    } catch {
      setActionError('Sign in to vote');
      setTimeout(() => setActionError(null), 3000);
    }
  };

  const handleDownvote = async () => {
    if (doesntWorkVoted) return;
    try {
      await api.post(`/api/prompts/${prompt.id}/downvote`);
      setDoesntWorkCount(c => c + 1);
      setDoesntWorkVoted(true);
      if (worksVoted) {
        setWorksCount(c => Math.max(0, c - 1));
        setWorksVoted(false);
      }
    } catch {
      setActionError('Sign in to vote');
      setTimeout(() => setActionError(null), 3000);
    }
  };

  const handleFork = async () => {
    setIsForking(true);
    try {
      await api.post(`/api/prompts/${prompt.id}/fork`, { userId: 'anonymous' });
      setForkSuccess(true);
      setTimeout(() => setForkSuccess(false), 3000);
    } catch {
      setActionError('Sign in to fork prompts');
      setTimeout(() => setActionError(null), 3000);
    } finally {
      setIsForking(false);
    }
  };

  const totalVotes = worksCount + doesntWorkCount;
  const worksPercent = totalVotes > 0 ? Math.round((worksCount / totalVotes) * 100) : 0;
  const doesntWorkPercent = totalVotes > 0 ? Math.round((doesntWorkCount / totalVotes) * 100) : 0;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-background/80 backdrop-blur-md"
          onClick={onClose}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-6xl max-h-[90vh] bg-surface-container overflow-hidden flex flex-col md:flex-row ghost-border shadow-2xl z-10"
        >
          <div className="absolute inset-0 glow-overlay pointer-events-none"></div>

          {/* Left Column: Content */}
          <div className="flex-1 p-8 md:p-12 overflow-y-auto z-10">
            <div className="mb-10">
              <div className="flex items-center space-x-4 mb-4">
                <span className={`font-label text-[10px] uppercase tracking-[0.2em] px-2 py-1 ${
                  prompt.type === 'Verified_Protocol'
                    ? 'bg-tertiary-container/10 text-tertiary'
                    : prompt.type === 'Experimental'
                      ? 'bg-amber-500/10 text-amber-400'
                      : 'bg-surface-container-highest text-on-surface-variant'
                }`}>
                  {prompt.type === 'Verified_Protocol' ? 'Verified Protocol' : prompt.type.replace('_', ' ')}
                </span>
                {prompt.category && (
                  <span className="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">
                    {prompt.category}
                  </span>
                )}
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter uppercase mb-6 leading-none">{prompt.title}</h2>
              <div className="flex flex-wrap gap-2 mb-4">
                {prompt.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 bg-surface-container-highest text-[10px] font-label uppercase tracking-widest text-on-surface border border-outline-variant/20">
                    {tag}
                  </span>
                ))}
              </div>
              {prompt.description && (
                <p className="text-on-surface-variant text-sm leading-relaxed mb-4">{prompt.description}</p>
              )}
            </div>

            <div className="space-y-8">
              <section>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-label text-xs uppercase tracking-widest text-on-surface-variant">System Prompt</h3>
                  <button
                    onClick={copyPrompt}
                    className="flex items-center space-x-2 text-[10px] font-label uppercase tracking-widest hover:text-tertiary transition-colors group"
                  >
                    {copied ? <CheckCircle2 size={14} className="text-tertiary" /> : <Copy size={14} />}
                    <span>{copied ? 'Copied!' : 'Copy to clipboard'}</span>
                  </button>
                </div>
                <div className="bg-surface-container-low p-6 font-mono text-sm text-on-surface leading-relaxed border-l-2 border-tertiary/30 max-h-64 overflow-y-auto">
                  {prompt.systemPrompt}
                </div>
              </section>

              <div className="grid grid-cols-2 gap-8 border-t border-outline-variant/10 pt-8">
                <div>
                  <h4 className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-2">Model Target</h4>
                  <p className="font-headline font-bold text-lg uppercase">{prompt.model}</p>
                </div>
                <div>
                  <h4 className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-2">Tokens</h4>
                  <p className="font-headline font-bold text-lg uppercase">{prompt.tokens}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Sidebar Actions */}
          <div className="w-full md:w-80 bg-surface-container-high p-8 flex flex-col z-10 border-l border-outline-variant/10">
            <div className="mb-8 space-y-4">
              <button
                onClick={() => onRun(prompt)}
                className="w-full h-14 bg-surface-bright text-on-surface font-headline font-black uppercase tracking-tighter flex items-center justify-center space-x-3 hover:bg-white hover:text-black transition-all active:scale-95"
              >
                <Play size={20} fill="currentColor" />
                <span>Run in Playground</span>
              </button>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleFork}
                  disabled={isForking}
                  className="h-12 border border-outline-variant/30 flex items-center justify-center space-x-2 font-label text-[10px] uppercase tracking-widest hover:bg-surface-container-highest transition-colors disabled:opacity-50"
                >
                  {isForking ? <Loader2 size={14} className="animate-spin" /> : <GitFork size={14} />}
                  <span>{forkSuccess ? 'Forked!' : 'Fork'}</span>
                </button>
                <button className="h-12 border border-outline-variant/30 flex items-center justify-center space-x-2 font-label text-[10px] uppercase tracking-widest hover:bg-surface-container-highest transition-colors">
                  <Edit3 size={14} />
                  <span>Remix</span>
                </button>
              </div>
            </div>

            {/* Action Error */}
            {actionError && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-label text-[9px] uppercase tracking-widest text-amber-400 text-center mb-4"
              >
                {actionError}
              </motion.p>
            )}

            {/* Quality Assurance / Voting */}
            <div className="mb-8">
              <h4 className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-4">Quality Assurance</h4>
              <div className="space-y-3">
                <button
                  onClick={handleUpvote}
                  className={`w-full flex items-center justify-between p-3 border-l-2 transition-colors ${
                    worksVoted
                      ? 'bg-surface-container-low border-tertiary'
                      : 'bg-surface-container-low border-transparent hover:border-tertiary/50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <ThumbsUp size={16} className={worksVoted ? 'text-tertiary' : 'text-on-surface-variant'} />
                    <span className="font-label text-[10px] uppercase tracking-widest">Works consistently</span>
                  </div>
                  <span className="font-label text-xs text-on-surface-variant">{worksCount > 0 ? `${worksPercent}%` : '—'}</span>
                </button>
                <button
                  onClick={handleDownvote}
                  className={`w-full flex items-center justify-between p-3 border-l-2 transition-colors ${
                    doesntWorkVoted
                      ? 'bg-surface-container-low border-red-500/50'
                      : 'bg-surface-container-low border-transparent hover:border-outline-variant/40'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <ThumbsDown size={16} className={doesntWorkVoted ? 'text-red-400' : 'text-on-surface-variant'} />
                    <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">Fail reports</span>
                  </div>
                  <span className="font-label text-xs text-on-surface-variant">{doesntWorkCount > 0 ? `${doesntWorkPercent}%` : '—'}</span>
                </button>
              </div>
              {totalVotes > 0 && (
                <p className="font-label text-[9px] uppercase tracking-widest text-on-surface-variant mt-2 text-right">
                  {totalVotes} vote{totalVotes !== 1 ? 's' : ''} total
                </p>
              )}
            </div>

            <div className="mt-auto">
              <h4 className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-4">Meta</h4>
              <div className="space-y-2">
                {prompt.createdAt && (
                  <div className="flex items-center justify-between">
                    <span className="font-label text-[9px] uppercase text-on-surface-variant">Created</span>
                    <span className="font-label text-[9px] text-on-surface">
                      {new Date(prompt.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                )}
                {prompt.createdBy && (
                  <div className="flex items-center justify-between">
                    <span className="font-label text-[9px] uppercase text-on-surface-variant">Author</span>
                    <span className="font-label text-[9px] text-on-surface truncate max-w-[120px]">{prompt.createdBy}</span>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={onClose}
              className="mt-8 text-on-surface-variant hover:text-on-surface text-left transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
