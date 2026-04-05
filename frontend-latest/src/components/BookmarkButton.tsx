'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Bookmark } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface BookmarkButtonProps {
  promptId: string;
  initialIsBookmarked?: boolean;
  variant?: 'default' | 'ghost' | 'outline';
  size?: 'default' | 'sm' | 'lg';
}

export function BookmarkButton({
  promptId,
  initialIsBookmarked = false,
  variant = 'ghost',
  size = 'default',
}: BookmarkButtonProps) {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [isBookmarked, setIsBookmarked] = useState(initialIsBookmarked);

  const addBookmarkMutation = useMutation({
    mutationFn: () => api.bookmarks.add(promptId),
    onSuccess: () => {
      setIsBookmarked(true);
      toast.success('Prompt bookmarked');
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to bookmark');
    },
  });

  const removeBookmarkMutation = useMutation({
    mutationFn: () => api.bookmarks.remove(promptId),
    onSuccess: () => {
      setIsBookmarked(false);
      toast.success('Bookmark removed');
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to remove bookmark');
    },
  });

  const handleClick = () => {
    if (!isAuthenticated) {
      toast.error('Please login to bookmark prompts');
      return;
    }

    if (isBookmarked) {
      removeBookmarkMutation.mutate();
    } else {
      addBookmarkMutation.mutate();
    }
  };

  const isPending = addBookmarkMutation.isPending || removeBookmarkMutation.isPending;

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleClick}
      disabled={isPending}
      className={cn('gap-2', isBookmarked && 'text-primary')}
    >
      <Bookmark className={cn('h-4 w-4', isBookmarked && 'fill-current')} />
      {isBookmarked ? 'Saved' : 'Save'}
    </Button>
  );
}
