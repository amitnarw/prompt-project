import type { ResolverResult } from "./types.js";

export async function resolveDomain(params: {
  domain: string;
  userId?: string;
  force?: boolean;
}): Promise<ResolverResult> {
  return {
    source: "error",
    message: "Domain resolver not implemented - add your own implementation",
  };
}
