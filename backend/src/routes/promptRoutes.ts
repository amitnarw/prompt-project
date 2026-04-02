import { Router } from 'express';
import {
  getPrompts,
  getPromptById,
  createPrompt,
  updatePrompt,
  deletePrompt,
  upvotePrompt,
  downvotePrompt,
  forkPrompt,
  getPromptVersions,
} from '../controllers/promptController.js';
import {
  validateRequest,
  createPromptSchema,
  updatePromptSchema,
  forkPromptSchema,
  idParamSchema,
  paginationQuerySchema,
} from '../middleware/validateRequest.js';

const router: Router = Router();

router.get(
  '/',
  validateRequest({ query: paginationQuerySchema }),
  getPrompts
);

router.get(
  '/:id',
  validateRequest({ params: idParamSchema }),
  getPromptById
);

router.post(
  '/',
  validateRequest({ body: createPromptSchema }),
  createPrompt
);

router.put(
  '/:id',
  validateRequest({
    params: idParamSchema,
    body: updatePromptSchema,
  }),
  updatePrompt
);

router.delete(
  '/:id',
  validateRequest({ params: idParamSchema }),
  deletePrompt
);

router.post(
  '/:id/upvote',
  validateRequest({ params: idParamSchema }),
  upvotePrompt
);

router.post(
  '/:id/downvote',
  validateRequest({ params: idParamSchema }),
  downvotePrompt
);

router.post(
  '/:id/fork',
  validateRequest({
    params: idParamSchema,
    body: forkPromptSchema,
  }),
  forkPrompt
);

router.get(
  '/:id/versions',
  validateRequest({ params: idParamSchema }),
  getPromptVersions
);

export default router;
