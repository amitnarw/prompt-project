import { Router } from 'express';
import { runPrompt } from '../controllers/playgroundController.js';

const router: Router = Router();

router.post('/run', runPrompt);

export default router;
