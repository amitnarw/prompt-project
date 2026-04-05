import { redis } from '@/infra/redis';

export async function acquireLock(key: string, ttl = 60): Promise<boolean> {
  const res = await redis.set(key, '1', 'EX', ttl, 'NX');
  return res === 'OK';
}

export async function releaseLock(key: string): Promise<void> {
  await redis.del(key);
}
