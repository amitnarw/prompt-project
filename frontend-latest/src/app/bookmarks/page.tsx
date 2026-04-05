'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { PromptCard } from '@/components/PromptCard';
import { AuthGuard } from '@/components/AuthGuard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Plus, Bookmark } from 'lucide-react';
import Link from 'next/link';

export default function BookmarksPage() {
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['bookmarks', page],
    queryFn: () => api.bookmarks.getAll(page),
  });

  return (
    <AuthGuard>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Bookmark className="h-8 w-8" />
              My Bookmarks
            </h1>
            <p className="text-muted-foreground mt-1">
              Prompts you have saved for later
            </p>
          </div>
          <Link href="/">
            <Button variant="outline" className="gap-2">
              <Plus className="h-4 w-4" />
              Browse More
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : isError ? (
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="text-destructive">Error</CardTitle>
              <CardDescription>Failed to load bookmarks.</CardDescription>
            </CardHeader>
          </Card>
        ) : data?.data.length === 0 ? (
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>No bookmarks yet</CardTitle>
              <CardDescription>
                Start browsing and bookmark prompts you want to save.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/">
                <Button>Browse Prompts</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data?.data.map((prompt) => (
                <PromptCard key={prompt.id} prompt={prompt} />
              ))}
            </div>

            {data && data.pagination.totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                <Button
                  variant="outline"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <span className="flex items-center px-4 text-sm text-muted-foreground">
                  Page {page} of {data.pagination.totalPages}
                </span>
                <Button
                  variant="outline"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page >= data.pagination.totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </AuthGuard>
  );
}
