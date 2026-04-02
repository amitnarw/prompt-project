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
    getAll: (params?: PaginationParams): Promise<PaginatedResponse<Prompt>> => {
      const searchParams = new URLSearchParams();
      if (params?.page) searchParams.set('page', String(params.page));
      if (params?.limit) searchParams.set('limit', String(params.limit));
      if (params?.category) searchParams.set('category', params.category);
      if (params?.search) searchParams.set('search', params.search);

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
  },

  playground: {
    run: (data: PlaygroundInput): Promise<ApiResponse<PlaygroundResult>> => {
      return fetchApi<ApiResponse<PlaygroundResult>>('/playground/run', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
  },

  auth: {
    login: (email: string, password: string) => {
      return fetchApi<ApiResponse<{ userId: string; name: string; email: string; avatarUrl?: string }>>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
    },

    register: (email: string, password: string, name: string) => {
      return fetchApi<ApiResponse<null>>('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, password, name }),
      });
    },

    logout: () => {
      return fetchApi<ApiResponse<null>>('/auth/logout', {
        method: 'GET',
      });
    },

    getSession: () => {
      return fetchApi<ApiResponse<{ userId: string; name: string; email: string; avatarUrl?: string }>>('/auth/session', {
        method: 'GET',
      });
    },

    renewToken: () => {
      return fetchApi<ApiResponse<null>>('/auth/renew-token', {
        method: 'GET',
      });
    },
  },
};
