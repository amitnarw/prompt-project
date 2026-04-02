import { Router } from "express";
import authRouter from "./auth.route.js";
import userRouter from "./user.route.js";
import adminRouter from "./admin.route.js";
import sseRouter from "./sse.route.js";
import planRouter from "./plan.route.js";
import promptRouter from "./prompt.route.js";
import playgroundRouter from "./playground.route.js";
import seoRouter from "./seo/index.js";

const router = Router();

router.use("/auth", authRouter);
router.use("/user", userRouter);
router.use("/admin", adminRouter);
router.use("/sse", sseRouter);
router.use("/plan", planRouter);
router.use("/prompts", promptRouter);
router.use("/playground", playgroundRouter);
router.use("/seo", seoRouter);

export default router;
