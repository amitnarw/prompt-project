import { type Request, type Response } from 'express';
import { bookmarkService } from '@/services/bookmarkService.js';
import { sendError, sendSuccess } from '@/utils/response.js';
import type { AuthenticatedRequest } from '@/types/index.js';

const getParamId = (param: string | string[] | undefined): string => {
  if (Array.isArray(param)) return param[0] || '';
  return param || '';
};

export const addBookmark = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) return sendError(res, 401, 'Unauthorized');

    const promptId = req.body.promptId;
    if (!promptId) return sendError(res, 400, 'promptId is required');

    const bookmark = await bookmarkService.addBookmark(userId, promptId);
    return sendSuccess(res, bookmark, 'Bookmark added successfully', 201);
  } catch (error) {
    return sendError(res, 400, error instanceof Error ? error.message : 'Unknown error');
  }
};

export const removeBookmark = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) return sendError(res, 401, 'Unauthorized');

    const promptId = getParamId(req.params.promptId);
    await bookmarkService.removeBookmark(userId, promptId);
    return sendSuccess(res, null, 'Bookmark removed successfully');
  } catch (error) {
    return sendError(res, 400, error instanceof Error ? error.message : 'Unknown error');
  }
};

export const getBookmarks = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) return sendError(res, 401, 'Unauthorized');

    const page = parseInt(String(req.query.page || '1'), 10);
    const limit = parseInt(String(req.query.limit || '20'), 10);

    const result = await bookmarkService.getUserBookmarks(userId, page, limit);
    return sendSuccess(res, result.bookmarks, 'ok');
  } catch (error) {
    return sendError(res, 400, error instanceof Error ? error.message : 'Unknown error');
  }
};

export const checkBookmark = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) return sendError(res, 401, 'Unauthorized');

    const promptId = getParamId(req.params.promptId);
    const isBookmarked = await bookmarkService.isBookmarked(userId, promptId);
    return sendSuccess(res, { isBookmarked }, 'ok');
  } catch (error) {
    return sendError(res, 400, error instanceof Error ? error.message : 'Unknown error');
  }
};
