'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { CreatePromptInput, UpdatePromptInput, Prompt } from '@/types';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const promptSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title is too long'),
  description: z.string().min(1, 'Description is required').max(1000, 'Description is too long'),
  content: z.string().min(1, 'Prompt content is required').max(10000, 'Prompt is too long'),
  category: z.string().min(1, 'Category is required').max(50, 'Category is too long'),
  tags: z.string().optional(),
});

type PromptFormData = z.infer<typeof promptSchema>;

interface PromptFormProps {
  initialData?: Prompt;
  isEdit?: boolean;
  promptId?: string;
}

export function PromptForm({ initialData, isEdit, promptId }: PromptFormProps) {
  const router = useRouter();

  const createMutation = useMutation({
    mutationFn: (data: CreatePromptInput) => api.prompts.create(data),
    onSuccess: (response) => {
      if (response.data) {
        toast.success('Prompt created successfully');
        router.push(`/prompts/${response.data.id}`);
      }
    },
    onError: () => {
      toast.error('Failed to create prompt');
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: UpdatePromptInput) => api.prompts.update(promptId!, data),
    onSuccess: (response) => {
      if (response.data) {
        toast.success('Prompt updated successfully');
        router.push(`/prompts/${response.data.id}`);
      }
    },
    onError: () => {
      toast.error('Failed to update prompt');
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PromptFormData>({
    resolver: zodResolver(promptSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      content: initialData?.content || '',
      category: initialData?.category || '',
      tags: initialData?.tags.join(', ') || '',
    },
  });

  const onSubmit = (data: PromptFormData) => {
    const tags = data.tags
      ? data.tags.split(',').map((t) => t.trim()).filter(Boolean)
      : [];

    const payload = {
      title: data.title,
      description: data.description,
      content: data.content,
      category: data.category,
      tags,
    };

    if (isEdit) {
      updateMutation.mutate(payload);
    } else {
      createMutation.mutate(payload);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          {...register('title')}
          placeholder="Enter prompt title"
          disabled={isSubmitting}
        />
        {errors.title && (
          <p className="text-sm text-destructive">{errors.title.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          {...register('description')}
          placeholder="Describe what this prompt does"
          rows={3}
          disabled={isSubmitting}
        />
        {errors.description && (
          <p className="text-sm text-destructive">{errors.description.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Prompt Content</Label>
        <Textarea
          id="content"
          {...register('content')}
          placeholder="Enter your prompt (use {{variable}} for variables)"
          rows={8}
          className="font-mono text-sm"
          disabled={isSubmitting}
        />
        {errors.content && (
          <p className="text-sm text-destructive">{errors.content.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Input
            id="category"
            {...register('category')}
            placeholder="e.g., Writing, Coding, Analysis"
            disabled={isSubmitting}
          />
          {errors.category && (
            <p className="text-sm text-destructive">{errors.category.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="tags">Tags (comma-separated)</Label>
          <Input
            id="tags"
            {...register('tags')}
            placeholder="e.g., ai, gpt, creative"
            disabled={isSubmitting}
          />
        </div>
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : isEdit ? 'Update Prompt' : 'Create Prompt'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
