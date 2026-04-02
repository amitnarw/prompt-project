import "dotenv/config";
import { app } from "./app.js";
import { redis } from "./infra/redis.js";
import { logger } from "./utils/logger.js";
import fs from "fs";
import path from "path";

const PORT = parseInt(process.env.PORT || "5000");
const NODE_ENV = process.env.NODE_ENV || "development";

// Ensure logs directory exists
const logsDir = path.join(process.cwd(), "logs");
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Redis connectivity check before loading workers
redis.on("connect", () => {
  logger.info("Redis connected successfully");
});

redis.on("error", (err) => {
  if (err.code === "ECONNREFUSED") {
    logger.error("Redis connection refused. Is Redis running? Check REDIS_HOST/REDIS_PORT in .env");
  } else {
    logger.error("Redis error: %s", err.message);
  }
});

// Verify Redis connection
async function checkRedis() {
  try {
    await redis.ping();
    logger.info("Redis ping successful");
    return true;
  } catch (error) {
    logger.error("Redis not available - some features may be degraded");
    return false;
  }
}

async function startServer() {
  await checkRedis();

  // Load workers (disabled for now - add your own workers)
  // const workers = await import("./infra/workers/index.js");

  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
    logger.info(`Environment: ${NODE_ENV}`);
    logger.info(`Health check: http://localhost:${PORT}/health`);
    logger.info(`API base: http://localhost:${PORT}/api`);
  });
}

startServer().catch((err) => {
  logger.error("Failed to start server:", err);
  process.exit(1);
});
