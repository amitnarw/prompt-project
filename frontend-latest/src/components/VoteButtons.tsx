'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface VoteButtonsProps {
  promptId: string;
  worksCount: number;
  doesntWorkCount: number;
  onVote?: () => void;
}

export function VoteButtons({ promptId, worksCount, doesntWorkCount, onVote }: VoteButtonsProps) {
  const [localWorksCount, setLocalWorksCount] = useState(worksCount);
  const [localDoesntWorkCount, setLocalDoesntWorkCount] = useState(doesntWorkCount);
  const [userVote, setUserVote] = useState<'works' | 'doesntWork' | null>(null);

  const queryClient = useQueryClient();

  const markWorksMutation = useMutation({
    mutationFn: () => api.prompts.upvote(promptId),
    onSuccess: (response) => {
      if (response.data) {
        setLocalWorksCount(response.data.newVoteCount);
        setUserVote(response.data.action === 'removed' ? null : 'works');
        onVote?.();
      }
    },
    onError: () => {
      toast.error('Failed to mark as works');
    },
  });

  const markDoesntWorkMutation = useMutation({
    mutationFn: () => api.prompts.downvote(promptId),
    onSuccess: (response) => {
      if (response.data) {
        setLocalDoesntWorkCount(response.data.newVoteCount);
        setUserVote(response.data.action === 'removed' ? null : 'doesntWork');
        onVote?.();
      }
    },
    onError: () => {
      toast.error('Failed to mark as doesn\'t work');
    },
  });

  const handleMarkWorks = () => {
    if (userVote === 'works') {
      markWorksMutation.mutate();
    } else if (userVote === 'doesntWork') {
      markDoesntWorkMutation.mutate();
      setTimeout(() => markWorksMutation.mutate(), 50);
    } else {
      markWorksMutation.mutate();
    }
  };

  const handleMarkDoesntWork = () => {
    if (userVote === 'doesntWork') {
      markDoesntWorkMutation.mutate();
    } else if (userVote === 'works') {
      markWorksMutation.mutate();
      setTimeout(() => markDoesntWorkMutation.mutate(), 50);
    } else {
      markDoesntWorkMutation.mutate();
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleMarkWorks}
        disabled={markWorksMutation.isPending}
        className={cn(
          'gap-1',
          userVote === 'works' && 'text-green-600 hover:text-green-700'
        )}
      >
        <CheckCircle className="h-4 w-4" />
        <span>Works</span>
        <span className="ml-1 text-xs">({localWorksCount})</span>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleMarkDoesntWork}
        disabled={markDoesntWorkMutation.isPending}
        className={cn(
          'gap-1',
          userVote === 'doesntWork' && 'text-red-600 hover:text-red-700'
        )}
      >
        <XCircle className="h-4 w-4" />
        <span>Doesn&apos;t Work</span>
        <span className="ml-1 text-xs">({localDoesntWorkCount})</span>
      </Button>
    </div>
  );
}
