import { Router } from 'express';
import authRouter from './auth.route.js';
import userRouter from './user.route.js';
import adminRouter from './admin.route.js';
import planRouter from './plan.route.js';
import promptRouter from './prompt.route.js';
import playgroundRouter from './playground.route.js';
import bookmarkRouter from './bookmark.route.js';
import collectionRouter from './collection.route.js';

const router: Router = Router();

router.use('/auth', authRouter);
router.use('/user', userRouter);
router.use('/admin', adminRouter);
router.use('/plan', planRouter);
router.use('/prompts', promptRouter);
router.use('/playground', playgroundRouter);
router.use('/bookmarks', bookmarkRouter);
router.use('/collections', collectionRouter);

export default router;
