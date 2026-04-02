import "dotenv/config";
import { app } from "./app.js";
import { logger } from "./utils/logger.js";

const PORT = parseInt(process.env.PORT || "5000");
const NODE_ENV = process.env.NODE_ENV || "development";

async function startServer() {
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
