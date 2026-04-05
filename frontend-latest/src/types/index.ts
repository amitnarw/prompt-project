export interface Prompt {
  id: string;
  title: string;
  description: string;
  content: string;
  category: string;
  tags: string[];
  worksCount: number;
  doesntWorkCount: number;
  forkedFrom: string | null;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  versions?: PromptVersion[];
  isVerified?: boolean;
  verifiedAt?: string | null;
  verifiedBy?: string | null;
  usageCount?: number;
  modelType?: string | null;
}

export interface PromptVersion {
  id: string;
  promptId: string;
  content: string;
  createdAt: string;
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

export interface PlaygroundResult {
  success: boolean;
  prompt: string;
  response: string;
  executedAt: string;
  mock: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface VoteResult {
  action: 'added' | 'removed' | 'changed';
  newVoteCount: number;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
}

export interface AdvancedFilterParams {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  tags?: string[];
  sortBy?: 'newest' | 'oldest' | 'mostWorks' | 'mostDoesntWork' | 'alphabetical' | 'rating';
  isVerified?: boolean;
  modelType?: string;
  bookmarkedBy?: string;
  collectionId?: string;
}

export interface Bookmark {
  id: string;
  userId: string;
  promptId: string;
  createdAt: string;
}

export interface Collection {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  promptCount?: number;
}

export interface CollectionPrompt {
  id: string;
  collectionId: string;
  promptId: string;
  addedAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
}

export interface AuthSession {
  userId: string;
  email: string;
  name: string;
  avatarUrl?: string;
}
