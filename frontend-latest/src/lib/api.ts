/**
 * Centralized API client for backend communication.
 * All requests include credentials (session cookie) automatically.
 */

// Use empty string base so requests go through Next.js proxy rewrites (/api/* → backend)
// Falls back to explicit URL for SSR or non-proxied environments
const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || '';

// For SSR contexts where relative URL won't work, use direct backend URL
const getBaseUrl = () => {
  if (typeof window === 'undefined') {
    // Server-side: use direct backend URL
    return 'http://localhost:5000';
  }
  return BASE_URL;
};

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: PaginationInfo;
}

class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public data?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${getBaseUrl()}${path}`;

  const response = await fetch(url, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  const json = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new ApiError(
      response.status,
      json.error || json.message || `HTTP ${response.status}`,
      json
    );
  }

  return json as T;
}

export const api = {
  get: <T>(path: string) => request<T>(path, { method: 'GET' }),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'POST', body: body ? JSON.stringify(body) : undefined }),
  put: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'PUT', body: body ? JSON.stringify(body) : undefined }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
};

export { ApiError };
