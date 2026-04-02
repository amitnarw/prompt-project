import type { ResolverResult } from "./types.js";

export async function resolveAI(params: {
  prompt: string;
  userId?: string;
  force?: boolean;
}): Promise<ResolverResult> {
  return {
    source: "error",
    message: "AI resolver not implemented - add your own implementation",
  };
}
