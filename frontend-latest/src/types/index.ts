export interface Prompt {
  id: string;
  title: string;
  description: string;
  content: string;
  category: string;
  tags: string[];
  upvotes: number;
  downvotes: number;
  forkedFrom: string | null;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  versions?: PromptVersion[];
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
