import { keys } from "@/infra/keys";
import { keywordQueue } from "@/infra/queues";
import { logger } from "@/utils/logger";

export async function addMainKeywordResearchJobs(data: {
  keyword: string;
  country?: string;
  language?: string;
}) {
  await Promise.all([
    addKeywordVolumeJob(data),
    addKeywordDifficultyJob(data),
    addKeywordIntentJob(data),
  ]);
}

export async function addKeywordMetricsJob(data: {
  keyword: string;
  country?: string;
  language?: string;
}) {
  const cacheKey = keys.keyword(data.keyword, data.country, data.language);
  const jobId = `keyword-metrics-${cacheKey.replace(/:/g, "-")}`;

  try {
    await keywordQueue.add(
      "fetch-keyword-metrics",
      { ...data, cacheKey },
      {
        jobId,
        attempts: 3,
        backoff: { type: "exponential", delay: 2000 },
        removeOnComplete: true,
        removeOnFail: true,
      }
    );
  } catch (err: any) {
    logger.error("Failed to add keyword metrics job", { error: err.message, keyword: data.keyword });
  }
}

export async function addKeywordVolumeJob(data: { keyword: string; country?: string; language?: string }) {
  const cacheKey = keys.keyword(data.keyword, data.country, data.language);
  const jobId = `volume-${cacheKey.replace(/:/g, "-")}`;

  try {
    await keywordQueue.add(
      "fetch-keyword-volume",
      { ...data, cacheKey },
      { jobId, attempts: 2, removeOnComplete: true, removeOnFail: true }
    );
  } catch (err: any) {
    logger.error("Failed to add volume job", { error: err.message, keyword: data.keyword });
  }
}

export async function addKeywordDifficultyJob(data: { keyword: string; country?: string; language?: string }) {
  const cacheKey = keys.keyword(data.keyword, data.country, data.language);
  const jobId = `difficulty-${cacheKey.replace(/:/g, "-")}`;

  try {
    await keywordQueue.add(
      "fetch-keyword-difficulty",
      { ...data, cacheKey },
      { jobId, attempts: 2, removeOnComplete: true, removeOnFail: true }
    );
  } catch (err: any) {
    logger.error("Failed to add difficulty job", { error: err.message, keyword: data.keyword });
  }
}

export async function addKeywordIntentJob(data: { keyword: string; country?: string; language?: string }) {
  const cacheKey = keys.keyword(data.keyword, data.country, data.language);
  const jobId = `intent-${cacheKey.replace(/:/g, "-")}`;

  try {
    await keywordQueue.add(
      "fetch-keyword-intent",
      { ...data, cacheKey },
      { jobId, attempts: 2, removeOnComplete: true, removeOnFail: true }
    );
  } catch (err: any) {
    logger.error("Failed to add intent job", { error: err.message, keyword: data.keyword });
  }
}

export async function addKeywordRefinerJob(data: {
  keyword: string;
  locationCode?: number | string;
  languageName?: string;
  country?: string;
  language?: string;
}) {
  const locCode = (data.locationCode || data.country)?.toString();
  const langCode = data.language;
  const cacheKey = keys.keywordRelatedKeywords(data.keyword, locCode, langCode);
  const jobId = `related-keywords-${cacheKey.replace(/:/g, "-")}-${Date.now()}`;

  try {
    await keywordQueue.add(
      "fetch-related-keywords",
      { ...data, cacheKey },
      {
        jobId,
        attempts: 3,
        backoff: { type: "exponential", delay: 2000 },
        removeOnComplete: true,
        removeOnFail: true,
      }
    );
  } catch (err: any) {
    logger.error(`Failed to add related-keywords job for ${data.keyword}:`, { error: err.message });
  }
}

export async function addKeywordResearchJob(data: {
  keyword: string;
  locationCode?: number | string;
  languageName?: string;
  country?: string;
  language?: string;
}) {
  const locCode = (data.locationCode || data.country)?.toString();
  const langCode = data.language;
  const cacheKey = keys.keywordResearch(data.keyword, locCode, langCode);
  const jobId = `keyword-research-${cacheKey.replace(/:/g, "-")}`;

  try {
    await keywordQueue.add(
      "fetch-keyword-research",
      { ...data, cacheKey },
      {
        jobId,
        attempts: 3,
        backoff: { type: "exponential", delay: 2000 },
        removeOnComplete: true,
        removeOnFail: true,
      }
    );
  } catch (err: any) {
    logger.error(`Failed to add keyword research job for ${data.keyword}:`, { error: err.message });
  }
}
