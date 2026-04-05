import { keys } from '@/infra/keys';
import { domainQueue } from '@/infra/queues';
import { logger } from '@/utils/logger';

export async function addDomainMetricsJob(data: { domain: string }) {
  const cacheKey = keys.domain(data.domain);
  const jobId = `domain-metrics-${cacheKey.replace(/:/g, '-')}`;

  try {
    await domainQueue.add(
      'fetch-domain-metrics',
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
    logger.error('Failed to add domain metrics job', { error: err.message, domain: data.domain });
  }
}

export async function addDomainBacklinksJob(data: { domain: string }) {
  const cacheKey = keys.domainBacklinks(data.domain);
  const jobId = `domain-backlinks-${cacheKey.replace(/:/g, '-')}`;

  try {
    await domainQueue.add(
      'fetch-domain-backlinks',
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
    logger.error('Failed to add domain backlinks job', { error: err.message, domain: data.domain });
  }
}
