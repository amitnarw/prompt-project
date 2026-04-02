import Redis from "ioredis";
import { redisConnection } from "@/config/redis";

export const redis = new Redis({
  ...redisConnection,
  maxRetriesPerRequest: 3,
  enableReadyCheck: true,
  retryStrategy: (times) => Math.min(times * 50, 2000),
});

redis.on("connect", () => {
  // Redis connected
});

redis.on("error", (err) => {
  if (err.code === "ECONNREFUSED") {
    // Handled in server.ts startup
  }
});
