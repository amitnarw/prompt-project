'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { PromptForm } from '@/components/PromptForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function EditPromptPage() {
  const params = useParams();
  const router = useRouter();
  const promptId = params.id as string;

  const { data, isLoading, isError } = useQuery({
    queryKey: ['prompt', promptId],
    queryFn: () => api.prompts.getById(promptId),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError || !data?.data) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
            <CardDescription>Prompt not found</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/">
              <Button variant="outline" className="mt-4">Back to Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Edit Prompt</CardTitle>
            <CardDescription>
              Make changes to your prompt
            </CardDescription>
          </CardHeader>
        </Card>
        <div className="mt-6">
          <PromptForm initialData={data.data} isEdit promptId={promptId} />
        </div>
      </div>
    </div>
  );
}
