import { Router } from 'express';
import { runPrompt, getUsage } from '@/api/controllers/playground.controller.js';
import { checkAuthentication } from '@/api/middlewares/checkAuthentication.js';

const router: Router = Router();

router.post('/run', checkAuthentication, runPrompt);
router.get('/usage', checkAuthentication, getUsage);

export default router;
