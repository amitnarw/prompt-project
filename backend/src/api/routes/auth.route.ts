import { Router, type Router as ExpressRouter } from "express";
import { toNodeHandler } from "better-auth/node";
import { auth } from "@/lib/auth.js";

const router: ExpressRouter = Router();

router.use(toNodeHandler(auth));

export default router;