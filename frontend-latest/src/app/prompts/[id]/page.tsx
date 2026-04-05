'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { VoteButtons } from '@/components/VoteButtons';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatDate, formatDateTime } from '@/lib/utils';
import { Loader2, Edit, Trash2, GitFork, Calendar, User, Tag, History } from 'lucide-react';
import { toast } from 'sonner';

export default function PromptDetailPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const promptId = params.id as string;

  const { data, isLoading, isError } = useQuery({
    queryKey: ['prompt', promptId],
    queryFn: () => api.prompts.getById(promptId),
  });

  const deleteMutation = useMutation({
    mutationFn: () => api.prompts.delete(promptId),
    onSuccess: () => {
      toast.success('Prompt deleted');
      router.push('/');
    },
    onError: () => {
      toast.error('Failed to delete prompt');
    },
  });

  const forkMutation = useMutation({
    mutationFn: () => api.prompts.fork(promptId),
    onSuccess: (response) => {
      if (response.data) {
        toast.success('Prompt forked successfully');
        router.push(`/prompts/${response.data.id}`);
      }
    },
    onError: () => {
      toast.error('Failed to fork prompt');
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-[#acabaa]" />
      </div>
    );
  }

  if (isError || !data?.data) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-[#ee7d77]">Error</CardTitle>
            <CardDescription className="text-[#acabaa]">Prompt not found</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/">
              <Button variant="outline">Back to Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const prompt = data.data;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[#e7e5e4]">{prompt.title}</h1>
            {prompt.forkedFrom && (
              <Link
                href={`/prompts/${prompt.forkedFrom}`}
                className="text-sm text-[#acabaa] mt-1 flex items-center gap-1 hover:text-[#ffb5a0] transition-colors"
              >
                <GitFork className="h-4 w-4" />
                Forked from another prompt
              </Link>
            )}
          </div>
          <div className="flex gap-2">
            <VoteButtons
              promptId={prompt.id}
              worksCount={prompt.worksCount}
              doesntWorkCount={prompt.doesntWorkCount}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          <span className="inline-flex items-center gap-1 text-sm bg-[#3c3b3b] text-[#c1bfbe] px-3 py-1 uppercase tracking-wide">
            <Tag className="h-3 w-3" />
            {prompt.category}
          </span>
          {prompt.tags.map((tag) => (
            <span
              key={tag}
              className="text-sm bg-[rgba(72,72,72,0.15)] text-[#e7e5e4] px-3 py-1"
            >
              {tag}
            </span>
          ))}
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-[#e7e5e4]">Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[#acabaa]">{prompt.description}</p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-[#e7e5e4]">Prompt Content</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-[#131313] p-4 font-mono text-sm whitespace-pre-wrap overflow-x-auto text-[#e7e5e4]">
              {prompt.content}
            </pre>
          </CardContent>
        </Card>

        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 text-sm text-[#acabaa]">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              Created {formatDateTime(prompt.createdAt)}
            </span>
            <span className="flex items-center gap-1">
              <User className="h-4 w-4" />
              {prompt.createdBy}
            </span>
          </div>
          {prompt.updatedAt !== prompt.createdAt && (
            <span className="flex items-center gap-1">
              <History className="h-4 w-4" />
              Updated {formatDateTime(prompt.updatedAt)}
            </span>
          )}
        </div>

        <Tabs defaultValue="actions" className="mb-6">
          <TabsList>
            <TabsTrigger value="actions">Actions</TabsTrigger>
            <TabsTrigger value="versions">
              Version History ({prompt.versions?.length || 0})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="actions">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-wrap gap-3">
                  <Link href={`/prompts/${prompt.id}/edit`}>
                    <Button variant="outline" className="gap-2">
                      <Edit className="h-4 w-4" />
                      Edit
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    className="gap-2"
                    onClick={() => forkMutation.mutate()}
                    disabled={forkMutation.isPending}
                  >
                    <GitFork className="h-4 w-4" />
                    {forkMutation.isPending ? 'Forking...' : 'Fork'}
                  </Button>
                  <Button
                    variant="outline"
                    className="gap-2"
                    onClick={() => {
                      navigator.clipboard.writeText(prompt.content);
                      toast.success('Copied to clipboard');
                    }}
                  >
                    Copy Prompt
                  </Button>
                  <Link href={`/playground?prompt=${encodeURIComponent(prompt.content)}`}>
                    <Button variant="secondary" className="gap-2">
                      Test in Playground
                    </Button>
                  </Link>
                  <Button
                    variant="destructive"
                    className="gap-2 ml-auto"
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this prompt?')) {
                        deleteMutation.mutate();
                      }
                    }}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                    {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="versions">
            <Card>
              <CardHeader>
                <CardTitle className="text-[#e7e5e4]">Version History</CardTitle>
                <CardDescription className="text-[#acabaa]">
                  Previous versions of this prompt
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!prompt.versions || prompt.versions.length === 0 ? (
                  <p className="text-[#acabaa] text-sm">
                    No version history yet. Versions are created when the prompt is updated.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {prompt.versions.map((version) => (
                      <div
                        key={version.id}
                        className="p-4"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-[#e7e5e4]">
                            Version from {formatDateTime(version.createdAt)}
                          </span>
                        </div>
                        <pre className="bg-[#131313] p-3 text-sm font-mono whitespace-pre-wrap text-[#e7e5e4]">
                          {version.content}
                        </pre>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
