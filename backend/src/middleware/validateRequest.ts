import { type Request, type Response, type NextFunction } from 'express';

export const validateRequest = () => {
  return (_req: Request, _res: Response, next: NextFunction) => {
    next();
  };
};

export const createPromptSchema = {};

export const updatePromptSchema = {};

export const forkPromptSchema = {};

export const playgroundSchema = {};

export const idParamSchema = {};

export const paginationQuerySchema = {};
