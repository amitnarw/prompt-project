'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { AuthGuard } from '@/components/AuthGuard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CreateCollectionDialog } from '@/components/CreateCollectionDialog';
import { Loader2, FolderOpen, Plus, MoreHorizontal, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

export default function CollectionsPage() {
  const queryClient = useQueryClient();
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const { data: collections, isLoading } = useQuery({
    queryKey: ['collections'],
    queryFn: () => api.collections.getAll(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.collections.delete(id),
    onSuccess: () => {
      toast.success('Collection deleted');
      queryClient.invalidateQueries({ queryKey: ['collections'] });
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to delete');
    },
  });

  return (
    <AuthGuard>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <FolderOpen className="h-8 w-8" />
              My Collections
            </h1>
            <p className="text-muted-foreground mt-1">
              Organize your prompts into collections
            </p>
          </div>
          <Button onClick={() => setShowCreateDialog(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            New Collection
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : collections?.data?.length === 0 ? (
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>No collections yet</CardTitle>
              <CardDescription>
                Create collections to organize your favorite prompts.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => setShowCreateDialog(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Create Collection
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {collections?.data?.map((collection) => (
              <Card key={collection.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{collection.name}</CardTitle>
                      {collection.description && (
                        <CardDescription className="mt-1">
                          {collection.description}
                        </CardDescription>
                      )}
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => {
                            if (confirm('Delete this collection?')) {
                              deleteMutation.mutate(collection.id);
                            }
                          }}
                          className="text-destructive gap-2"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {collection.promptCount || 0} prompts
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <CreateCollectionDialog
          isOpen={showCreateDialog}
          onClose={() => setShowCreateDialog(false)}
        />
      </div>
    </AuthGuard>
  );
}
