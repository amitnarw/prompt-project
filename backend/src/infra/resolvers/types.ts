export interface ResolverResult {
  source: ResolverSource;
  data?: any;
  message?: string;
}

export type ResolverSource = 'cache' | 'db' | 'queued' | 'error';

export interface ResolverContext {
  keyword?: string;
  country?: string;
  language?: string;
  device?: string;
  userId?: string;
  force?: boolean;
}
