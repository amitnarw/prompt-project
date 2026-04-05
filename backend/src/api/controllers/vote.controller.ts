import { type Request, type Response } from 'express';
import { voteService } from '@/services/voteService.js';
import { sendError, sendSuccess } from '@/utils/response.js';

const getParamId = (param: string | string[] | undefined): string => {
  if (Array.isArray(param)) return param[0] || '';
  return param || '';
};

export const markWorks = async (req: Request, res: Response) => {
  try {
    const id = getParamId(req.params.id);
    const userId = req.userId || req.ip || 'anonymous';
    const result = await voteService.markWorks(id, userId);
    return sendSuccess(res, result, 'Vote recorded successfully');
  } catch (error) {
    return sendError(res, 400, error instanceof Error ? error.message : 'Unknown error');
  }
};

export const markDoesntWork = async (req: Request, res: Response) => {
  try {
    const id = getParamId(req.params.id);
    const userId = req.userId || req.ip || 'anonymous';
    const result = await voteService.markDoesntWork(id, userId);
    return sendSuccess(res, result, 'Vote recorded successfully');
  } catch (error) {
    return sendError(res, 400, error instanceof Error ? error.message : 'Unknown error');
  }
};
