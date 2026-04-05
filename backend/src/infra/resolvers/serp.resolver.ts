import type { ResolverResult } from './types.js';

export async function resolveSerp(params: {
  keyword: string;
  country?: string;
  language?: string;
  device?: string;
  userId?: string;
  force?: boolean;
}): Promise<ResolverResult> {
  return {
    source: 'error',
    message: 'SERP resolver not implemented - add your own implementation',
  };
}
