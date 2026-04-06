/**
 * Client-side auth helpers using better-auth's REST endpoints.
 */

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || '';

const getBaseUrl = () => {
  if (typeof window === 'undefined') return 'http://localhost:5000';
  return BASE_URL;
};

export interface User {
  id: string;
  email: string;
  name?: string;
  image?: string;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Session {
  id: string;
  userId: string;
  expiresAt: string;
  user: User;
}

export interface AuthError {
  error: string;
  message?: string;
}

async function authRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${getBaseUrl()}${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  const json = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(json?.error || json?.message || 'Auth error');
  }

  return json as T;
}

/**
 * Get the current session (null if not logged in).
 */
export async function getSession(): Promise<{ session: Session; user: User } | null> {
  try {
    const data = await authRequest<{ session: Session; user: User } | null>(
      '/api/auth/get-session',
      { method: 'GET' }
    );
    return data;
  } catch {
    return null;
  }
}

/**
 * Sign in with email and password.
 */
export async function signInWithEmail(email: string, password: string): Promise<{ session: Session; user: User }> {
  return authRequest('/api/auth/sign-in/email', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

/**
 * Sign up with email and password.
 */
export async function signUpWithEmail(
  email: string,
  password: string,
  name?: string
): Promise<{ session: Session; user: User }> {
  return authRequest('/api/auth/sign-up/email', {
    method: 'POST',
    body: JSON.stringify({ email, password, name }),
  });
}

/**
 * Sign in with Google (redirects to OAuth flow).
 */
export async function signInWithGoogle(): Promise<void> {
  const response = await authRequest<{ url: string }>('/api/auth/sign-in/social', {
    method: 'POST',
    body: JSON.stringify({
      provider: 'google',
      callbackURL: window.location.origin,
    }),
  });

  if (response?.url) {
    window.location.href = response.url;
  }
}

/**
 * Sign out the current user.
 */
export async function signOut(): Promise<void> {
  await authRequest('/api/auth/sign-out', { method: 'POST' });
}
