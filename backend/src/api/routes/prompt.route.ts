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
  verifyPrompt,
  unverifyPrompt,
} from '@/api/controllers/prompt.controller.js';
import { checkAuthentication } from '@/api/middlewares/checkAuthentication.js';
import { checkAuthorization } from '@/api/middlewares/checkAuthorization.js';
import {
  createPromptSchema,
  updatePromptSchema,
  forkPromptSchema,
  idParamSchema,
  paginationQuerySchema,
} from '../../../src/middleware/validateRequest.js';

const router: Router = Router();

// Public routes - no authentication required
router.get('/', getPrompts);
router.get('/:id', getPromptById);
router.get('/:id/versions', getPromptVersions);

// Protected routes - require authentication
router.post('/', checkAuthentication, createPrompt);
router.put('/:id', checkAuthentication, updatePrompt);
router.delete('/:id', checkAuthentication, deletePrompt);
router.post('/:id/upvote', checkAuthentication, upvotePrompt);
router.post('/:id/downvote', checkAuthentication, downvotePrompt);
router.post('/:id/fork', checkAuthentication, forkPrompt);

// Admin-only: verify/unverify prompts
router.post('/:id/verify', checkAuthentication, checkAuthorization('prompt', 'canUpdate'), verifyPrompt);
router.delete('/:id/verify', checkAuthentication, checkAuthorization('prompt', 'canUpdate'), unverifyPrompt);

export default router;
