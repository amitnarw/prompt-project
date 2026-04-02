'use client';

import { PromptForm } from '@/components/PromptForm';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function NewPromptPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Create New Prompt</CardTitle>
            <CardDescription>
              Share your AI prompt with the community
            </CardDescription>
          </CardHeader>
        </Card>
        <div className="mt-6">
          <PromptForm />
        </div>
      </div>
    </div>
  );
}
