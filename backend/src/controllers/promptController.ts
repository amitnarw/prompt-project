import type { Response } from 'express';
import { promptService } from '../services/promptService.js';
import { voteService } from '../services/voteService.js';
import type { AuthenticatedRequest, CreatePromptInput, UpdatePromptInput } from '../types/index.js';

const getParamId = (param: string | string[] | undefined): string => {
  if (Array.isArray(param)) return param[0] || '';
  return param || '';
};

export const getPrompts = async (req: AuthenticatedRequest, res: Response) => {
  const result = await promptService.findAll({
    page: req.query.page as string,
    limit: req.query.limit as string,
    category: req.query.category as string,
    search: req.query.search as string,
    tags: req.query.tags as string,
    sortBy: req.query.sortBy as string,
    isVerified: req.query.isVerified as string,
    modelType: req.query.modelType as string,
    bookmarkedBy: req.query.bookmarkedBy as string,
    collectionId: req.query.collectionId as string,
  });

  res.json({
    success: true,
    data: result.prompts,
    pagination: result.pagination,
  });
};

export const getPromptById = async (req: AuthenticatedRequest, res: Response) => {
  const id = getParamId(req.params.id);
  const prompt = await promptService.findById(id);

  res.json({
    success: true,
    data: prompt,
  });
};

export const createPrompt = async (req: AuthenticatedRequest, res: Response) => {
  const input: CreatePromptInput = req.body;
  const prompt = await promptService.create(input);

  res.status(201).json({
    success: true,
    data: prompt,
    message: 'Prompt created successfully',
  });
};

export const updatePrompt = async (req: AuthenticatedRequest, res: Response) => {
  const id = getParamId(req.params.id);
  const input: UpdatePromptInput = req.body;
  const prompt = await promptService.update(id, input);

  res.json({
    success: true,
    data: prompt,
    message: 'Prompt updated successfully',
  });
};

export const deletePrompt = async (req: AuthenticatedRequest, res: Response) => {
  const id = getParamId(req.params.id);
  await promptService.delete(id);

  res.json({
    success: true,
    message: 'Prompt deleted successfully',
  });
};

export const upvotePrompt = async (req: AuthenticatedRequest, res: Response) => {
  const id = getParamId(req.params.id);
  const userId = req.userId || req.ip || 'anonymous';
  const result = await voteService.markWorks(id, userId);

  res.json({
    success: true,
    data: result,
    message: 'Vote recorded successfully',
  });
};

export const downvotePrompt = async (req: AuthenticatedRequest, res: Response) => {
  const id = getParamId(req.params.id);
  const userId = req.userId || req.ip || 'anonymous';
  const result = await voteService.markDoesntWork(id, userId);

  res.json({
    success: true,
    data: result,
    message: 'Vote recorded successfully',
  });
};

export const forkPrompt = async (req: AuthenticatedRequest, res: Response) => {
  const id = getParamId(req.params.id);
  const userId = req.body.userId || req.userId || 'anonymous';
  const prompt = await promptService.fork(id, userId);

  res.status(201).json({
    success: true,
    data: prompt,
    message: 'Prompt forked successfully',
  });
};

export const getPromptVersions = async (req: AuthenticatedRequest, res: Response) => {
  const id = getParamId(req.params.id);
  const versions = await promptService.getVersions(id);

  res.json({
    success: true,
    data: versions,
  });
};

export const verifyPrompt = async (req: AuthenticatedRequest, res: Response) => {
  const id = getParamId(req.params.id);
  const verifiedBy = req.userId || 'admin';
  const prompt = await promptService.verifyPrompt(id, verifiedBy);

  res.json({
    success: true,
    data: prompt,
    message: 'Prompt verified successfully',
  });
};

export const unverifyPrompt = async (req: AuthenticatedRequest, res: Response) => {
  const id = getParamId(req.params.id);
  const prompt = await promptService.unverifyPrompt(id);

  res.json({
    success: true,
    data: prompt,
    message: 'Prompt unverification removed',
  });
};
