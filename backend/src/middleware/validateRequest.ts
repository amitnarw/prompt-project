import { Request, Response, NextFunction } from 'express';
import { z, ZodSchema } from 'zod';

export const validateRequest = (schema: {
  body?: ZodSchema;
  query?: ZodSchema;
  params?: ZodSchema;
}) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (schema.body) {
      req.body = schema.body.parse(req.body);
    }
    if (schema.query) {
      const parsed = schema.query.parse(req.query);
      req.query = Object.assign({}, req.query, parsed);
    }
    if (schema.params) {
      req.params = schema.params.parse(req.params);
    }
    next();
  };
};

export const createPromptSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(200, 'Title must be less than 200 characters'),
  description: z.string()
    .min(1, 'Description is required')
    .max(1000, 'Description must be less than 1000 characters'),
  content: z.string()
    .min(1, 'Prompt content is required')
    .max(10000, 'Prompt content must be less than 10000 characters'),
  category: z.string()
    .min(1, 'Category is required')
    .max(50, 'Category must be less than 50 characters'),
  tags: z.array(z.string()).default([]),
  createdBy: z.string().optional(),
});

export const updatePromptSchema = z.object({
  title: z.string()
    .min(1, 'Title cannot be empty')
    .max(200, 'Title must be less than 200 characters')
    .optional(),
  description: z.string()
    .max(1000, 'Description must be less than 1000 characters')
    .optional(),
  content: z.string()
    .max(10000, 'Prompt content must be less than 10000 characters')
    .optional(),
  category: z.string()
    .max(50, 'Category must be less than 50 characters')
    .optional(),
  tags: z.array(z.string()).optional(),
});

export const forkPromptSchema = z.object({
  userId: z.string().optional(),
});

export const playgroundSchema = z.object({
  prompt: z.string()
    .min(1, 'Prompt is required')
    .max(10000, 'Prompt must be less than 10000 characters'),
  variables: z.record(z.string()).optional(),
});

export const idParamSchema = z.object({
  id: z.string().cuid('Invalid prompt ID'),
});

export const paginationQuerySchema = z.object({
  page: z.string().regex(/^\d+$/, 'Page must be a number').optional(),
  limit: z.string().regex(/^\d+$/, 'Limit must be a number').optional(),
  category: z.string().optional(),
  search: z.string().optional(),
});
