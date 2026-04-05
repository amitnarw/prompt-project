import type { Response } from 'express';
import { playgroundService } from '../services/playgroundService.js';
import type { AuthenticatedRequest, PlaygroundInput } from '../types/index.js';

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
    const result = await playgroundService.executePrompt(input, userId);

    res.json({
      success: true,
      data: result,
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
