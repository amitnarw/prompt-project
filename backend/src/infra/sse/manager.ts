import type { Request, Response } from 'express';
import { createChannel, createSession, type Channel } from 'better-sse';
import Redis from 'ioredis';
import { redisConnection } from '@/config/redis';
import { redis as pubClient } from '@/infra/redis';
import { logger } from '@/utils/logger';

const userChannels = new Map<string, Channel>();

const subClient = new Redis(redisConnection);
const REDIS_CHANNEL = 'sse:events';

subClient.subscribe(REDIS_CHANNEL, err => {
  if (err) {
    logger.error('[SSE:Manager] Redis subscribe failed: %s', err.message);
  } else {
    logger.info('[SSE:Manager] Subscribed to Redis channel: %s', REDIS_CHANNEL);
  }
});

subClient.on('message', (channel, message) => {
  if (channel !== REDIS_CHANNEL) return;

  try {
    const { userId, event, data } = JSON.parse(message);

    if (userId === '_BROADCAST_') {
      for (const userChannel of userChannels.values()) {
        userChannel.broadcast(data, event);
      }
    } else {
      const userChannel = userChannels.get(userId);
      if (userChannel) {
        userChannel.broadcast(data, event);
      }
    }
  } catch (error) {
    logger.error('[SSE:Manager] Failed to handle Redis message: %o', error);
  }
});

export const registerClient = async (userId: string, req: Request, res: Response) => {
  const session = await createSession(req, res);

  if (!userChannels.has(userId)) {
    userChannels.set(userId, createChannel());
  }

  const userChannel = userChannels.get(userId)!;
  userChannel.register(session);

  session.push({ message: 'SSE connected', userId }, 'connected');

  logger.debug('[SSE:Manager] User %s connected', userId);

  session.on('disconnected', () => {
    if (userChannel.sessionCount === 0) {
      userChannels.delete(userId);
    }
  });

  return session;
};

export const sendToUser = (userId: string, event: string, data: unknown): void => {
  pubClient.publish(REDIS_CHANNEL, JSON.stringify({ userId, event, data })).catch(err => {
    logger.error('[SSE:Manager] Redis publish failed: %s', err.message);
  });
};

export const broadcast = (event: string, data: unknown): void => {
  pubClient
    .publish(REDIS_CHANNEL, JSON.stringify({ userId: '_BROADCAST_', event, data }))
    .catch(err => logger.error('[SSE:Manager] Redis broadcast publish failed: %s', err.message));
};

export const isConnected = (userId: string): boolean => {
  return (userChannels.get(userId)?.sessionCount ?? 0) > 0;
};

const getWaitersKey = (jobId: string) => `sse:waiters:${jobId}`;

export const subscribeToJob = async (jobId: string, userId: string): Promise<void> => {
  const key = getWaitersKey(jobId);
  const redis = pubClient;

  try {
    const waiterTtl = Number(process.env.REDIS_TTL_SSE_WAITERS) || 600;
    await redis.sadd(key, userId);
    await redis.expire(key, waiterTtl);
    logger.debug('[SSE:Manager] User %s subscribed to jobId: %s', userId, jobId);
  } catch (error) {
    logger.error('[SSE:Manager] subscribeToJob failed: %o', error);
  }
};

export const notifyWaiters = async (jobId: string, event: string, data: unknown): Promise<void> => {
  const key = getWaitersKey(jobId);
  const redis = pubClient;

  try {
    const waiters = await redis.smembers(key);

    if (waiters.length === 0) {
      await redis.del(key).catch(() => {});
      return;
    }

    logger.info('[SSE:Manager] Notifying %d waiters for jobId: %s', waiters.length, jobId);

    for (const waiterId of waiters) {
      sendToUser(waiterId, event, data);
    }

    await redis.del(key);
  } catch (error) {
    logger.error('[SSE:Manager] notifyWaiters failed: %o', error);
  }
};

export const getLocalTotalConnections = (): number => {
  let count = 0;
  for (const channel of userChannels.values()) {
    count += channel.sessionCount;
  }
  return count;
};

export const sseManager = {
  registerClient,
  sendToUser,
  broadcast,
  isConnected,
  getLocalTotalConnections,
  subscribeToJob,
  notifyWaiters,
};
