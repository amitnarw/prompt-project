import { Queue } from "bullmq";
import { redisConnection } from "@/config/redis";

export const keywordQueue = new Queue("keyword", { connection: redisConnection });
export const domainQueue = new Queue("domain", { connection: redisConnection });
export const serpQueue = new Queue("serp", { connection: redisConnection });
export const backlinkQueue = new Queue("backlink", { connection: redisConnection });
export const aiQueue = new Queue("ai", { connection: redisConnection });
