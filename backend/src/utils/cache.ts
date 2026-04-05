import { redis } from '@/infra/redis';

export async function getCache<T>(key: string): Promise<T | null> {
  const data = await redis.get(key);
  return data ? JSON.parse(data) : null;
}

export async function setCache(key: string, value: any, ttl: number) {
  await redis.set(key, JSON.stringify(value), 'EX', ttl);
}

export async function deleteCache(key: string) {
  await redis.del(key);
}
