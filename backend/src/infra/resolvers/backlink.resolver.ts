import type { ResolverResult } from "./types.js";

export async function resolveBacklinks(params: {
  target: string;
  userId?: string;
  force?: boolean;
}): Promise<ResolverResult> {
  return {
    source: "error",
    message: "Backlink resolver not implemented - add your own implementation",
  };
}
