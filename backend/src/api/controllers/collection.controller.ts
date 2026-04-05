import { type Request, type Response } from 'express';
import { collectionService } from '@/services/collectionService.js';
import { sendError, sendSuccess } from '@/utils/response.js';
import type { AuthenticatedRequest } from '@/types/index.js';

const getParamId = (param: string | string[] | undefined): string => {
  if (Array.isArray(param)) return param[0] || '';
  return param || '';
};

export const createCollection = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) return sendError(res, 401, 'Unauthorized');

    const { name, description } = req.body;
    if (!name) return sendError(res, 400, 'name is required');

    const collection = await collectionService.create(userId, { name, description });
    return sendSuccess(res, collection, 'Collection created successfully', 201);
  } catch (error) {
    return sendError(res, 400, error instanceof Error ? error.message : 'Unknown error');
  }
};

export const updateCollection = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) return sendError(res, 401, 'Unauthorized');

    const id = getParamId(req.params.id);
    const { name, description } = req.body;

    const collection = await collectionService.update(id, userId, { name, description });
    return sendSuccess(res, collection, 'Collection updated successfully');
  } catch (error) {
    return sendError(res, 400, error instanceof Error ? error.message : 'Unknown error');
  }
};

export const deleteCollection = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) return sendError(res, 401, 'Unauthorized');

    const id = getParamId(req.params.id);
    await collectionService.delete(id, userId);
    return sendSuccess(res, null, 'Collection deleted successfully');
  } catch (error) {
    return sendError(res, 400, error instanceof Error ? error.message : 'Unknown error');
  }
};

export const getCollection = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) return sendError(res, 401, 'Unauthorized');

    const id = getParamId(req.params.id);
    const collection = await collectionService.getById(id, userId);
    return sendSuccess(res, collection, 'ok');
  } catch (error) {
    return sendError(res, 400, error instanceof Error ? error.message : 'Unknown error');
  }
};

export const getUserCollections = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) return sendError(res, 401, 'Unauthorized');

    const collections = await collectionService.getUserCollections(userId);
    return sendSuccess(res, collections, 'ok');
  } catch (error) {
    return sendError(res, 400, error instanceof Error ? error.message : 'Unknown error');
  }
};

export const addPromptToCollection = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) return sendError(res, 401, 'Unauthorized');

    const collectionId = getParamId(req.params.id);
    const { promptId } = req.body;
    if (!promptId) return sendError(res, 400, 'promptId is required');

    const result = await collectionService.addPrompt(collectionId, promptId, userId);
    return sendSuccess(res, result, 'Prompt added to collection', 201);
  } catch (error) {
    return sendError(res, 400, error instanceof Error ? error.message : 'Unknown error');
  }
};

export const removePromptFromCollection = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) return sendError(res, 401, 'Unauthorized');

    const collectionId = getParamId(req.params.id);
    const promptId = getParamId(req.params.promptId);

    await collectionService.removePrompt(collectionId, promptId, userId);
    return sendSuccess(res, null, 'Prompt removed from collection');
  } catch (error) {
    return sendError(res, 400, error instanceof Error ? error.message : 'Unknown error');
  }
};
