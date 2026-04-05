import { Router } from 'express';
import {
  addBookmark,
  removeBookmark,
  getBookmarks,
  checkBookmark,
} from '@/api/controllers/bookmark.controller.js';
import { checkAuthentication } from '@/api/middlewares/checkAuthentication.js';

const router: Router = Router();

router.post('/', checkAuthentication, addBookmark);
router.delete('/:promptId', checkAuthentication, removeBookmark);
router.get('/', checkAuthentication, getBookmarks);
router.get('/:promptId/check', checkAuthentication, checkBookmark);

export default router;
