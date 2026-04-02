'use client';

import Link from 'next/link';
import { Prompt } from '@/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { VoteButtons } from '@/components/VoteButtons';
import { formatDate, truncate } from '@/lib/utils';
import { Calendar, User, GitFork, Tag } from 'lucide-react';

interface PromptCardProps {
  prompt: Prompt;
  onVote?: () => void;
}

export function PromptCard({ prompt, onVote }: PromptCardProps) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <Link href={`/prompts/${prompt.id}`} className="hover:underline">
            <CardTitle className="line-clamp-1">{prompt.title}</CardTitle>
          </Link>
          {prompt.forkedFrom && (
            <span title="Forked prompt">
              <GitFork className="h-4 w-4 text-muted-foreground shrink-0" />
            </span>
          )}
        </div>
        <CardDescription className="line-clamp-2">
          {prompt.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="bg-muted/50 rounded-md p-3 font-mono text-xs whitespace-pre-wrap line-clamp-4">
          {truncate(prompt.content, 200)}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1 text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded">
            <Tag className="h-3 w-3" />
            {prompt.category}
          </span>
          {prompt.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-xs bg-accent text-accent-foreground px-2 py-1 rounded"
            >
              {tag}
            </span>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex-col gap-4 items-start">
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {formatDate(prompt.createdAt)}
          </span>
          <span className="inline-flex items-center gap-1">
            <User className="h-3 w-3" />
            {prompt.createdBy}
          </span>
        </div>
        <div className="flex items-center justify-between w-full">
          <VoteButtons
            promptId={prompt.id}
            upvotes={prompt.upvotes}
            downvotes={prompt.downvotes}
            onVote={onVote}
          />
          <Link href={`/prompts/${prompt.id}`}>
            <Button variant="outline" size="sm">
              View Prompt
            </Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
