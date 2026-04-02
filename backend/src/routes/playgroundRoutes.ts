import { Router } from 'express';
import { runPrompt } from '../controllers/playgroundController.js';
import { validateRequest, playgroundSchema } from '../middleware/validateRequest.js';

const router: Router = Router();

router.post(
  '/run',
  validateRequest({ body: playgroundSchema }),
  runPrompt
);

export default router;
