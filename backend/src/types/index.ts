import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  userId?: string;
}

export interface PaginationQuery {
  page?: string;
  limit?: string;
  category?: string;
  search?: string;
}

export interface CreatePromptInput {
  title: string;
  description: string;
  content: string;
  category: string;
  tags: string[];
  createdBy?: string;
}

export interface UpdatePromptInput {
  title?: string;
  description?: string;
  content?: string;
  category?: string;
  tags?: string[];
}

export interface PlaygroundInput {
  prompt: string;
  variables?: Record<string, string>;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
