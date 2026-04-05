import { Router } from 'express';
import { runPrompt } from '@/api/controllers/playground.controller.js';
import { checkAuthentication } from '@/api/middlewares/checkAuthentication.js';

const router: Router = Router();

router.post('/run', checkAuthentication, runPrompt);

export default router;
