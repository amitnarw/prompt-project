'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Prompt } from '@/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { VerifiedBadge } from '@/components/VerifiedBadge';
import { PromptModal } from '@/components/PromptModal';
import { VoteButtons } from '@/components/VoteButtons';
import { BookmarkButton } from '@/components/BookmarkButton';
import { formatDate, truncate } from '@/lib/utils';
import { Calendar, GitFork, Play } from 'lucide-react';

interface PromptCardProps {
  prompt: Prompt;
  onVote?: () => void;
}

export function PromptCard({ prompt, onVote }: PromptCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const handlePlaygroundClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/playground?prompt=${encodeURIComponent(prompt.content)}`);
  };

  return (
    <>
      <Card className="h-full flex flex-col cursor-pointer transition-all duration-300 hover:before:opacity-100" onClick={() => setIsModalOpen(true)}>
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="line-clamp-1 flex items-center gap-2 text-base font-semibold text-[#e7e5e4]">
              {prompt.title}
              {prompt.isVerified && <VerifiedBadge />}
            </CardTitle>
            {prompt.forkedFrom && (
              <span title="Forked prompt">
                <GitFork className="h-4 w-4 text-[#acabaa] shrink-0" />
              </span>
            )}
          </div>
          <CardDescription className="line-clamp-2 mt-1 text-sm text-[#acabaa]">
            {prompt.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pt-0 space-y-3">
          <div className="bg-[#131313] p-3 font-mono text-xs whitespace-pre-wrap line-clamp-3 text-[#e7e5e4]">
            {truncate(prompt.content, 120)}
          </div>

          {/* Quick Actions - no divider, use spacing */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-1 text-xs text-[#acabaa]">
              <span className="bg-[#3c3b3b] text-[#c1bfbe] px-1.5 py-0.5 text-xs uppercase tracking-wide">
                {prompt.category}
              </span>
              <span className="flex items-center gap-1 ml-1">
                <Calendar className="h-3 w-3" />
                {formatDate(prompt.createdAt)}
              </span>
            </div>
          </div>

          {/* Vote & Action Buttons */}
          <div className="flex items-center justify-between pt-2">
            <VoteButtons
              promptId={prompt.id}
              worksCount={prompt.worksCount || 0}
              doesntWorkCount={prompt.doesntWorkCount || 0}
              onVote={onVote}
            />
            <div className="flex items-center gap-1">
              <BookmarkButton promptId={prompt.id} variant="ghost" size="sm" />
              <Button variant="ghost" size="sm" className="gap-1 h-8 px-2" onClick={handlePlaygroundClick}>
                <Play className="h-3 w-3" />
                <span className="text-xs">Test</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <PromptModal
        prompt={prompt}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onVote={onVote}
      />
    </>
  );
}
