export const keys = {
  keyword: (keyword: string, country = "global", language = "global") =>
    `keyword:${keyword}:${country}:${language}`,

  keywordRelatedKeywords: (keyword: string, locationCode: string | undefined, language: string | undefined) =>
    `keyword:related:${keyword}:${locationCode ?? "global"}:${language ?? "global"}`,

  keywordResearch: (keyword: string, locationCode: string | undefined, language: string | undefined) =>
    `keyword:research:${keyword}:${locationCode ?? "global"}:${language ?? "global"}`,

  keywordMetrics: (keyword: string, country = "global", language = "global") =>
    `keyword:metrics:${keyword}:${country}:${language}`,

  serp: (keyword: string, country = "global", language = "global", device = "desktop") =>
    `serp:${keyword}:${country}:${language}:${device}`,

  domain: (domain: string) => `domain:${domain}`,

  domainMetrics: (domain: string, provider = "default") => `domain:metrics:${domain}:${provider}`,

  domainBacklinks: (domain: string) => `domain:backlinks:${domain}`,

  ranking: (projectId: string, keyword: string, country = "global") =>
    `ranking:project:${projectId}:keyword:${keyword}:${country}`,

  aiPrompt: (promptId: string) => `ai:prompt:${promptId}`,

  jobLock: (jobKey: string) => `lock:${jobKey}`,

  dashboard: (userId: string) => `dashboard:${userId}`,

  session: (userId: string) => `session:${userId}`,
};
