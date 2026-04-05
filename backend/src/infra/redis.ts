import Redis from 'ioredis';
import { redisConnection } from '@/config/redis';

export const redis = new Redis({
  ...redisConnection,
  maxRetriesPerRequest: 3,
  enableReadyCheck: true,
  retryStrategy: (times: number) => Math.min(times * 50, 2000),
});

redis.on('connect', () => {
  // Redis connected
});

redis.on('error', (err: Error) => {
  if ((err as any).code === 'ECONNREFUSED') {
    // Handled in server.ts startup
  }
});
