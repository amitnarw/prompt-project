import { keys } from '@/infra/keys';
import { backlinkQueue } from '@/infra/queues';
import { logger } from '@/utils/logger';

export async function addBacklinkJob(data: { target: string }) {
  const cacheKey = keys.domainBacklinks(data.target);
  const jobId = `backlink-${cacheKey.replace(/:/g, '-')}`;

  try {
    await backlinkQueue.add(
      'fetch-backlinks',
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
    logger.error('Failed to add backlink job', { error: err.message, target: data.target });
  }
}
