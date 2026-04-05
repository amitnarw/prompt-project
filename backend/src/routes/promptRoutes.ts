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

const router: Router = Router();

router.get('/', getPrompts);

router.get('/:id', getPromptById);

router.post('/', createPrompt);

router.put('/:id', updatePrompt);

router.delete('/:id', deletePrompt);

router.post('/:id/upvote', upvotePrompt);

router.post('/:id/downvote', downvotePrompt);

router.post('/:id/fork', forkPrompt);

router.get('/:id/versions', getPromptVersions);

export default router;
