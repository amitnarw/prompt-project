import { Router } from 'express';
import { connect } from '@/api/controllers/sse.controller.js';
import { checkAuthentication } from '@/api/middlewares/checkAuthentication.js';

const router: Router = Router();

router.get('/connect', checkAuthentication, connect);

export default router;
