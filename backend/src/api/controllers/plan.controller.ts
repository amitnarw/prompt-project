import { type Request, type Response } from 'express';
import { sendError, sendSuccess } from '@/utils/response';

export const getPlans = async (req: Request, res: Response) => {
  try {
    return sendSuccess(res, [], 'Plans placeholder');
  } catch (error) {
    return sendError(res, 400, error instanceof Error ? error.message : 'Unknown error');
  }
};
