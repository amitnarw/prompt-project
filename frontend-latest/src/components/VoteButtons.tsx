'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface VoteButtonsProps {
  promptId: string;
  upvotes: number;
  downvotes: number;
  onVote?: () => void;
}

export function VoteButtons({ promptId, upvotes, downvotes, onVote }: VoteButtonsProps) {
  const [localUpvotes, setLocalUpvotes] = useState(upvotes);
  const [localDownvotes, setLocalDownvotes] = useState(downvotes);
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(null);

  const queryClient = useQueryClient();

  const upvoteMutation = useMutation({
    mutationFn: () => api.prompts.upvote(promptId),
    onSuccess: (response) => {
      if (response.data) {
        setLocalUpvotes(response.data.newVoteCount);
        setUserVote(response.data.action === 'removed' ? null : 'up');
        onVote?.();
      }
    },
    onError: () => {
      toast.error('Failed to upvote');
    },
  });

  const downvoteMutation = useMutation({
    mutationFn: () => api.prompts.downvote(promptId),
    onSuccess: (response) => {
      if (response.data) {
        setLocalDownvotes(response.data.newVoteCount);
        setUserVote(response.data.action === 'removed' ? null : 'down');
        onVote?.();
      }
    },
    onError: () => {
      toast.error('Failed to downvote');
    },
  });

  const handleUpvote = () => {
    if (userVote === 'up') {
      upvoteMutation.mutate();
    } else if (userVote === 'down') {
      downvoteMutation.mutate();
      setTimeout(() => upvoteMutation.mutate(), 50);
    } else {
      upvoteMutation.mutate();
    }
  };

  const handleDownvote = () => {
    if (userVote === 'down') {
      downvoteMutation.mutate();
    } else if (userVote === 'up') {
      upvoteMutation.mutate();
      setTimeout(() => downvoteMutation.mutate(), 50);
    } else {
      downvoteMutation.mutate();
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleUpvote}
        disabled={upvoteMutation.isPending}
        className={cn(
          'gap-1',
          userVote === 'up' && 'text-green-600 hover:text-green-700'
        )}
      >
        <ThumbsUp className="h-4 w-4" />
        <span>{localUpvotes}</span>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleDownvote}
        disabled={downvoteMutation.isPending}
        className={cn(
          'gap-1',
          userVote === 'down' && 'text-red-600 hover:text-red-700'
        )}
      >
        <ThumbsDown className="h-4 w-4" />
        <span>{localDownvotes}</span>
      </Button>
    </div>
  );
}
