import type { ResolverResult } from './types.js';

export async function resolveKeyword(params: {
  keyword: string;
  country?: string;
  language?: string;
  userId?: string;
  force?: boolean;
}): Promise<ResolverResult> {
  return {
    source: 'error',
    message: 'Keyword resolver not implemented - add your own implementation',
  };
}

export async function resolveKeywordRefiner(params: {
  keyword: string;
  locationCode?: number | string;
  languageName?: string;
  country?: string;
  language?: string;
  userId?: string;
  force?: boolean;
}): Promise<ResolverResult> {
  return {
    source: 'error',
    message: 'Keyword refiner not implemented - add your own implementation',
  };
}

export async function resolveKeywordResearch(params: {
  keyword: string;
  locationCode?: number | string;
  languageName?: string;
  country?: string;
  language?: string;
  userId?: string;
  force?: boolean;
}): Promise<ResolverResult> {
  return {
    source: 'error',
    message: 'Keyword research not implemented - add your own implementation',
  };
}
