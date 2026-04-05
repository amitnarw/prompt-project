import { Router } from 'express';
import {
  createCollection,
  updateCollection,
  deleteCollection,
  getCollection,
  getUserCollections,
  addPromptToCollection,
  removePromptFromCollection,
} from '@/api/controllers/collection.controller.js';
import { checkAuthentication } from '@/api/middlewares/checkAuthentication.js';

const router: Router = Router();

router.post('/', checkAuthentication, createCollection);
router.get('/', checkAuthentication, getUserCollections);
router.get('/:id', checkAuthentication, getCollection);
router.put('/:id', checkAuthentication, updateCollection);
router.delete('/:id', checkAuthentication, deleteCollection);
router.post('/:id/prompts', checkAuthentication, addPromptToCollection);
router.delete('/:id/prompts/:promptId', checkAuthentication, removePromptFromCollection);

export default router;
