import type { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  userId?: string;
}

export interface PaginationQuery {
  page?: string;
  limit?: string;
  category?: string;
  search?: string;
  tags?: string;
  sortBy?: string;
  isVerified?: string;
  modelType?: string;
  bookmarkedBy?: string;
  collectionId?: string;
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

// Bookmark Types
export interface CreateBookmarkInput {
  promptId: string;
}

// Collection Types
export interface CreateCollectionInput {
  name: string;
  description?: string;
}

export interface UpdateCollectionInput {
  name?: string;
  description?: string;
}

// Advanced Filter Types
export interface AdvancedPromptFilter {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  tags?: string[];
  sortBy?: 'newest' | 'oldest' | 'mostWorks' | 'mostDoesntWork' | 'alphabetical' | 'rating';
  isVerified?: boolean;
  modelType?: string;
  minWorksCount?: number;
  maxWorksCount?: number;
  minDoesntWorkCount?: number;
  maxDoesntWorkCount?: number;
  bookmarkedBy?: string;
  collectionId?: string;
}
