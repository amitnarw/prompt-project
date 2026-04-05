import { keys } from '@/infra/keys';
import { serpQueue } from '@/infra/queues';
import { logger } from '@/utils/logger';

export async function addSerpJob(data: {
  keyword: string;
  country?: string;
  language?: string;
  device?: 'desktop' | 'mobile' | 'tablet';
}) {
  const cacheKey = keys.serp(data.keyword, data.country, data.language, data.device);
  const jobId = `serp-${cacheKey.replace(/:/g, '-')}`;

  try {
    await serpQueue.add(
      'fetch-serp',
      { ...data, cacheKey },
      {
        jobId,
        attempts: 3,
        backoff: { type: 'exponential', delay: 2000 },
        removeOnComplete: true,
        removeOnFail: true,
      }
    );
  } catch (err: any) {
    logger.error('Failed to add SERP job', { error: err.message, keyword: data.keyword });
  }
}
