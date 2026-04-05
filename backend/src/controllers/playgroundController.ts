import type { Response } from 'express';
import { playgroundService } from '../services/playgroundService.js';
import prisma from '../utils/prisma.js';
import type { AuthenticatedRequest, PlaygroundInput } from '../types/index.js';

// Daily prompt limits per plan
const PROMPT_LIMITS: Record<string, number> = {
  Free: 10,
  Pro: 50,
  Enterprise: -1, // unlimited
};

export const runPrompt = async (req: AuthenticatedRequest, res: Response) => {
  const input: PlaygroundInput = req.body;
  const userId = req.userId;

  if (!userId) {
    res.status(401).json({
      success: false,
      error: 'Authentication required',
    });
    return;
  }

  if (!input.prompt) {
    res.status(400).json({
      success: false,
      error: 'Prompt content is required',
    });
    return;
  }

  try {
    // Check usage limits
    const usageStats = await getUsageStatsInternal(userId);
    const limit = usageStats.planLimit;

    if (limit !== -1 && usageStats.todayCount >= limit) {
      res.status(429).json({
        success: false,
        error: `Daily limit reached. You've used all ${limit} prompts for today. Upgrade your plan for more.`,
        data: {
          limit: limit,
          used: usageStats.todayCount,
          remaining: 0,
          resetsAt: usageStats.resetsAt,
        },
      });
      return;
    }

    const result = await playgroundService.executePrompt(input, userId);

    res.json({
      success: true,
      data: {
        ...result,
        usage: {
          limit: limit,
          used: usageStats.todayCount + 1,
          remaining: limit === -1 ? -1 : Math.max(0, limit - usageStats.todayCount - 1),
          resetsAt: usageStats.resetsAt,
        },
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Execution failed';
    const statusCode = message.includes('Insufficient') ? 402 : message.includes('not found') ? 404 : 500;

    res.status(statusCode).json({
      success: false,
      error: message,
    });
  }
};

async function getUsageStatsInternal(userId: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Get user's plan
  const user = await prisma.user.findFirst({
    where: { id: userId },
    include: { accounts: true },
  });

  // Get daily usage count
  const usageCount = await prisma.usageLog.count({
    where: {
      userId,
      module: 'PLAYGROUND',
      createdAt: {
        gte: today,
        lt: tomorrow,
      },
    },
  });

  // Determine plan (default to Free if no plan found)
  let planLimit = PROMPT_LIMITS['Free'];
  // In a real app, you'd look up the user's subscription plan
  // For now, Enterprise users (those with Google accounts) get Pro limits
  if (user?.accounts.length && user.accounts.length > 0) {
    planLimit = PROMPT_LIMITS['Pro'];
  }

  return {
    todayCount: usageCount,
    planLimit,
    resetsAt: tomorrow.toISOString(),
  };
}

export const getUsage = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.userId;

  if (!userId) {
    res.status(401).json({
      success: false,
      error: 'Authentication required',
    });
    return;
  }

  try {
    const stats = await getUsageStatsInternal(userId);
    res.json({
      success: true,
      data: {
        used: stats.todayCount,
        limit: stats.planLimit,
        remaining: stats.planLimit === -1 ? -1 : Math.max(0, stats.planLimit - stats.todayCount),
        resetsAt: stats.resetsAt,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch usage',
    });
  }
};
