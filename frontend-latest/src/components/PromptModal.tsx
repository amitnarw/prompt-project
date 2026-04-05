'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Prompt } from '@/types';
import { Button } from '@/components/ui/button';
import { VoteButtons } from '@/components/VoteButtons';
import { formatDate } from '@/lib/utils';
import { X, Copy, Check, Bot, GitFork, Calendar, User, Tag, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

interface PromptModalProps {
  prompt: Prompt;
  isOpen: boolean;
  onClose: () => void;
  onVote?: () => void;
}

export function PromptModal({ prompt, isOpen, onClose, onVote }: PromptModalProps) {
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  const handleRunPrompt = () => {
    router.push(`/playground?prompt=${encodeURIComponent(prompt.content)}`);
    onClose();
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt.content);
      setCopied(true);
      toast.success('Prompt copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-[12px]"
        onClick={onClose}
      />

      {/* Modal - glassmorphism style */}
      <div className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#262626]/40 backdrop-blur-[12px]">
        {/* Header */}
        <div className="sticky top-0 bg-[#191a1a] px-6 py-4 flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold text-[#e7e5e4]">{prompt.title}</h2>
              {prompt.forkedFrom && (
                <span title="Forked prompt" className="text-[#acabaa]">
                  <GitFork className="h-4 w-4" />
                </span>
              )}
            </div>
            <p className="text-sm text-[#acabaa] mt-1">{prompt.description}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[rgba(72,72,72,0.15)] transition-colors text-[#acabaa]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-4 space-y-4">
          {/* Prompt Content */}
          <div>
            <h3 className="text-sm font-medium mb-2 text-[#e7e5e4]">Prompt</h3>
            <div className="bg-[#131313] p-4 font-mono text-sm whitespace-pre-wrap text-[#e7e5e4]">
              {prompt.content}
            </div>
          </div>

          {/* Example Output */}
          {prompt.exampleOutput && (
            <div>
              <h3 className="text-sm font-medium mb-2 flex items-center gap-2 text-[#e7e5e4]">
                <Sparkles className="h-4 w-4 text-[#eaffeb]" />
                Example Output
              </h3>
              <div className="bg-[#131313] p-4 font-mono text-sm whitespace-pre-wrap text-[#e7e5e4]">
                {prompt.exampleOutput}
              </div>
            </div>
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1 text-xs bg-[#3c3b3b] text-[#c1bfbe] px-2 py-1">
              <Tag className="h-3 w-3" />
              {prompt.category}
            </span>
            {prompt.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs bg-[rgba(72,72,72,0.15)] text-[#e7e5e4] px-2 py-1"
              >
                {tag}
              </span>
            ))}
            {prompt.modelType && (
              <span className="text-xs bg-[#3c3b3b] text-[#c1bfbe] px-2 py-1">
                {prompt.modelType}
              </span>
            )}
          </div>

          {/* Meta */}
          <div className="flex items-center gap-4 text-xs text-[#acabaa]">
            <span className="inline-flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formatDate(prompt.createdAt)}
            </span>
            <span className="inline-flex items-center gap-1">
              <User className="h-3 w-3" />
              {prompt.createdBy}
            </span>
            {prompt.usageCount !== undefined && prompt.usageCount > 0 && (
              <span className="text-[#ffb5a0] font-medium">
                Used {prompt.usageCount} times
              </span>
            )}
          </div>

          {/* Voting */}
          <div className="pt-4">
            <div className="flex items-center gap-4">
              <VoteButtons
                promptId={prompt.id}
                worksCount={prompt.worksCount}
                doesntWorkCount={prompt.doesntWorkCount}
                onVote={onVote}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-[#191a1a] px-6 py-4 flex items-center justify-between gap-4">
          <Button variant="outline" onClick={handleCopy} className="gap-2">
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? 'Copied!' : 'Copy Prompt'}
          </Button>
          <Button onClick={handleRunPrompt} className="gap-2">
            <Bot className="h-4 w-4" />
            Run in Playground
          </Button>
        </div>
      </div>
    </div>
  );
}
