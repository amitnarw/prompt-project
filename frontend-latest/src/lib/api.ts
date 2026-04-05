import {
  Prompt,
  PromptVersion,
  CreatePromptInput,
  UpdatePromptInput,
  PlaygroundInput,
  PlaygroundResult,
  VoteResult,
  ApiResponse,
  PaginatedResponse,
  PaginationParams,
  AdvancedFilterParams,
  Bookmark,
  Collection,
} from '@/types';

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL + '/api';

async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE}${endpoint}`;

  const config: RequestInit = {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  };

  const response = await fetch(url, config);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error ${response.status}`);
  }

  return response.json();
}

export const api = {
  prompts: {
    getAll: (params?: AdvancedFilterParams): Promise<PaginatedResponse<Prompt>> => {
      const searchParams = new URLSearchParams();
      if (params?.page) searchParams.set('page', String(params.page));
      if (params?.limit) searchParams.set('limit', String(params.limit));
      if (params?.category) searchParams.set('category', params.category);
      if (params?.search) searchParams.set('search', params.search);
      if (params?.tags?.length) searchParams.set('tags', params.tags.join(','));
      if (params?.sortBy) searchParams.set('sortBy', params.sortBy);
      if (params?.isVerified !== undefined) searchParams.set('isVerified', String(params.isVerified));
      if (params?.modelType) searchParams.set('modelType', params.modelType);
      if (params?.bookmarkedBy) searchParams.set('bookmarkedBy', params.bookmarkedBy);
      if (params?.collectionId) searchParams.set('collectionId', params.collectionId);

      const query = searchParams.toString();
      return fetchApi<PaginatedResponse<Prompt>>(
        `/prompts${query ? `?${query}` : ''}`
      );
    },

    getById: (id: string): Promise<ApiResponse<Prompt>> => {
      return fetchApi<ApiResponse<Prompt>>(`/prompts/${id}`);
    },

    create: (data: CreatePromptInput): Promise<ApiResponse<Prompt>> => {
      return fetchApi<ApiResponse<Prompt>>('/prompts', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },

    update: (
      id: string,
      data: UpdatePromptInput
    ): Promise<ApiResponse<Prompt>> => {
      return fetchApi<ApiResponse<Prompt>>(`/prompts/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },

    delete: (id: string): Promise<ApiResponse<void>> => {
      return fetchApi<ApiResponse<void>>(`/prompts/${id}`, {
        method: 'DELETE',
      });
    },

    upvote: (id: string): Promise<ApiResponse<VoteResult>> => {
      return fetchApi<ApiResponse<VoteResult>>(`/prompts/${id}/upvote`, {
        method: 'POST',
      });
    },

    downvote: (id: string): Promise<ApiResponse<VoteResult>> => {
      return fetchApi<ApiResponse<VoteResult>>(`/prompts/${id}/downvote`, {
        method: 'POST',
      });
    },

    fork: (id: string, userId?: string): Promise<ApiResponse<Prompt>> => {
      return fetchApi<ApiResponse<Prompt>>(`/prompts/${id}/fork`, {
        method: 'POST',
        body: JSON.stringify({ userId }),
      });
    },

    getVersions: (id: string): Promise<ApiResponse<PromptVersion[]>> => {
      return fetchApi<ApiResponse<PromptVersion[]>>(`/prompts/${id}/versions`);
    },

    verify: (id: string): Promise<ApiResponse<Prompt>> => {
      return fetchApi<ApiResponse<Prompt>>(`/prompts/${id}/verify`, { method: 'POST' });
    },

    unverify: (id: string): Promise<ApiResponse<Prompt>> => {
      return fetchApi<ApiResponse<Prompt>>(`/prompts/${id}/verify`, { method: 'DELETE' });
    },
  },

  playground: {
    run: (data: PlaygroundInput): Promise<ApiResponse<PlaygroundResult>> => {
      return fetchApi<ApiResponse<PlaygroundResult>>('/playground/run', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    getUsage: (): Promise<ApiResponse<{ limit: number; used: number; remaining: number; resetsAt: string }>> => {
      return fetchApi<ApiResponse<{ limit: number; used: number; remaining: number; resetsAt: string }>>('/playground/usage');
    },
  },

  bookmarks: {
    add: (promptId: string): Promise<ApiResponse<Bookmark>> => {
      return fetchApi<ApiResponse<Bookmark>>('/bookmarks', {
        method: 'POST',
        body: JSON.stringify({ promptId }),
      });
    },

    remove: (promptId: string): Promise<ApiResponse<void>> => {
      return fetchApi<ApiResponse<void>>(`/bookmarks/${promptId}`, { method: 'DELETE' });
    },

    getAll: (page?: number): Promise<PaginatedResponse<Prompt>> => {
      const searchParams = new URLSearchParams();
      if (page) searchParams.set('page', String(page));
      const query = searchParams.toString();
      return fetchApi<PaginatedResponse<Prompt>>(`/bookmarks${query ? `?${query}` : ''}`);
    },

    check: (promptId: string): Promise<ApiResponse<{ isBookmarked: boolean }>> => {
      return fetchApi<ApiResponse<{ isBookmarked: boolean }>>(`/bookmarks/${promptId}/check`);
    },
  },

  collections: {
    create: (data: { name: string; description?: string }): Promise<ApiResponse<Collection>> => {
      return fetchApi<ApiResponse<Collection>>('/collections', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },

    update: (id: string, data: { name?: string; description?: string }): Promise<ApiResponse<Collection>> => {
      return fetchApi<ApiResponse<Collection>>(`/collections/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },

    delete: (id: string): Promise<ApiResponse<void>> => {
      return fetchApi<ApiResponse<void>>(`/collections/${id}`, { method: 'DELETE' });
    },

    getAll: (): Promise<ApiResponse<Collection[]>> => {
      return fetchApi<ApiResponse<Collection[]>>('/collections');
    },

    getById: (id: string): Promise<ApiResponse<Collection & { prompts: { prompt: Prompt }[] }>> => {
      return fetchApi<ApiResponse<Collection & { prompts: { prompt: Prompt }[] }>>(`/collections/${id}`);
    },

    addPrompt: (collectionId: string, promptId: string): Promise<ApiResponse<void>> => {
      return fetchApi<ApiResponse<void>>(`/collections/${collectionId}/prompts`, {
        method: 'POST',
        body: JSON.stringify({ promptId }),
      });
    },

    removePrompt: (collectionId: string, promptId: string): Promise<ApiResponse<void>> => {
      return fetchApi<ApiResponse<void>>(`/collections/${collectionId}/prompts/${promptId}`, {
        method: 'DELETE',
      });
    },
  },
};
