'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Plus, FolderOpen, Check, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { CreateCollectionDialog } from './CreateCollectionDialog';

interface AddToCollectionDropdownProps {
  promptId: string;
}

export function AddToCollectionDropdown({ promptId }: AddToCollectionDropdownProps) {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const { data: collections, isLoading } = useQuery({
    queryKey: ['collections'],
    queryFn: () => api.collections.getAll(),
    enabled: isAuthenticated,
  });

  const addToCollectionMutation = useMutation({
    mutationFn: (collectionId: string) => api.collections.addPrompt(collectionId, promptId),
    onSuccess: () => {
      toast.success('Added to collection');
      queryClient.invalidateQueries({ queryKey: ['collections'] });
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to add to collection');
    },
  });

  if (!isAuthenticated) return null;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <FolderOpen className="h-4 w-4" />
            Add to Collection
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          {isLoading ? (
            <DropdownMenuItem disabled>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Loading...
            </DropdownMenuItem>
          ) : collections?.data?.length === 0 ? (
            <DropdownMenuItem disabled className="text-muted-foreground">
              No collections yet
            </DropdownMenuItem>
          ) : (
            collections?.data?.map((collection) => (
              <DropdownMenuItem
                key={collection.id}
                onClick={() => addToCollectionMutation.mutate(collection.id)}
                disabled={addToCollectionMutation.isPending}
                className="gap-2"
              >
                <Check className="h-4 w-4 opacity-0" />
                {collection.name}
              </DropdownMenuItem>
            ))
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setShowCreateDialog(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Create New Collection
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <CreateCollectionDialog
        isOpen={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
      />
    </>
  );
}
