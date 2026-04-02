import { Response } from 'express';
import { playgroundService } from '../services/playgroundService.js';
import { AuthenticatedRequest, PlaygroundInput } from '../types/index.js';

export const runPrompt = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const input: PlaygroundInput = req.body;

  if (!input.prompt) {
    res.status(400).json({
      success: false,
      error: 'Prompt content is required',
    });
    return;
  }

  const result = await playgroundService.executePrompt(input);

  res.json({
    success: true,
    data: result,
  });
};
