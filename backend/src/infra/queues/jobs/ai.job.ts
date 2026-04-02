import { keys } from "@/infra/keys";
import { aiQueue } from "@/infra/queues";
import { logger } from "@/utils/logger";

export async function addAiJob(data: { prompt: string; userId?: string }) {
  const jobId = `ai-${Date.now()}`;

  try {
    await aiQueue.add(
      "process-ai",
      { ...data, jobId },
      {
        jobId,
        attempts: 3,
        backoff: { type: "exponential", delay: 2000 },
        removeOnComplete: true,
        removeOnFail: true,
      }
    );
  } catch (err: any) {
    logger.error("Failed to add AI job", { error: err.message });
  }
}
